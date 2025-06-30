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

    private String frequency; // Đã đổi từ Integer sang String

    private String prescriptionFile;

    @ManyToOne
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "morning_quantity")
    private String morningQuantity; // Đổi từ Integer sang String

    @Column(name = "noon_quantity")
    private String noonQuantity; // Đổi từ Integer sang String

    @Column(name = "evening_quantity")
    private String eveningQuantity; // Đổi từ Integer sang String

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_confirmed")
    private Boolean isConfirmed = false;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
}
