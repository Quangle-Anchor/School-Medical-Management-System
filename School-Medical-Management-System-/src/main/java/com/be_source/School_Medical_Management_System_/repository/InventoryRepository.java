package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.Inventory;
import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByMedicalItem(MedicalItem item);
    @Query("SELECT i FROM Inventory i WHERE LOWER(i.medicalItem.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Inventory> searchByItemName(String keyword);
    Optional<Inventory> findByMedicalItem_ItemNameIgnoreCase(String itemName);
}