package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.HealthEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthEventRepository extends JpaRepository<HealthEvent, Long> {
    List<HealthEvent> findByCreatedByUserId(Long userId);
    List<HealthEvent> findByCategory(String category);
    List<HealthEvent> findByScheduleDateAfter(LocalDate dateTime);
}
