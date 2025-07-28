package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
    @JoinColumn(name = "request_id", nullable = false)
    private MedicationRequest request;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Students student;

    private LocalDate scheduledDate;

    private LocalTime scheduledTime;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "administered_by", nullable = false)
    private User administeredBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "dispensed_quantity")
    private Integer dispensedQuantity;

}
