package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkup_signups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckupSignup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long signupId;

    @ManyToOne
    @JoinColumn(name = "checkup_id")
    private PeriodicCheckup checkup;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    private LocalDateTime signupDate = LocalDateTime.now();
}

