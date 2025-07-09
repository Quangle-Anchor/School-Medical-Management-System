package com.be_source.School_Medical_Management_System_.serviceImpl;

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

    @Override
    public InventoryResponse add(InventoryRequest request) {
        MedicalItem item = medicalItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Kiểm tra xem đã có item này trong kho chưa
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

        return toResponse(inventoryRepository.save(inventory));
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

        return toResponse(inventoryRepository.save(existing));
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
}
