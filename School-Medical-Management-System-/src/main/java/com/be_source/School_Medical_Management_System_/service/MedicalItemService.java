package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.MedicalItemRequest;
import com.be_source.School_Medical_Management_System_.response.MedicalItemResponse;

import java.util.List;

public interface MedicalItemService {
    MedicalItemResponse create(MedicalItemRequest request);
    MedicalItemResponse update(Long id, MedicalItemRequest request);
    void delete(Long id);
    List<MedicalItemResponse> getAll();
    MedicalItemResponse getById(Long id);
}
