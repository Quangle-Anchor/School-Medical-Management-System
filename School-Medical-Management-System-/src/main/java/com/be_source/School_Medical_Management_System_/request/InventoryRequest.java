package com.be_source.School_Medical_Management_System_.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {
    private Long itemId;
    private Integer totalQuantity;
}
