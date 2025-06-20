package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.HealthIncident;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.HealthIncidentRepository;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HealthIncidentService {
        @Autowired
        private HealthIncidentRepository healthIncidentRepository;

        @Autowired
        private StudentRepository studentRepository;

        public List<HealthIncident> getAll() {
            return healthIncidentRepository.findAll();
        }

        public HealthIncident getById(Long id) {
            return healthIncidentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Incident not found"));
        }

        public HealthIncident create(HealthIncident incident, User createdBy) {
            Students student = studentRepository.findById(incident.getStudent().getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            incident.setStudent(student);
            incident.setCreatedBy(createdBy);
            incident.setCreatedAt(LocalDateTime.now());

            return healthIncidentRepository.save(incident);
        }

        public HealthIncident update(Long id, HealthIncident updatedIncident) {
            HealthIncident existing = getById(id);
            existing.setIncidentDate(updatedIncident.getIncidentDate());
            existing.setDescription(updatedIncident.getDescription());

            if (updatedIncident.getStudent() != null) {
                Students student = studentRepository.findById(updatedIncident.getStudent().getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found"));
                existing.setStudent(student);
            }

            return healthIncidentRepository.save(existing);
        }

        public void delete(Long id) {
            healthIncidentRepository.deleteById(id);
        }

        public List<HealthIncident> getByStudent(Students student) {
            return healthIncidentRepository.findByStudent(student);
        }
    }



