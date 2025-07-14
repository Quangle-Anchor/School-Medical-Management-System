package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.MedicationScheduleRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationScheduleResponse;

import java.util.List;

public interface MedicationScheduleService {
    MedicationScheduleResponse create(MedicationScheduleRequest request);
    MedicationScheduleResponse update(Long id, MedicationScheduleRequest request);
    void delete(Long id);
    List<MedicationScheduleResponse> getAllForNurse();
    List<MedicationScheduleResponse> getForCurrentParentStudents();
    MedicationScheduleResponse getById(Long id);

}

