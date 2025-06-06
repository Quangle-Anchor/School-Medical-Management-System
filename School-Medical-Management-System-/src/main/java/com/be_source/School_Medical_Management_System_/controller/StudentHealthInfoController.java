package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.Health_Info;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.service.HealthInfoService;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/students")
public class StudentHealthInfoController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private HealthInfoService healthInfoService;

    // Lấy health info của student theo studentId
    @GetMapping("/{studentId}/health-info")
    public Optional<Health_Info> getHealthInfoByStudent(@PathVariable Long studentId) {
        Optional<Students> student = studentService.getStudentById(studentId);
        if (student.isPresent()) {
            return healthInfoService.getAllHealthInfo()
                    .stream()
                    .filter(info -> info.getStudent().getStudentId().equals(studentId))
                    .findFirst();
        } else {
            return Optional.empty();
        }
    }
}