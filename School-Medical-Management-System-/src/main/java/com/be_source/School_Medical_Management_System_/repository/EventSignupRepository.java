package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.EventSignup;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.HealthEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventSignupRepository extends JpaRepository<EventSignup, Long> {
    List<EventSignup> findByStudent(Students student);
    List<EventSignup> findByEvent(HealthEvent event);
    List<EventSignup> findByStudentIn(List<Students> students);
    Optional<EventSignup> findByEventAndStudent(HealthEvent event, Students student);
    boolean existsByStudentAndEvent(Students student, HealthEvent event);
}
