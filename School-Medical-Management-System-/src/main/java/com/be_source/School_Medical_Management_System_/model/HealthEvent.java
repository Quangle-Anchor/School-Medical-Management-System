package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate scheduleDate;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String category; // Ví dụ: "Vaccination", "General Checkup", "Dental", v.v.
}
