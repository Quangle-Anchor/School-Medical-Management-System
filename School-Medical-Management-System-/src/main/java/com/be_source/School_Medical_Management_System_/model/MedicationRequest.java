package com.be_source.School_Medical_Management_System_.model;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
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

    @ManyToOne
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "morning_quantity")
    private String morningQuantity;

    @Column(name = "noon_quantity")
    private String noonQuantity;

    @Column(name = "evening_quantity")
    private String eveningQuantity;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "confirmation_status")
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.pending;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "unconfirm_reason")
    private String unconfirmReason;
}
