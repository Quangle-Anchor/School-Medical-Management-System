package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.Health_Info;
import com.be_source.School_Medical_Management_System_.model.Students;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthInfoRepository extends JpaRepository<Health_Info, Long> {
    List<Health_Info> findByStudentStudentId(Long studentId);
    void deleteByStudent(Students student);
}
