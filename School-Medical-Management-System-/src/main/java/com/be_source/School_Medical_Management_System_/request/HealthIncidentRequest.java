package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;


import java.time.LocalDate;

@Data
public class HealthIncidentRequest {
    private Long studentId;
    private LocalDate incidentDate;
    private String description;
}

