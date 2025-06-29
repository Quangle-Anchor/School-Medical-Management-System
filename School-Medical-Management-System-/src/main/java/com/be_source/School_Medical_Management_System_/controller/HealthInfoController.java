package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;
import com.be_source.School_Medical_Management_System_.service.HealthInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-info")
public class HealthInfoController {

    @Autowired
    private HealthInfoService healthInfoService;

    @GetMapping
    public ResponseEntity<List<HealthInfoResponse>> getAll() {
        return ResponseEntity.ok(healthInfoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthInfoResponse> getHealthInfoById(@PathVariable Long id) {
        return ResponseEntity.ok(healthInfoService.getById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HealthInfoResponse>> getHealthInfoByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(healthInfoService.getByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<HealthInfoResponse> createHealthInfo(@RequestBody HealthInfoResponse dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(healthInfoService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthInfoResponse> updateHealthInfo(@PathVariable Long id, @RequestBody HealthInfoResponse dto) {
        return ResponseEntity.ok(healthInfoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthInfo(@PathVariable Long id) {
        healthInfoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
