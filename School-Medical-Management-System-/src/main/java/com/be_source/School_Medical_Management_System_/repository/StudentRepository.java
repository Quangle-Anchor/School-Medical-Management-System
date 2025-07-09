package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Students, Long> {
    List<Students> findByParent(User parent);
    Optional<Students> findByStudentCode(String studentCode);
    List<Students> findByStudentCodeContainingIgnoreCase(String keyword);
}
