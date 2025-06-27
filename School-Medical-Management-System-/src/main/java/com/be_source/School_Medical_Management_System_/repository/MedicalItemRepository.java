package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalItemRepository extends JpaRepository<MedicalItem, Long> {
    boolean existsByItemName(String itemName);
}
