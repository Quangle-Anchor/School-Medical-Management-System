package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.MedicationSchedule;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
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

    @Override
    public MedicationScheduleResponse create(MedicationScheduleRequest request) {
        MedicationRequest medicationRequest = requestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Medication request not found"));

        MedicationSchedule schedule = new MedicationSchedule();
        schedule.setRequest(medicationRequest);
        schedule.setStudent(medicationRequest.getStudent());
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setNotes(request.getNotes());
        schedule.setAdministeredBy(userUtilService.getCurrentUser());

        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public MedicationScheduleResponse update(Long id, MedicationScheduleRequest request) {
        MedicationSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        MedicationRequest medicationRequest = requestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Medication request not found"));

        schedule.setRequest(medicationRequest);
        schedule.setStudent(medicationRequest.getStudent());
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setNotes(request.getNotes());
        schedule.setAdministeredBy(userUtilService.getCurrentUser());

        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public void delete(Long id) {
        scheduleRepository.deleteById(id);
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

        // Lấy danh sách học sinh thuộc phụ huynh đang đăng nhập
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
                .build();
    }
}
