package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.Notification;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.NotificationRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.NotificationRequest;
import com.be_source.School_Medical_Management_System_.response.NotificationResponse;
import com.be_source.School_Medical_Management_System_.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserUtilService userUtilService;

    @Override
    @Transactional
    public void createNotification(NotificationRequest request) {
        User createdBy = userUtilService.getCurrentUser();
        List<User> parents = userRepository.findByRoleName("Parent");

        for (User parent : parents) {
            Notification noti = new Notification();
            noti.setTitle(request.getTitle());
            noti.setContent(request.getContent());
            noti.setCreatedBy(createdBy);
            noti.setUser(parent);
            noti.setCreatedAt(ZonedDateTime.now());
            noti.setReadStatus(false);
            noti.setEmailSent(false);
            noti.setNotificationType("CUSTOM_NOTIFICATION");

            notificationRepository.save(noti);
        }
    }

    @Override
    public void updateNotification(Long id, NotificationRequest request) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));

        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());

        notificationRepository.save(existing);
    }

    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new NoSuchElementException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }

    @Override
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable)
                .map(this::toDto);
    }

    @Override
    public Page<NotificationResponse> getNotificationsForCurrentUser(Pageable pageable) {
        User user = userUtilService.getCurrentUser();
        return notificationRepository.findByUser_UserId(user.getUserId(), pageable)
                .map(this::toDto);
    }

    @Override
    @Transactional
    public void updateReadStatus(Long notificationId, boolean readStatus) {
        User currentUser = userUtilService.getCurrentUser();

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));

        // Đảm bảo user chỉ được cập nhật noti của mình
        if (!notification.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You are not allowed to update this notification.");
        }

        notification.setReadStatus(readStatus);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsReadForCurrentUser() {
        User user = userUtilService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUser(user);

        for (Notification n : notifications) {
            if (!n.getReadStatus()) {
                n.setReadStatus(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional
    public void createNotificationForNurses(NotificationRequest request) {
        User principal = userUtilService.getCurrentUser();

        // Kiểm tra quyền Principal
        if (!"Principal".equalsIgnoreCase(principal.getRole().getRoleName())) {
            throw new RuntimeException("Only Principal can send notifications to Nurses");
        }

        List<User> nurses = userRepository.findByRoleName("Nurse");

        for (User nurse : nurses) {
            Notification noti = new Notification();
            noti.setTitle(request.getTitle());
            noti.setContent(request.getContent());
            noti.setCreatedBy(principal);
            noti.setUser(nurse);
            noti.setCreatedAt(ZonedDateTime.now());
            noti.setReadStatus(false);
            noti.setEmailSent(false);
            noti.setNotificationType("INTERNAL_ANNOUNCEMENT");

            notificationRepository.save(noti);
        }
    }




    private NotificationResponse toDto(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.setNotificationId(n.getNotificationId());
        dto.setTitle(n.getTitle());
        dto.setContent(n.getContent());
        dto.setCreatedById(n.getCreatedBy() != null ? n.getCreatedBy().getUserId() : null);
        dto.setUserId(n.getUser() != null ? n.getUser().getUserId() : null);
        dto.setCreatedAt(n.getCreatedAt());
        dto.setReadStatus(n.getReadStatus());
        dto.setEmailSent(n.getEmailSent());
        dto.setNotificationType(n.getNotificationType());
        return dto;
    }

}
