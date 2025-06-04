package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Students {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String fullName;

    private LocalDate dateOfBirth;

    private String className;

    private String gender;

    private String bloodType;

    private Integer heightCm;

    private Integer weightKg;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;
}
