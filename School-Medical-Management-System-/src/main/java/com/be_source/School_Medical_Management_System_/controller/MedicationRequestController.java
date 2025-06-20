package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.MedicationRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicationRequestController {

    @Autowired
    private MedicationRequestService medicationRequestService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // Helper method: lấy User đang đăng nhập từ token
    private User extractUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET all medication requests của phụ huynh hiện tại
    @GetMapping("/my")
    public ResponseEntity<List<MedicationRequest>> getMyMedicationRequests(@RequestHeader("Authorization") String authHeader) {
        User parent = extractUser(authHeader);
        return ResponseEntity.ok(medicationRequestService.getRequestsByParent(parent));
    }

    // POST tạo yêu cầu thuốc mới
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createMedicationRequest(
            @RequestPart("medicationRequest") String medicationRequestJson,
            @RequestPart(value = "prescriptionFile", required = false) MultipartFile prescriptionFile,
            @RequestHeader("Authorization") String token) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            MedicationRequest medicationRequest = mapper.readValue(medicationRequestJson, MedicationRequest.class);

            medicationRequestService.create(medicationRequest, prescriptionFile, token);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid medicationRequest JSON: " + e.getMessage());
        }
    }


    // PUT cập nhật yêu cầu thuốc
    @PutMapping("/{id}")
    public ResponseEntity<MedicationRequest> update(@PathVariable Long id,
                                                    @RequestBody MedicationRequest request,
                                                    @RequestHeader("Authorization") String authHeader) {
        User parent = extractUser(authHeader);
        return ResponseEntity.ok(medicationRequestService.update(id, request, parent));
    }

    // DELETE xoá yêu cầu thuốc
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @RequestHeader("Authorization") String authHeader) {
        User parent = extractUser(authHeader);
        medicationRequestService.delete(id, parent);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<List<MedicationRequest>> viewMedicationHistory(
            @PathVariable Long studentId,
            @RequestHeader("Authorization") String authHeader) {

        String email = jwtUtil.extractUsername(authHeader.substring(7));
        List<MedicationRequest> history = medicationRequestService.getHistoryByStudent(studentId, email);
        return ResponseEntity.ok(history);
    }
}

