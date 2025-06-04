package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.MedicationSchedule;
import com.be_source.School_Medical_Management_System_.repository.MedicationScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationScheduleService {

    @Autowired
    private MedicationScheduleRepository medicationScheduleRepository;

    public List<MedicationSchedule> getAllSchedules() {
        return medicationScheduleRepository.findAll();
    }

    public Optional<MedicationSchedule> getScheduleById(Long id) {
        return medicationScheduleRepository.findById(id);
    }

    public MedicationSchedule saveSchedule(MedicationSchedule schedule) {
        return medicationScheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long id) {
        medicationScheduleRepository.deleteById(id);
    }
}
