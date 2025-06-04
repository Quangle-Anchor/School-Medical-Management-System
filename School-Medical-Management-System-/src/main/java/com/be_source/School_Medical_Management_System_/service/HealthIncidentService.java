package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.HealthIncident;
import com.be_source.School_Medical_Management_System_.repository.HealthIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthIncidentService {

    @Autowired
    private HealthIncidentRepository healthIncidentRepository;

    public List<HealthIncident> getAllIncidents() {
        return healthIncidentRepository.findAll();
    }

    public Optional<HealthIncident> getIncidentById(Long id) {
        return healthIncidentRepository.findById(id);
    }

    public HealthIncident saveIncident(HealthIncident incident) {
        return healthIncidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        healthIncidentRepository.deleteById(id);
    }
}

