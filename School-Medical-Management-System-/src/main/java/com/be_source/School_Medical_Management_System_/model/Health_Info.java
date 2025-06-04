package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Health_Info {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long healthInfoId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    private String medicalConditions;
    private String allergies;
    private String notes;
    private LocalDateTime updatedAt;
}
