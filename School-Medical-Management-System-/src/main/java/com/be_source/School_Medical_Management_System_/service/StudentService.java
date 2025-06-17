package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    }    @Transactional
    public void deleteStudent(Long id) {
        // With cascade = CascadeType.ALL and orphanRemoval = true, 
        // health info records will be automatically deleted
        studentRepository.deleteById(id);
    }

    public List<Students> getStudentsByParent(User parent) {
        return studentRepository.findByParent(parent);
    }
}
