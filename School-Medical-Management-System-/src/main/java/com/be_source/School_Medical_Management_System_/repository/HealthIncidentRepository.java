package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.HealthIncident;
import com.be_source.School_Medical_Management_System_.model.Students;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthIncidentRepository extends JpaRepository<HealthIncident, Long> {
    List<HealthIncident> findByStudent(Students student, Sort sort);
}