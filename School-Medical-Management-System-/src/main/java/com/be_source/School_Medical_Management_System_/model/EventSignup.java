package com.be_source.School_Medical_Management_System_.model;

import com.be_source.School_Medical_Management_System_.enums.SignupStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_signups", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "event_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSignup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long signupId;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private HealthEvent event;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Students student;

    private LocalDateTime signupDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private SignupStatus status = SignupStatus.PENDING;
}

