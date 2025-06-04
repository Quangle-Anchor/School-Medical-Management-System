package com.be_source.School_Medical_Management_System_.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_recovery")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordRecovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recoveryId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String otpCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Boolean isUsed = false;
}
