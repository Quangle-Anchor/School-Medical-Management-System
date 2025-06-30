package com.be_source.School_Medical_Management_System_.request;


import lombok.Data;

@Data
public class MedicationRequestRequest {
    private Long studentId;
    private String medicationName;
    private String dosage;
    private String frequency;

    private Integer totalQuantity;
    private String morningQuantity;
    private String noonQuantity;
    private String eveningQuantity;
}


