package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.MedicalItemRequest;
import com.be_source.School_Medical_Management_System_.response.MedicalItemResponse;
import com.be_source.School_Medical_Management_System_.service.MedicalItemService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalItemController {

    @Autowired
    private MedicalItemService medicalItemService;

    // Lấy danh sách tất cả vật tư/thuốc - mọi vai trò đều được phép
    @GetMapping
    public ResponseEntity<List<MedicalItemResponse>> getAllItems() {
        return ResponseEntity.ok(medicalItemService.getAll());
    }

    // Thêm mới vật tư/thuốc - chỉ cho Nurse và Principal
    @PostMapping
    @RolesAllowed({"ROLE_NURSE", "ROLE_PRINCIPAL"})
    public ResponseEntity<MedicalItemResponse> create(@RequestBody MedicalItemRequest request) {
        return ResponseEntity.ok(medicalItemService.create(request));
    }

    // Cập nhật thông tin vật tư/thuốc
    @PutMapping("/{id}")
    @RolesAllowed({"ROLE_NURSE", "ROLE_PRINCIPAL"})
    public ResponseEntity<MedicalItemResponse> update(@PathVariable Long id, @RequestBody MedicalItemRequest request) {
        return ResponseEntity.ok(medicalItemService.update(id, request));
    }

    // Xoá vật tư/thuốc
    @DeleteMapping("/{id}")
    @RolesAllowed({"ROLE_NURSE", "ROLE_PRINCIPAL"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicalItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Xem chi tiết một vật tư/thuốc
    @GetMapping("/{id}")
    public ResponseEntity<MedicalItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(medicalItemService.getById(id));
    }
}
