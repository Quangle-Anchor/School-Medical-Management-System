package com.be_source.School_Medical_Management_System_.response;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentResponse {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String className;
    private String gender;
    private String bloodType;
    private Integer heightCm;
    private Integer weightKg;
    private String healthStatus;
    private LocalDateTime updatedAt;
    private ConfirmationStatus confirmationStatus;
    private List<HealthInfoResponse> healthInfoList;
}
