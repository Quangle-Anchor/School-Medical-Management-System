package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.InventoryRequest;
import com.be_source.School_Medical_Management_System_.response.InventoryResponse;
import com.be_source.School_Medical_Management_System_.service.InventoryService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // View all inventory (cho mọi role: nurse, principal, parent)
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    // Add inventory - chỉ cho NURSE và PRINCIPAL
    @PostMapping
    @RolesAllowed({"ROLE_NURSE", "ROLE_PRINCIPAL"})
    public ResponseEntity<InventoryResponse> add(@RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.add(request));
    }

    // Update inventory - chỉ cho NURSE
    @PutMapping("/{id}")
    @RolesAllowed({"ROLE_NURSE"})
    public ResponseEntity<InventoryResponse> update(@PathVariable Long id, @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.update(id, request));
    }

    // Delete inventory - chỉ cho NURSE hoặc PRINCIPAL
    @DeleteMapping("/{id}")
    @RolesAllowed({"ROLE_NURSE", "ROLE_PRINCIPAL"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // Search - Cho mọi role
    @GetMapping("/search")
    public ResponseEntity<List<InventoryResponse>> searchInventory(@RequestParam String keyword) {
        return ResponseEntity.ok(inventoryService.searchByItemName(keyword));
    }

}
