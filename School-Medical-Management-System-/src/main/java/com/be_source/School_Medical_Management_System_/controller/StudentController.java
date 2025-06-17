package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/students")
public class StudentController {    @Autowired
    private StudentService studentService;

    // Lấy danh sách tất cả học sinh
    @GetMapping
    public List<Students> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Lấy thông tin 1 học sinh theo ID
    @GetMapping("/{id}")
    public Optional<Students> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }    // Thêm mới học sinh
    @PostMapping
    public Students createStudent(@RequestBody Students student) {
        return studentService.saveStudent(student);
    }    // Cập nhật thông tin học sinh
    @PutMapping("/{id}")
    public Students updateStudent(@PathVariable Long id, @RequestBody Students student) {
        student.setStudentId(id);
        return studentService.saveStudent(student);
    }    // Xóa học sinh
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}
