package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HealthEventRequest {
    private String title;
    private String description;
    private LocalDate scheduleDate;
    private String category;
}
