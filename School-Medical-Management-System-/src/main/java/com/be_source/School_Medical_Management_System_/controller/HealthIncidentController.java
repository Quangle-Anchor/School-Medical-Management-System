package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.HealthIncidentRequest;
import com.be_source.School_Medical_Management_System_.response.HealthIncidentResponse;
import com.be_source.School_Medical_Management_System_.service.HealthIncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-incidents")
public class HealthIncidentController {

    @Autowired
    private HealthIncidentService healthIncidentService;

    @GetMapping
    public ResponseEntity<List<HealthIncidentResponse>> getAll() {
        return ResponseEntity.ok(healthIncidentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthIncidentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(healthIncidentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HealthIncidentResponse> create(@RequestBody HealthIncidentRequest request,
                                                         @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(healthIncidentService.create(request, authHeader));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthIncidentResponse> update(@PathVariable Long id,
                                                         @RequestBody HealthIncidentRequest request) {
        return ResponseEntity.ok(healthIncidentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        healthIncidentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HealthIncidentResponse>> getByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(healthIncidentService.getByStudentId(studentId));
    }
}
