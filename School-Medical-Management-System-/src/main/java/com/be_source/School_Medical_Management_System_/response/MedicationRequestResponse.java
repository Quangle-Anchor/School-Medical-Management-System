package com.be_source.School_Medical_Management_System_.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicationRequestResponse {
    private Long requestId;
    private Long studentId;
    private String studentName;
    private String medicationName;
    private String dosage;
    private String frequency;

    private Integer totalQuantity;
    private String morningQuantity;
    private String noonQuantity;
    private String eveningQuantity;

    private String prescriptionFile;
    private boolean isConfirmed;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
}
