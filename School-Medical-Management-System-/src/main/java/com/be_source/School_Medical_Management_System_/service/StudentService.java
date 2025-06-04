package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Students> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Students> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Students saveStudent(Students student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}
