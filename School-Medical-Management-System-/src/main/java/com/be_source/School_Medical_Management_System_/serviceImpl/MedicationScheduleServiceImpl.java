package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import com.be_source.School_Medical_Management_System_.model.*;
import com.be_source.School_Medical_Management_System_.repository.InventoryRepository;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.repository.MedicationScheduleRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.request.MedicationScheduleRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationScheduleResponse;
import com.be_source.School_Medical_Management_System_.service.MedicationScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationScheduleServiceImpl implements MedicationScheduleService {

    private final MedicationScheduleRepository scheduleRepository;
    private final MedicationRequestRepository requestRepository;
    private final StudentRepository studentRepository;
    private final UserUtilService userUtilService;
    private final InventoryRepository inventoryRepository;

    @Override
    public MedicationScheduleResponse getById(Long id) {
        MedicationSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        return mapToResponse(schedule);
    }

    @Override
    public MedicationScheduleResponse create(MedicationScheduleRequest request) {
        MedicationRequest medicationRequest = requestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Medication request not found"));

        int dispensed = request.getDispensedQuantity();
        if (dispensed <= 0) throw new RuntimeException("Dispensed quantity must be greater than 0");

        Inventory inventory = medicationRequest.getInventory();
        if (inventory == null) throw new RuntimeException("No inventory linked to this medication request");

        if (inventory.getTotalQuantity() < dispensed)
            throw new RuntimeException("Insufficient stock in inventory");

        if (medicationRequest.getTotalQuantity() < dispensed)
            throw new RuntimeException("Dispensed quantity exceeds remaining request quantity");

        // Trừ kho và request
        inventory.setTotalQuantity(inventory.getTotalQuantity() - dispensed);
        medicationRequest.setTotalQuantity(medicationRequest.getTotalQuantity() - dispensed);
        medicationRequest.setIsSufficientStock(inventory.getTotalQuantity() >= medicationRequest.getTotalQuantity());

        // ✅ Cập nhật trạng thái confirmation
        if (medicationRequest.getTotalQuantity() == 0) {
            medicationRequest.setConfirmationStatus(ConfirmationStatus.done);
        } else {
            medicationRequest.setConfirmationStatus(ConfirmationStatus.in_progress);
        }

        // Tạo schedule mới
        MedicationSchedule schedule = new MedicationSchedule();
        schedule.setRequest(medicationRequest);
        schedule.setStudent(medicationRequest.getStudent());
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setNotes(request.getNotes());
        schedule.setDispensedQuantity(dispensed);
        schedule.setAdministeredBy(userUtilService.getCurrentUser());

        inventoryRepository.save(inventory);
        requestRepository.save(medicationRequest);
        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public MedicationScheduleResponse update(Long id, MedicationScheduleRequest request) {
        MedicationSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        MedicationRequest medicationRequest = requestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Medication request not found"));

        Inventory inventory = medicationRequest.getInventory();
        if (inventory == null) throw new RuntimeException("No inventory linked");

        int oldQty = schedule.getDispensedQuantity();
        int newQty = request.getDispensedQuantity();

        if (newQty <= 0) throw new RuntimeException("Dispensed quantity must be greater than 0");

        // Hoàn lại số cũ
        inventory.setTotalQuantity(inventory.getTotalQuantity() + oldQty);
        medicationRequest.setTotalQuantity(medicationRequest.getTotalQuantity() + oldQty);

        if (inventory.getTotalQuantity() < newQty)
            throw new RuntimeException("Insufficient inventory stock");

        if (medicationRequest.getTotalQuantity() < newQty)
            throw new RuntimeException("Dispensed quantity exceeds medication request's available quantity");

        // Trừ số mới
        inventory.setTotalQuantity(inventory.getTotalQuantity() - newQty);
        medicationRequest.setTotalQuantity(medicationRequest.getTotalQuantity() - newQty);
        medicationRequest.setIsSufficientStock(inventory.getTotalQuantity() >= medicationRequest.getTotalQuantity());

        // ✅ Cập nhật lại trạng thái confirmation
        if (medicationRequest.getTotalQuantity() == 0) {
            medicationRequest.setConfirmationStatus(ConfirmationStatus.done);
        } else {
            medicationRequest.setConfirmationStatus(ConfirmationStatus.in_progress);
        }

        // Cập nhật schedule
        schedule.setRequest(medicationRequest);
        schedule.setStudent(medicationRequest.getStudent());
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setNotes(request.getNotes());
        schedule.setDispensedQuantity(newQty);
        schedule.setAdministeredBy(userUtilService.getCurrentUser());

        inventoryRepository.save(inventory);
        requestRepository.save(medicationRequest);
        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public void delete(Long id) {
        MedicationSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        MedicationRequest medicationRequest = schedule.getRequest();
        Inventory inventory = medicationRequest.getInventory();

        int qty = schedule.getDispensedQuantity();
        if (inventory != null) {
            inventory.setTotalQuantity(inventory.getTotalQuantity() + qty);
            medicationRequest.setTotalQuantity(medicationRequest.getTotalQuantity() + qty);
            medicationRequest.setIsSufficientStock(inventory.getTotalQuantity() >= medicationRequest.getTotalQuantity());

            // ✅ Cập nhật lại trạng thái nếu bị xoá
            if (medicationRequest.getTotalQuantity() == 0) {
                medicationRequest.setConfirmationStatus(ConfirmationStatus.done);
            } else {
                medicationRequest.setConfirmationStatus(ConfirmationStatus.in_progress);
            }

            inventoryRepository.save(inventory);
            requestRepository.save(medicationRequest);
        }

        scheduleRepository.delete(schedule);
    }

    @Override
    public List<MedicationScheduleResponse> getAllForNurse() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationScheduleResponse> getForCurrentParentStudents() {
        User parent = userUtilService.getCurrentUser();
        List<Long> studentIds = studentRepository.findByParent(parent)
                .stream()
                .map(Students::getStudentId)
                .collect(Collectors.toList());

        return scheduleRepository.findAll().stream()
                .filter(schedule -> studentIds.contains(schedule.getStudent().getStudentId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MedicationScheduleResponse mapToResponse(MedicationSchedule schedule) {
        return MedicationScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .requestId(schedule.getRequest().getRequestId())
                .studentId(schedule.getStudent().getStudentId())
                .studentName(schedule.getStudent().getFullName())
                .scheduledDate(schedule.getScheduledDate())
                .scheduledTime(schedule.getScheduledTime())
                .notes(schedule.getNotes())
                .administeredBy(schedule.getAdministeredBy().getFullName())
                .createdAt(schedule.getCreatedAt())
                .dispensedQuantity(schedule.getDispensedQuantity())
                .build();
    }
}
