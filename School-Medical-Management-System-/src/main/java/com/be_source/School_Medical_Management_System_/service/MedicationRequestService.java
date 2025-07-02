package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedicationRequestService {
    List<MedicationRequestResponse> getMyRequests();
    void create(MedicationRequestRequest request, MultipartFile file);
    MedicationRequestResponse update(Long id, MedicationRequestRequest request, MultipartFile file);
    void delete(Long id);
    List<MedicationRequestResponse> getHistoryByStudent(Long studentId);
    List<MedicationRequestResponse> getUnconfirmedRequests();
    List<MedicationRequestResponse> getAllRequests();
    void confirmRequest(Long id);
}
