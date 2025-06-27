package com.be_source.School_Medical_Management_System_.request;

import lombok.*;

import java.time.LocalDate;

@Data
public class MedicalItemRequest {
    private String itemName;
    private String category;
    private String description;
    private String manufacturer;
    private LocalDate expiryDate;
    private String storageInstructions;
    private String unit;
}
