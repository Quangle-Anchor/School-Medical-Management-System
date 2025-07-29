package com.be_source.School_Medical_Management_System_.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
public class NotificationResponse {
    private Long notificationId;
    private String title;
    private String content;
    private Long createdById;
    private Long userId;
    private LocalDateTime createdAt;
    private Boolean readStatus;
    private Boolean emailSent;
    private String notificationType;
}
