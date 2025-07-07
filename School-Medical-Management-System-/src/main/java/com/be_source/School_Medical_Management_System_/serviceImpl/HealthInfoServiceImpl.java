package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;
import com.be_source.School_Medical_Management_System_.model.Health_Info;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.repository.HealthInfoRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.service.HealthInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HealthInfoServiceImpl implements HealthInfoService {

    @Autowired
    private HealthInfoRepository healthInfoRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public List<HealthInfoResponse> getAll() {
        return healthInfoRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public HealthInfoResponse getById(Long id) {
        return healthInfoRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new NoSuchElementException("HealthInfo not found"));
    }

    @Override
    public List<HealthInfoResponse> getByStudentId(Long studentId) {
        return healthInfoRepository.findByStudentStudentId(studentId)
                .stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public HealthInfoResponse save(HealthInfoResponse dto) {
        Health_Info entity = toEntity(dto);
        entity.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());
        return toDto(healthInfoRepository.save(entity));
    }

    @Override
    public HealthInfoResponse update(Long id, HealthInfoResponse dto) {
        Health_Info existing = healthInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HealthInfo not found"));
        existing.setMedicalConditions(dto.getMedicalConditions());
        existing.setAllergies(dto.getAllergies());
        existing.setNotes(dto.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return toDto(healthInfoRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        healthInfoRepository.deleteById(id);
    }

    // ============================ Mapping ============================

    private HealthInfoResponse toDto(Health_Info entity) {
        HealthInfoResponse dto = new HealthInfoResponse();
        dto.setHealthInfoId(entity.getHealthInfoId());
        dto.setStudentId(entity.getStudent().getStudentId());
        dto.setMedicalConditions(entity.getMedicalConditions());
        dto.setAllergies(entity.getAllergies());
        dto.setNotes(entity.getNotes());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private Health_Info toEntity(HealthInfoResponse dto) {
        Health_Info entity = new Health_Info();
        entity.setHealthInfoId(dto.getHealthInfoId());
        entity.setMedicalConditions(dto.getMedicalConditions());
        entity.setAllergies(dto.getAllergies());
        entity.setNotes(dto.getNotes());

        Long studentId = dto.getStudentId();
        if (studentId == null) {
            throw new RuntimeException("Student ID is missing in DTO");
        }

        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        entity.setStudent(student);

        return entity;
    }



}
