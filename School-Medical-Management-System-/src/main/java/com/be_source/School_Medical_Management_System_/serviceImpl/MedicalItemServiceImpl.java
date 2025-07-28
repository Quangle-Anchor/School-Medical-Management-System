package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.Inventory;
import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.repository.InventoryRepository;
import com.be_source.School_Medical_Management_System_.repository.MedicationRequestRepository;
import com.be_source.School_Medical_Management_System_.request.MedicalItemRequest;
import com.be_source.School_Medical_Management_System_.response.MedicalItemResponse;
import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import com.be_source.School_Medical_Management_System_.repository.MedicalItemRepository;
import com.be_source.School_Medical_Management_System_.service.MedicalItemService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalItemServiceImpl implements MedicalItemService {

    @Autowired
    private MedicalItemRepository medicalItemRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;


    @Override
    public MedicalItemResponse create(MedicalItemRequest request) {
        MedicalItem item = MedicalItem.builder()
                .itemName(request.getItemName())
                .category(request.getCategory())
                .description(request.getDescription())
                .manufacturer(request.getManufacturer())
                .expiryDate(request.getExpiryDate())
                .storageInstructions(request.getStorageInstructions())
                .unit(request.getUnit())
                .build();

        MedicalItem savedItem = medicalItemRepository.save(item);

        // ✅ Tạo inventory mới cho item (nếu chưa có)
        Inventory inventory = inventoryRepository.findByMedicalItem(savedItem).orElse(null);
        if (inventory == null) {
            inventory = Inventory.builder()
                    .medicalItem(savedItem)
                    .totalQuantity(0)
                    .build();
            inventory = inventoryRepository.save(inventory);
        }

// ✅ Biến dùng trong lambda phải là final
        final Inventory finalInventory = inventory;

        List<MedicationRequest> unmatchedRequests = medicationRequestRepository.findByInventoryIsNull();
        List<MedicationRequest> toUpdate = unmatchedRequests.stream()
                .filter(req -> req.getMedicationName() != null &&
                        req.getMedicationName().equalsIgnoreCase(savedItem.getItemName()))
                .peek(req -> {
                    req.setInventory(finalInventory);
                    boolean sufficient = finalInventory.getTotalQuantity() >=
                            (req.getTotalQuantity() != null ? req.getTotalQuantity() : 0);
                    req.setIsSufficientStock(sufficient);
                })
                .collect(Collectors.toList());

        medicationRequestRepository.saveAll(toUpdate);

        return toResponse(savedItem);
    }




    @Override
    public MedicalItemResponse update(Long id, MedicalItemRequest request) {
        MedicalItem existing = medicalItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        String oldName = existing.getItemName();

        // Cập nhật thông tin
        existing.setItemName(request.getItemName());
        existing.setCategory(request.getCategory());
        existing.setDescription(request.getDescription());
        existing.setManufacturer(request.getManufacturer());
        existing.setExpiryDate(request.getExpiryDate());
        existing.setStorageInstructions(request.getStorageInstructions());
        existing.setUnit(request.getUnit());

        MedicalItem updated = medicalItemRepository.save(existing);

        // Lấy inventory sau khi cập nhật
        Inventory inventory = inventoryRepository.findByMedicalItem(updated).orElse(null);

        // ✅ Trường hợp 1: Những request đang dùng inventory này nhưng tên thuốc KHÔNG còn khớp → xoá gán inventory
        if (inventory != null) {
            List<MedicationRequest> currentlyLinkedRequests = medicationRequestRepository.findByInventory(inventory);
            for (MedicationRequest req : currentlyLinkedRequests) {
                if (!req.getMedicationName().equalsIgnoreCase(updated.getItemName())) {
                    req.setInventory(null);
                    req.setIsSufficientStock(false);
                }
            }

            // ✅ Trường hợp 2: Những request chưa có inventory mà TÊN THUỐC MỚI khớp → gán inventory vào
            List<MedicationRequest> unlinkedMatchingRequests = medicationRequestRepository
                    .findByMedicationNameIgnoreCaseAndInventoryIsNull(updated.getItemName());

            for (MedicationRequest req : unlinkedMatchingRequests) {
                req.setInventory(inventory);
                boolean sufficient = inventory.getTotalQuantity() >= (req.getTotalQuantity() != null ? req.getTotalQuantity() : 0);
                req.setIsSufficientStock(sufficient);
            }

            // Lưu lại tất cả request bị thay đổi
            medicationRequestRepository.saveAll(currentlyLinkedRequests);
            medicationRequestRepository.saveAll(unlinkedMatchingRequests);
        }

        return toResponse(updated);
    }


    @Override
    @Transactional
    public void delete(Long id) {
        MedicalItem item = medicalItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Tìm inventory liên kết với item
        Inventory inventory = inventoryRepository.findByMedicalItem(item).orElse(null);

        if (inventory != null) {
            // B1: Cập nhật tất cả các MedicationRequest liên kết inventory
            List<MedicationRequest> affectedRequests = medicationRequestRepository.findByInventory(inventory);

            for (MedicationRequest req : affectedRequests) {
                req.setInventory(null);
                req.setIsSufficientStock(false);
            }

            medicationRequestRepository.saveAll(affectedRequests);

            // B2: Xoá Inventory
            inventoryRepository.delete(inventory);
        }

        // B3: Xoá MedicalItem
        medicalItemRepository.delete(item);
    }



    @Override
    public List<MedicalItemResponse> getAll() {
        return medicalItemRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalItemResponse getById(Long id) {
        return medicalItemRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }
    @Override
    public List<MedicalItemResponse> search(String keyword) {
        List<MedicalItem> results = medicalItemRepository.searchByKeyword(keyword);
        return results.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    private MedicalItemResponse toResponse(MedicalItem item) {
        return MedicalItemResponse.builder()
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
    }
}
