package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.PeriodicCheckup;
import com.be_source.School_Medical_Management_System_.repository.PeriodicCheckupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PeriodicCheckupService {

    @Autowired
    private PeriodicCheckupRepository periodicCheckupRepository;

    public List<PeriodicCheckup> getAllCheckups() {
        return periodicCheckupRepository.findAll();
    }

    public Optional<PeriodicCheckup> getCheckupById(Long id) {
        return periodicCheckupRepository.findById(id);
    }

    public PeriodicCheckup saveCheckup(PeriodicCheckup checkup) {
        return periodicCheckupRepository.save(checkup);
    }

    public void deleteCheckup(Long id) {
        periodicCheckupRepository.deleteById(id);
    }
}
