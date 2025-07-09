package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.MedicalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalItemRepository extends JpaRepository<MedicalItem, Long> {
    boolean existsByItemName(String itemName);
    @Query("SELECT m FROM MedicalItem m WHERE LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MedicalItem> searchByKeyword(@Param("keyword") String keyword);
}
