package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.request.MedicalItemRequest;
import com.be_source.School_Medical_Management_System_.response.MedicalItemResponse;
import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import com.be_source.School_Medical_Management_System_.repository.MedicalItemRepository;
import com.be_source.School_Medical_Management_System_.service.MedicalItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalItemServiceImpl implements MedicalItemService {

    @Autowired
    private MedicalItemRepository medicalItemRepository;

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

        return toResponse(medicalItemRepository.save(item));
    }

    @Override
    public MedicalItemResponse update(Long id, MedicalItemRequest request) {
        MedicalItem existing = medicalItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        existing.setItemName(request.getItemName());
        existing.setCategory(request.getCategory());
        existing.setDescription(request.getDescription());
        existing.setManufacturer(request.getManufacturer());
        existing.setExpiryDate(request.getExpiryDate());
        existing.setStorageInstructions(request.getStorageInstructions());
        existing.setUnit(request.getUnit());

        return toResponse(medicalItemRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        medicalItemRepository.deleteById(id);
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
