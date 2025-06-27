package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedicationRequestService {
    List<MedicationRequestResponse> getMyRequests(String authHeader);
    void create(MedicationRequestRequest request, MultipartFile file, String authHeader);
    MedicationRequestResponse update(Long id, MedicationRequestRequest request, MultipartFile file, String authHeader);
    void delete(Long id, String authHeader);
    List<MedicationRequestResponse> getHistoryByStudent(Long studentId, String authHeader);
    List<MedicationRequestResponse> getUnconfirmedRequests();
    void confirmRequest(Long id);
}
