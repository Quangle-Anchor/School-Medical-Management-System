package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;

import java.util.List;

public interface HealthInfoService {
    List<HealthInfoResponse> getAll();
    HealthInfoResponse getById(Long id);
    List<HealthInfoResponse> getByStudentId(Long studentId);
    HealthInfoResponse save(HealthInfoResponse dto);
    HealthInfoResponse update(Long id, HealthInfoResponse dto);
    void delete(Long id);
}
