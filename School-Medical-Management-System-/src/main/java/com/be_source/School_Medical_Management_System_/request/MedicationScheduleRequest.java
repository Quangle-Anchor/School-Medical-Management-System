package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MedicationScheduleRequest {
    private Long requestId;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String notes;
}
