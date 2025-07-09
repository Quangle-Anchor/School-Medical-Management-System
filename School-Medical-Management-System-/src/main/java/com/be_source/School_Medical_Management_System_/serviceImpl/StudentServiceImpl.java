package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;
import com.be_source.School_Medical_Management_System_.response.StudentResponse;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Override
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable)
                .map(this::toDto);
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Students student = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));
        return toDto(student);
    }

    @Override
    public List<StudentResponse> getStudentsByCurrentParent() {
        User currentUser = userUtilService.getCurrentUser();
        return studentRepository.findByParent(currentUser).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse createStudent(StudentResponse dto) {
        Students student = toEntity(dto);
        student.setStudentId(null);
        student.setParent(userUtilService.getCurrentUser());
        return toDto(studentRepository.save(student));
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentResponse dto) {
        Students existing = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));
        existing.setFullName(dto.getFullName());
        existing.setDateOfBirth(dto.getDateOfBirth());
        existing.setClassName(dto.getClassName());
        existing.setGender(dto.getGender());
        existing.setBloodType(dto.getBloodType());
        existing.setHeightCm(dto.getHeightCm());
        existing.setWeightKg(dto.getWeightKg());
        existing.setHealthStatus(dto.getHealthStatus());
        return toDto(studentRepository.save(existing));
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public StudentResponse getStudentByCode(String studentCode) {
        Students student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new NoSuchElementException("Student not found with code: " + studentCode));
        return toDto(student);
    }
    @Override
    public List<StudentResponse> searchStudentsByCode(String keyword) {
        return studentRepository.findByStudentCodeContainingIgnoreCase(keyword).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    // ============================ Mapping ============================

    private StudentResponse toDto(Students s) {
        StudentResponse dto = new StudentResponse();
        dto.setStudentId(s.getStudentId());
        dto.setStudentCode(s.getStudentCode());
        dto.setFullName(s.getFullName());
        dto.setDateOfBirth(s.getDateOfBirth());
        dto.setClassName(s.getClassName());
        dto.setGender(s.getGender());
        dto.setBloodType(s.getBloodType());
        dto.setHeightCm(s.getHeightCm());
        dto.setWeightKg(s.getWeightKg());
        dto.setHealthStatus(s.getHealthStatus());
        dto.setUpdatedAt(s.getUpdatedAt());

        // Convert list<Health_Info> to list<HealthInfoResponse>
        if (s.getHealthInfoList() != null) {
            List<HealthInfoResponse> healthDtos = s.getHealthInfoList().stream().map(hi -> {
                HealthInfoResponse h = new HealthInfoResponse();
                h.setHealthInfoId(hi.getHealthInfoId());
                h.setMedicalConditions(hi.getMedicalConditions());
                h.setAllergies(hi.getAllergies());
                h.setNotes(hi.getNotes());
                h.setUpdatedAt(hi.getUpdatedAt());
                return h;
            }).collect(Collectors.toList());
            dto.setHealthInfoList(healthDtos);
        }

        return dto;
    }


    private Students toEntity(StudentResponse dto) {
        Students s = new Students();
        s.setStudentId(dto.getStudentId());
        s.setFullName(dto.getFullName());
        s.setDateOfBirth(dto.getDateOfBirth());
        s.setClassName(dto.getClassName());
        s.setGender(dto.getGender());
        s.setBloodType(dto.getBloodType());
        s.setHeightCm(dto.getHeightCm());
        s.setWeightKg(dto.getWeightKg());
        s.setHealthStatus(dto.getHealthStatus());
        // Note: updatedAt is managed by @UpdateTimestamp
        return s;
    }
}
