package com.be_source.School_Medical_Management_System_.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HealthInfoResponse {
    private Long healthInfoId;
    private Long studentId;
    private String medicalConditions;
    private String allergies;
    private String notes;
    private LocalDateTime updatedAt;
}
