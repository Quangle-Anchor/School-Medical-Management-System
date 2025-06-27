package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.HealthIncidentRequest;
import com.be_source.School_Medical_Management_System_.response.HealthIncidentResponse;

import java.util.List;

public interface HealthIncidentService {
    List<HealthIncidentResponse> getAll();
    HealthIncidentResponse getById(Long id);
    HealthIncidentResponse create(HealthIncidentRequest request, String authHeader);
    HealthIncidentResponse update(Long id, HealthIncidentRequest request);
    void delete(Long id);
    List<HealthIncidentResponse> getByStudentId(Long studentId);
}
