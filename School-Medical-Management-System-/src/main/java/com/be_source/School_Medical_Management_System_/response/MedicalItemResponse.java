package com.be_source.School_Medical_Management_System_.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalItemResponse {
    private Long itemId;
    private String itemName;
    private String category;
    private String description;
    private String manufacturer;
    private LocalDate expiryDate;
    private String storageInstructions;
    private String unit;
    private LocalDateTime createdAt;
}
