package com.be_source.School_Medical_Management_System_.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentResponse {
    private Long studentId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String className;
    private String gender;
    private String bloodType;
    private Integer heightCm;
    private Integer weightKg;
}
