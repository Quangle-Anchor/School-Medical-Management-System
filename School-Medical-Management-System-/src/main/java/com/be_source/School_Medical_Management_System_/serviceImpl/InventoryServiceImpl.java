package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.request.InventoryRequest;
import com.be_source.School_Medical_Management_System_.response.InventoryResponse;
import com.be_source.School_Medical_Management_System_.response.MedicalItemResponse;
import com.be_source.School_Medical_Management_System_.model.Inventory;
import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import com.be_source.School_Medical_Management_System_.repository.InventoryRepository;
import com.be_source.School_Medical_Management_System_.repository.MedicalItemRepository;
import com.be_source.School_Medical_Management_System_.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicalItemRepository medicalItemRepository;

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Override
    public InventoryResponse add(InventoryRequest request) {
        MedicalItem item = medicalItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Inventory inventory = inventoryRepository.findByMedicalItem(item).orElse(null);

        if (inventory == null) {
            inventory = Inventory.builder()
                    .medicalItem(item)
                    .totalQuantity(request.getTotalQuantity())
                    .updatedAt(LocalDateTime.now())
                    .build();
        } else {
            inventory.setTotalQuantity(inventory.getTotalQuantity() + request.getTotalQuantity());
            inventory.setUpdatedAt(LocalDateTime.now());
        }

        Inventory saved = inventoryRepository.save(inventory);

        // ✅ Cập nhật lại các MedicationRequest liên quan
        updateMedicationRequestStockStatus(saved);

        return toResponse(saved);
    }

    @Override
    public InventoryResponse update(Long id, InventoryRequest request) {
        Inventory existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        int quantityToSubtract = request.getTotalQuantity();
        int current = existing.getTotalQuantity();

        if (quantityToSubtract > current) {
            throw new RuntimeException("Không đủ số lượng trong kho để xuất");
        }

        existing.setTotalQuantity(current - quantityToSubtract);
        existing.setUpdatedAt(LocalDateTime.now());

        Inventory saved = inventoryRepository.save(existing);

        // ✅ Cập nhật lại các MedicationRequest liên quan
        updateMedicationRequestStockStatus(saved);

        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    @Override
    public List<InventoryResponse> getAll() {
        return inventoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> searchByItemName(String keyword) {
        List<Inventory> inventories = inventoryRepository.searchByItemName(keyword);
        return inventories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private InventoryResponse toResponse(Inventory inventory) {
        MedicalItem item = inventory.getMedicalItem();

        MedicalItemResponse itemResponse = MedicalItemResponse.builder()
                .itemId(item.getItemId())
                .itemName(item.getItemName())
                .category(item.getCategory())
                .description(item.getDescription())
                .manufacturer(item.getManufacturer())
                .expiryDate(item.getExpiryDate())
                .storageInstructions(item.getStorageInstructions())
                .unit(item.getUnit())
                .createdAt(item.getCreatedAt())
                .build();

        return InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .item(itemResponse)
                .totalQuantity(inventory.getTotalQuantity())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }

    // ✅ Hàm cập nhật trạng thái đủ/thiếu thuốc cho các MedicationRequest liên quan
    private void updateMedicationRequestStockStatus(Inventory inventory) {
        List<MedicationRequest> requests = medicationRequestRepository.findByInventory(inventory);

        for (MedicationRequest request : requests) {
            Integer reqQty = request.getTotalQuantity();
            Integer available = inventory.getTotalQuantity();

            boolean sufficient = reqQty != null && available != null && available >= reqQty;
            request.setIsSufficientStock(sufficient);
        }

        medicationRequestRepository.saveAll(requests);
    }
}

