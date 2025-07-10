package com.be_source.School_Medical_Management_System_.response;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicationRequestResponse {
    private Long requestId;
    private Long studentId;
    private String studentName;
    private String studentClass;
    private String parentName;
    private String parentEmail;
    private String medicationName;
    private String dosage;
    private String frequency;

    private Integer totalQuantity;
    private String morningQuantity;
    private String noonQuantity;
    private String eveningQuantity;

    private String prescriptionFile;
    private ConfirmationStatus confirmationStatus;
    private String unconfirmReason;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
}
