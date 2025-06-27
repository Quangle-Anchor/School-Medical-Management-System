package com.be_source.School_Medical_Management_System_.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {
    private Long inventoryId;
    private MedicalItemResponse item;
    private Integer totalQuantity;
    private LocalDateTime updatedAt;
}
