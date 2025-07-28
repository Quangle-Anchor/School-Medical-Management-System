package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.response.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentService {
    Page<StudentResponse> getAllStudents(Pageable pageable);
    StudentResponse getStudentById(Long id);
    List<StudentResponse> getStudentsByCurrentParent();
    StudentResponse createStudent(StudentResponse dto);
    StudentResponse updateStudent(Long id, StudentResponse dto);
    void deleteStudent(Long id);
    StudentResponse getStudentByCode(String studentCode);
    List<StudentResponse> searchStudentsByCode(String keyword);
    StudentResponse confirmStudent(Long studentId);
    void rejectStudentByNurse(Long studentId, String reason);

}
