package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import com.be_source.School_Medical_Management_System_.model.Inventory;
import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.InventoryRepository;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import com.be_source.School_Medical_Management_System_.service.MedicationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationRequestServiceImpl implements MedicationRequestService {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public List<MedicationRequestResponse> getMyRequests() {
        User parent = userUtilService.getCurrentUser();
        return medicationRequestRepository.findByRequestedByOrderByCreatedAtDesc(parent).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void create(MedicationRequestRequest request, MultipartFile file) {
        User parent = userUtilService.getCurrentUser();
        Students student = validateOwnership(request.getStudentId(), parent);

        MedicationRequest entity = new MedicationRequest();
        entity.setStudent(student);
        entity.setMedicationName(request.getMedicationName());
        entity.setDosage(request.getDosage());
        entity.setFrequency(request.getFrequency());
        entity.setRequestedBy(parent);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setConfirmationStatus(ConfirmationStatus.pending);
        entity.setConfirmedAt(null);
        entity.setUnconfirmReason(null);
        entity.setTotalQuantity(request.getTotalQuantity());
        entity.setMorningQuantity(request.getMorningQuantity());
        entity.setNoonQuantity(request.getNoonQuantity());
        entity.setEveningQuantity(request.getEveningQuantity());

        Inventory matchedInventory = inventoryRepository
                .findByMedicalItem_ItemNameIgnoreCase(request.getMedicationName())
                .orElse(null);
        entity.setInventory(matchedInventory);

        if (matchedInventory != null && request.getTotalQuantity() != null) {
            entity.setIsSufficientStock(
                    matchedInventory.getTotalQuantity() >= request.getTotalQuantity()
            );
        } else {
            entity.setIsSufficientStock(false);
        }

        if (file != null && !file.isEmpty()) {
            String fileUrl = cloudinaryService.uploadFile(file);
            entity.setPrescriptionFile(fileUrl);
        }

        medicationRequestRepository.save(entity);
    }

    @Override
    public MedicationRequestResponse update(Long id, MedicationRequestRequest request, MultipartFile file) {
        User parent = userUtilService.getCurrentUser();
        MedicationRequest existing = medicationRequestRepository.findByRequestIdAndRequestedBy(id, parent)
                .orElseThrow(() -> new RuntimeException("Not found or not authorized"));

        Students student = validateOwnership(request.getStudentId(), parent);
        existing.setStudent(student);
        existing.setMedicationName(request.getMedicationName());
        existing.setDosage(request.getDosage());
        existing.setFrequency(request.getFrequency());
        existing.setTotalQuantity(request.getTotalQuantity());
        existing.setMorningQuantity(request.getMorningQuantity());
        existing.setNoonQuantity(request.getNoonQuantity());
        existing.setEveningQuantity(request.getEveningQuantity());
        existing.setConfirmationStatus(ConfirmationStatus.pending);
        existing.setConfirmedAt(null);
        existing.setUnconfirmReason(null);

        Inventory matchedInventory = inventoryRepository
                .findByMedicalItem_ItemNameIgnoreCase(request.getMedicationName())
                .orElse(null);
        existing.setInventory(matchedInventory);

        if (matchedInventory != null && request.getTotalQuantity() != null) {
            existing.setIsSufficientStock(
                    matchedInventory.getTotalQuantity() >= request.getTotalQuantity()
            );
        } else {
            existing.setIsSufficientStock(false);
        }

        if (file != null && !file.isEmpty()) {
            if (existing.getPrescriptionFile() != null) {
                cloudinaryService.deleteFileByUrl(existing.getPrescriptionFile());
            }
            String fileUrl = cloudinaryService.uploadFile(file);
            existing.setPrescriptionFile(fileUrl);
        }

        return mapToResponse(medicationRequestRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        User parent = userUtilService.getCurrentUser();
        MedicationRequest existing = medicationRequestRepository.findByRequestIdAndRequestedBy(id, parent)
                .orElseThrow(() -> new RuntimeException("Not found or not authorized"));

        if (existing.getPrescriptionFile() != null) {
            cloudinaryService.deleteFileByUrl(existing.getPrescriptionFile());
        }

        medicationRequestRepository.delete(existing);
    }

    @Override
    public List<MedicationRequestResponse> getHistoryByStudent(Long studentId) {
        User parent = userUtilService.getCurrentUser();
        Students student = validateOwnership(studentId, parent);

        return medicationRequestRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationRequestResponse> getUnconfirmedRequests() {
        return medicationRequestRepository.findByConfirmationStatusOrderByCreatedAtDesc(ConfirmationStatus.pending).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationRequestResponse> getAllRequests() {
        return medicationRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void confirmRequest(Long id) {
        MedicationRequest request = medicationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication request not found"));

        Inventory inventory = request.getInventory();

        if (inventory == null) {
            throw new RuntimeException("Cannot confirm: Don't have medical which is request need in inventory. Please add to inventory first.");
        }

        if (!request.getIsSufficientStock()) {
            throw new RuntimeException("Cannot confirm: Insufficient stock in inventory.");
        }

        request.setConfirmationStatus(ConfirmationStatus.confirmed);
        request.setConfirmedAt(LocalDateTime.now());
        request.setUnconfirmReason(null);

        medicationRequestRepository.save(request);
    }

    @Override
    public void unconfirmRequest(Long id, String reason) {
        MedicationRequest request = medicationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication request not found"));
        request.setConfirmationStatus(ConfirmationStatus.unconfirmed);
        request.setUnconfirmReason(reason);
        request.setConfirmedAt(null);
        medicationRequestRepository.save(request);
    }

    private Students validateOwnership(Long studentId, User parent) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (!student.getParent().getUserId().equals(parent.getUserId())) {
            throw new RuntimeException("Student does not belong to current parent");
        }
        return student;
    }

    private Inventory findInventoryByName(String medicationName) {
        return medicationName == null ? null :
                inventoryRepository.findByMedicalItem_ItemNameIgnoreCase(medicationName).orElse(null);
    }

    private MedicationRequestResponse mapToResponse(MedicationRequest entity) {
        return MedicationRequestResponse.builder()
                .requestId(entity.getRequestId())
                .studentId(entity.getStudent().getStudentId())
                .studentCode(entity.getStudent().getStudentCode())
                .studentName(entity.getStudent().getFullName())
                .studentClass(entity.getStudent().getClassName())
                .parentName(entity.getRequestedBy().getFullName())
                .parentEmail(entity.getRequestedBy().getEmail())
                .medicationName(entity.getMedicationName())
                .dosage(entity.getDosage())
                .frequency(entity.getFrequency())
                .totalQuantity(entity.getTotalQuantity())
                .morningQuantity(entity.getMorningQuantity())
                .noonQuantity(entity.getNoonQuantity())
                .eveningQuantity(entity.getEveningQuantity())
                .prescriptionFile(entity.getPrescriptionFile())
                .confirmationStatus(entity.getConfirmationStatus())
                .unconfirmReason(entity.getUnconfirmReason())
                .createdAt(entity.getCreatedAt())
                .confirmedAt(entity.getConfirmedAt())
                .isSufficientStock(entity.getIsSufficientStock())
                .build();
    }

}
