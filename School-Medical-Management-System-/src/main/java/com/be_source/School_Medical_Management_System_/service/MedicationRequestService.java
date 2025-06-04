package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationRequestService {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    public List<MedicationRequest> getAllRequests() {
        return medicationRequestRepository.findAll();
    }

    public Optional<MedicationRequest> getRequestById(Long id) {
        return medicationRequestRepository.findById(id);
    }

    public MedicationRequest saveRequest(MedicationRequest request) {
        return medicationRequestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        medicationRequestRepository.deleteById(id);
    }
}
