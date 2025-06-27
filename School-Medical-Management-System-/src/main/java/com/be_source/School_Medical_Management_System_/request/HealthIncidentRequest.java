package com.be_source.School_Medical_Management_System_.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HealthIncidentRequest {
    private Long studentId;
    private LocalDate incidentDate;
    private String description;
}

