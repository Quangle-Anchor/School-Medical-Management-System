package com.be_source.School_Medical_Management_System_.model;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    private String healthStatus;

    @Column(unique = true, updatable = false)
    private String studentCode;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Health_Info> healthInfoList;

    @Enumerated(EnumType.STRING)
    @Column(name = "confirmation_status", nullable = false)
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.pending;
}
