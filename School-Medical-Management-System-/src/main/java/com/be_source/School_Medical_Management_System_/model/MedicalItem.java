package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String itemName;

    private String category; // e.g., "Medicine", "Bandage", "Disinfectant"

    @Column(columnDefinition = "TEXT")
    private String description;

    private String manufacturer;

    private LocalDate expiryDate; // optional, nullable for non-expiring items

    private String storageInstructions;

    private String unit;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
