package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private String medicineName;
    private Integer totalQuantity;
    private String unit;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;
}
