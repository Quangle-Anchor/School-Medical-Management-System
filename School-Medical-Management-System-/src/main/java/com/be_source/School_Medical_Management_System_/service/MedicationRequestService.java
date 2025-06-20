package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MedicationRequestService {

    @Value("${medication.upload.prescription.path}")
    private String prescriptionUploadPath;

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private JwtUtil jwtUtil;;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public List<MedicationRequest> getRequestsByParent(User parent) {
        return medicationRequestRepository.findByRequestedBy(parent);
    }

    public void create(MedicationRequest request, MultipartFile prescriptionFile, String token) {
        User parent = userService.findByToken(token);

        List<Students> children = studentRepository.findByParent(parent);
        if (children.stream().noneMatch(s -> s.getStudentId().equals(request.getStudent().getStudentId()))) {
            throw new RuntimeException("Student does not belong to current parent");
        }

        if (prescriptionFile != null && !prescriptionFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + prescriptionFile.getOriginalFilename();
                Path uploadDir = Paths.get("src/main/resources/static", prescriptionUploadPath);
                if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

                Path destinationPath = uploadDir.resolve(fileName);
                Files.copy(prescriptionFile.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

                request.setPrescriptionFile(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Error uploading prescription file", e);
            }
        }

        request.setRequestedBy(parent);
        request.setCreatedAt(LocalDateTime.now());

        medicationRequestRepository.save(request);
    }




    public MedicationRequest update(Long id, MedicationRequest updatedRequest, User parent) {
        MedicationRequest existing = medicationRequestRepository.findByRequestIdAndRequestedBy(id, parent)
                .orElseThrow(() -> new RuntimeException("Not found or not authorized"));

        if (!studentRepository.findByParent(parent).contains(updatedRequest.getStudent())) {
            throw new RuntimeException("Student does not belong to current parent");
        }

        existing.setStudent(updatedRequest.getStudent());
        existing.setMedicationName(updatedRequest.getMedicationName());
        existing.setDosage(updatedRequest.getDosage());
        existing.setFrequency(updatedRequest.getFrequency());
        existing.setPrescriptionFile(updatedRequest.getPrescriptionFile());

        return medicationRequestRepository.save(existing);
    }

    public void delete(Long id, User parent) {
        MedicationRequest existing = medicationRequestRepository.findByRequestIdAndRequestedBy(id, parent)
                .orElseThrow(() -> new RuntimeException("Not found or not authorized"));
        medicationRequestRepository.delete(existing);
    }

    public List<MedicationRequest> getHistoryByStudent(Long studentId, String parentEmail) {
        User parent = userRepository.findByEmail(parentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getParent().getUserId().equals(parent.getUserId())) {
            throw new RuntimeException("Access denied: You can only view your own child's history.");
        }

        return medicationRequestRepository.findByStudentOrderByCreatedAtDesc(student);
    }
}
