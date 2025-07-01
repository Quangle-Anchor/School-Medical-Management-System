package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.HealthIncidentRequest;
import com.be_source.School_Medical_Management_System_.response.HealthIncidentResponse;
import com.be_source.School_Medical_Management_System_.model.HealthIncident;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.HealthIncidentRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthIncidentServiceImpl implements HealthIncidentService {

    @Autowired
    private HealthIncidentRepository healthIncidentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Override
    public List<HealthIncidentResponse> getAll() {
        return healthIncidentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HealthIncidentResponse getById(Long id) {
        HealthIncident incident = healthIncidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        return mapToResponse(incident);
    }

    @Override
    public HealthIncidentResponse create(HealthIncidentRequest request) {
        User currentUser = userUtilService.getCurrentUser();
        Students student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        HealthIncident incident = new HealthIncident();
        incident.setStudent(student);
        incident.setDescription(request.getDescription());
        incident.setIncidentDate(request.getIncidentDate());
        incident.setCreatedBy(currentUser);
        incident.setCreatedAt(LocalDateTime.now());

        return mapToResponse(healthIncidentRepository.save(incident));
    }

    @Override
    public HealthIncidentResponse update(Long id, HealthIncidentRequest request) {
        HealthIncident existing = healthIncidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        existing.setIncidentDate(request.getIncidentDate());
        existing.setDescription(request.getDescription());

        if (request.getStudentId() != null) {
            Students student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            existing.setStudent(student);
        }

        return mapToResponse(healthIncidentRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        healthIncidentRepository.deleteById(id);
    }

    @Override
    public List<HealthIncidentResponse> getByStudentId(Long studentId) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return healthIncidentRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private HealthIncidentResponse mapToResponse(HealthIncident incident) {
        return HealthIncidentResponse.builder()
                .incidentId(incident.getIncidentId())
                .studentId(incident.getStudent().getStudentId())
                .studentName(incident.getStudent().getFullName()) // đổi theo entity thực tế
                .incidentDate(incident.getIncidentDate())
                .description(incident.getDescription())
                .createdBy(incident.getCreatedBy().getFullName()) // đổi theo entity thực tế
                .createdAt(incident.getCreatedAt())
                .build();
    }
}
