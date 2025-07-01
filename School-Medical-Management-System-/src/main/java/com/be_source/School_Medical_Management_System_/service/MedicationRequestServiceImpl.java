package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicationRequestServiceImpl implements MedicationRequestService {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Value("${medication.upload.prescription.path}")
    private String prescriptionUploadPath;

    @Override
    public List<MedicationRequestResponse> getMyRequests() {
        User parent = userUtilService.getCurrentUser();
        return medicationRequestRepository.findByRequestedBy(parent).stream()
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
        entity.setIsConfirmed(false);
        entity.setConfirmedAt(null);
        entity.setTotalQuantity(request.getTotalQuantity());
        entity.setMorningQuantity(request.getMorningQuantity());
        entity.setNoonQuantity(request.getNoonQuantity());
        entity.setEveningQuantity(request.getEveningQuantity());

        if (file != null && !file.isEmpty()) {
            entity.setPrescriptionFile(uploadFile(file));
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

        if (file != null && !file.isEmpty()) {
            existing.setPrescriptionFile(uploadFile(file));
        }

        existing.setIsConfirmed(false);
        existing.setConfirmedAt(null);

        return mapToResponse(medicationRequestRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        User parent = userUtilService.getCurrentUser();
        MedicationRequest existing = medicationRequestRepository.findByRequestIdAndRequestedBy(id, parent)
                .orElseThrow(() -> new RuntimeException("Not found or not authorized"));
        medicationRequestRepository.delete(existing);
    }

    @Override
    public List<MedicationRequestResponse> getHistoryByStudent(Long studentId) {
        User parent = userUtilService.getCurrentUser();
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getParent().getUserId().equals(parent.getUserId())) {
            throw new RuntimeException("Access denied: You can only view your own child's history.");
        }

        return medicationRequestRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationRequestResponse> getUnconfirmedRequests() {
        return medicationRequestRepository.findByIsConfirmedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void confirmRequest(Long id) {
        MedicationRequest request = medicationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication request not found"));
        request.setIsConfirmed(true);
        request.setConfirmedAt(LocalDateTime.now());
        medicationRequestRepository.save(request);
    }

    private String uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get("src/main/resources/static", prescriptionUploadPath);
            if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
            Path destinationPath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Error uploading prescription file", e);
        }
    }

    private Students validateOwnership(Long studentId, User parent) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (!student.getParent().getUserId().equals(parent.getUserId())) {
            throw new RuntimeException("Student does not belong to current parent");
        }
        return student;
    }

    private MedicationRequestResponse mapToResponse(MedicationRequest entity) {
        return MedicationRequestResponse.builder()
                .requestId(entity.getRequestId())
                .studentId(entity.getStudent().getStudentId())
                .studentName(entity.getStudent().getFullName()) // sửa theo entity thực tế
                .medicationName(entity.getMedicationName())
                .dosage(entity.getDosage())
                .frequency(entity.getFrequency())
                .totalQuantity(entity.getTotalQuantity())
                .morningQuantity(entity.getMorningQuantity())
                .noonQuantity(entity.getNoonQuantity())
                .eveningQuantity(entity.getEveningQuantity())
                .prescriptionFile(entity.getPrescriptionFile())
                .isConfirmed(Boolean.TRUE.equals(entity.getIsConfirmed()))
                .createdAt(entity.getCreatedAt())
                .confirmedAt(entity.getConfirmedAt())
                .build();
    }
}
