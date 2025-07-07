package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import com.be_source.School_Medical_Management_System_.service.MedicationRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationRequestController {

    private final MedicationRequestService medicationRequestService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/my")
    public ResponseEntity<List<MedicationRequestResponse>> getMyRequests() {
        return ResponseEntity.ok(medicationRequestService.getMyRequests());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createMedicationRequest(
            @RequestPart("medicationRequest") String medicationRequestJson,
            @RequestPart(value = "prescriptionFile", required = false) MultipartFile prescriptionFile) {
        try {
            MedicationRequestRequest request = objectMapper.readValue(medicationRequestJson, MedicationRequestRequest.class);
            medicationRequestService.create(request, prescriptionFile);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request data: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMedicationRequest(
            @PathVariable Long id,
            @RequestPart("medicationRequest") String medicationRequestJson,
            @RequestPart(value = "prescriptionFile", required = false) MultipartFile prescriptionFile) {
        try {
            MedicationRequestRequest request = objectMapper.readValue(medicationRequestJson, MedicationRequestRequest.class);
            MedicationRequestResponse updated = medicationRequestService.update(id, request, prescriptionFile);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        medicationRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<List<MedicationRequestResponse>> getHistoryByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(medicationRequestService.getHistoryByStudent(studentId));
    }

    @GetMapping("/nurse/pending")
    public ResponseEntity<List<MedicationRequestResponse>> getUnconfirmedRequests() {
        return ResponseEntity.ok(medicationRequestService.getUnconfirmedRequests());
    }

    @GetMapping("/nurse/all")
    public ResponseEntity<List<MedicationRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(medicationRequestService.getAllRequests());
    }

    @PutMapping("/nurse/confirm/{id}")
    public ResponseEntity<?> confirmRequest(@PathVariable Long id) {
        medicationRequestService.confirmRequest(id);
        return ResponseEntity.ok("Request confirmed successfully.");
    }
}

