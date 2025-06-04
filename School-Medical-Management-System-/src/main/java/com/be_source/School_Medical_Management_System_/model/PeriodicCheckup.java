package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "periodic_checkups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodicCheckup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checkupId;

    private String checkupName;
    private LocalDate scheduleDate;
    private String description;
}

