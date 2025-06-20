package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // View Students theo ParentID
    @GetMapping("/my")
    public ResponseEntity<List<Students>> getMyStudents(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Students> myStudents = studentService.getStudentsByParent(currentUser);
        return ResponseEntity.ok(myStudents);
    }


    // Lấy thông tin 1 học sinh theo ID
    @GetMapping("/{id}")
    public Optional<Students> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Thêm mới học sinh

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping
    public ResponseEntity<Students> createStudent(
            @RequestBody Students student,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        student.setParent(currentUser);

        Students savedStudent = studentService.saveStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    // Cập nhật thông tin học sinh
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Students updatedStudent) {
        Optional<Students> existingOptional = studentService.getStudentById(id);

        if (existingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Students existingStudent = existingOptional.get();
        // Giữ nguyên parent
        updatedStudent.setStudentId(id);
        updatedStudent.setParent(existingStudent.getParent());
        updatedStudent.setHealthInfoList(existingStudent.getHealthInfoList());
        Students saved = studentService.saveStudent(updatedStudent);
        return ResponseEntity.ok(saved);
    }
    // Xóa học sinh
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}
