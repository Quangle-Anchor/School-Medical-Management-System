package com.be_source.School_Medical_Management_System_.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class HealthEventResponse {
    private Long eventId;
    private String title;
    private String description;
    private String category;
    private LocalDate scheduleDate;
    private String createdBy;
    private LocalDateTime createdAt;
}
