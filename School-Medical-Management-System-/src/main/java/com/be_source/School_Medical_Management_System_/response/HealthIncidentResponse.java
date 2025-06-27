package com.be_source.School_Medical_Management_System_.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class HealthIncidentResponse {
    private Long incidentId;
    private Long studentId;
    private String studentName;
    private LocalDate incidentDate;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
}

