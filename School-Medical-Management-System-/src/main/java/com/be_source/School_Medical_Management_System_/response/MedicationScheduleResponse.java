package com.be_source.School_Medical_Management_System_.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class MedicationScheduleResponse {
    private Long scheduleId;
    private Long studentId;
    private String studentName;
    private Long requestId;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String notes;
    private String administeredBy;
    private LocalDateTime createdAt;
    private Integer dispensedQuantity;
}
