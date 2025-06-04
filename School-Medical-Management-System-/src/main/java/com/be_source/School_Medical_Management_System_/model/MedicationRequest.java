package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medication_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    private String medicationName;
    private String dosage;
    private String frequency;
    private String prescriptionFile;
    private String requestedBy;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;
}

