package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;
import com.be_source.School_Medical_Management_System_.service.HealthInfoService;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/students")
public class StudentHealthInfoController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private HealthInfoService healthInfoService;

    // ✅ Lấy health info của student theo studentId
    @GetMapping("/{studentId}/health-info")
    public ResponseEntity<List<HealthInfoResponse>> getHealthInfoByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(healthInfoService.getByStudentId(studentId));
    }
}
