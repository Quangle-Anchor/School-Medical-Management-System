package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.StudentVaccination;
import com.be_source.School_Medical_Management_System_.repository.StudentVaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentVaccinationService {

    @Autowired
    private StudentVaccinationRepository studentVaccinationRepository;

    public List<StudentVaccination> getAllStudentVaccinations() {
        return studentVaccinationRepository.findAll();
    }

    public Optional<StudentVaccination> getStudentVaccinationById(Long id) {
        return studentVaccinationRepository.findById(id);
    }

    public StudentVaccination saveStudentVaccination(StudentVaccination studentVaccination) {
        return studentVaccinationRepository.save(studentVaccination);
    }

    public void deleteStudentVaccination(Long id) {
        studentVaccinationRepository.deleteById(id);
    }
}
