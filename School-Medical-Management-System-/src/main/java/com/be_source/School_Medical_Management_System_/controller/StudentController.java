package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.DeleteStudentRequest;
import com.be_source.School_Medical_Management_System_.response.StudentResponse;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "studentId,asc") String[] sort) {

        Sort sortObj = Sort.by(sort[0]).ascending();
        if (sort.length > 1 && sort[1].equalsIgnoreCase("desc")) {
            sortObj = sortObj.descending();
        }
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return ResponseEntity.ok(studentService.getAllStudents(pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<List<StudentResponse>> getMyStudents() {
        return ResponseEntity.ok(studentService.getStudentsByCurrentParent());
    }

    // Cái này là search Student của Quang
    @GetMapping("/search")
    public ResponseEntity<List<StudentResponse>> searchStudentsByCode(@RequestParam String keyword) {
        return ResponseEntity.ok(studentService.searchStudentsByCode(keyword));
    }

    // Cái này chức năng View Student-Info của Hoàng
    @GetMapping("/code/{studentCode}")
    public ResponseEntity<StudentResponse> getStudentByCode(@PathVariable String studentCode) {
        return ResponseEntity.ok(studentService.getStudentByCode(studentCode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(
            @RequestBody StudentResponse student) {
        StudentResponse created = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentResponse student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}/confirm")
    public ResponseEntity<StudentResponse> confirmStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.confirmStudent(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectStudentByNurse(
            @PathVariable Long id,
            @RequestBody DeleteStudentRequest request) {
        studentService.rejectStudentByNurse(id, request.getReason());
        return ResponseEntity.ok("Student marked as unconfirmed. Notification sent to parent.");
    }
}
