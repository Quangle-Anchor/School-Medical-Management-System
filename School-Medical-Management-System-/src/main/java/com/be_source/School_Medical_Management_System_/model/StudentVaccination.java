package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "student_vaccinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentVaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentVaccinationId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "vaccination_id")
    private Vaccination vaccination;

    private LocalDate vaccinationDate;
}
