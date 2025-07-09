package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.Notification;
import com.be_source.School_Medical_Management_System_.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmailSentFalse();
    List<Notification> findByUser(User user);
    Page<Notification> findByUser_UserId(Long userId, Pageable pageable);
}
