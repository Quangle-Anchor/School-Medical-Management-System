package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.HealthIncident;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.HealthIncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class HealthIncidentController {

    @Autowired
    private HealthIncidentService healthIncidentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private User extractUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<HealthIncident>> getAll() {
        return ResponseEntity.ok(healthIncidentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthIncident> getById(@PathVariable Long id) {
        return ResponseEntity.ok(healthIncidentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HealthIncident> create(@RequestBody HealthIncident incident,
                                                 @RequestHeader("Authorization") String authHeader) {
        User user = extractUser(authHeader);
        return ResponseEntity.ok(healthIncidentService.create(incident, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthIncident> update(@PathVariable Long id,
                                                 @RequestBody HealthIncident updatedIncident) {
        return ResponseEntity.ok(healthIncidentService.update(id, updatedIncident));
    }    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        healthIncidentService.delete(id);
        return ResponseEntity.noContent().build();
    }    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HealthIncident>> getByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(healthIncidentService.getByStudentId(studentId));
    }
}
