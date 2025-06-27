package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.InventoryRequest;
import com.be_source.School_Medical_Management_System_.response.InventoryResponse;

import java.util.List;

public interface InventoryService {
    InventoryResponse add(InventoryRequest request);
    InventoryResponse update(Long id, InventoryRequest request);
    void delete(Long id);
    List<InventoryResponse> getAll();
    List<InventoryResponse> searchByItemName(String keyword);

}
