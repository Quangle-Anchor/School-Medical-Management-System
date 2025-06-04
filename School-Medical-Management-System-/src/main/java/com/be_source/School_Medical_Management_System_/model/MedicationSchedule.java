package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private MedicationRequest request;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    private LocalDate scheduledDate;
    private String scheduledTime;
    private String status;
    private String administeredBy;
    private String notes;
    private LocalDateTime createdAt;
}
