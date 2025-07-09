package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.NotificationRequest;
import com.be_source.School_Medical_Management_System_.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    void createNotification(NotificationRequest request);
    void updateNotification(Long id, NotificationRequest request);
    void deleteNotification(Long id);
    Page<NotificationResponse> getAllNotifications(Pageable pageable);
    Page<NotificationResponse> getNotificationsForCurrentUser(Pageable pageable);


}
