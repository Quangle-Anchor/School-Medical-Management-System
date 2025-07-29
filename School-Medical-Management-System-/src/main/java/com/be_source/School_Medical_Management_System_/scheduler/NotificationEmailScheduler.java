package com.be_source.School_Medical_Management_System_.scheduler;

import com.be_source.School_Medical_Management_System_.model.Notification;
import com.be_source.School_Medical_Management_System_.repository.NotificationRepository;
import com.be_source.School_Medical_Management_System_.service.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailScheduler {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    private final String PARENT_PORTAL_URL = "http://localhost:5173/";

    @Scheduled(fixedRate = 5000) // every 5s
    @Transactional
    public void sendNotificationEmails() {
        List<Notification> pending = notificationRepository.findByEmailSentFalse();

        for (Notification noti : pending) {
            try {
                String to = noti.getUser().getEmail();
                if (to == null || to.isBlank()) continue;

                String recipientName = Optional.ofNullable(noti.getUser().getFullName()).orElse("Parent");

                String emailHeader = getEmailHeader(noti.getNotificationType());
                String typeLabel = getTypeLabel(noti.getNotificationType());
                String subject = "[SMMS] " + emailHeader + " – " + noti.getTitle();

                String html = buildEmailTemplate(typeLabel, emailHeader, noti.getContent(), recipientName);
                emailService.sendEmail(to, subject, html);

                noti.setEmailSent(true);
                notificationRepository.save(noti);

                log.info("✅ Email sent to {}", to);
            } catch (Exception e) {
                log.error("❌ Failed to send email for notification {}", noti.getNotificationId(), e);
            }
        }
    }

    private String getEmailHeader(String type) {
        return switch (type) {
            case "HEALTH_EVENT" -> "Vừa có sự kiện y tế mới được tạo!";
            case "HEALTH_INCIDENT" -> "Vừa có tai nạn xảy ra liên quan đến học sinh!";
            case "MEDICATION_REQUEST" -> "Yêu cầu cấp phát thuốc của bạn đã được cập nhật!";
            case "MEDICATION_ADMINISTERED", "MEDICATION_SCHEDULE" -> "Đơn thuốc của học sinh đã được cấp phát.";
            case "EVENT_SIGNUP" -> "Trạng thái đăng ký sự kiện vừa được thay đổi.";
            case "EVENT_UPDATED" -> "Một sự kiện y tế đã được cập nhật.";
            case "EVENT_DELETED" -> "Một sự kiện y tế đã bị hủy.";
            case "INTERNAL_ANNOUNCEMENT" -> "Bạn có một thông báo mới từ hiệu trưởng.";
            case "CUSTOM" -> "Thông báo từ trường học.";
            case "STUDENT_CONFIRMED" -> "Thông tin học sinh đã được xác nhận.";
            case "STUDENT_UNCONFIRMED" -> "Thông tin học sinh không được chấp nhận.";
            default -> "Thông báo y tế từ nhà trường.";
        };
    }

    private String getTypeLabel(String type) {
        return switch (type) {
            case "HEALTH_EVENT" -> "📅 Health Event Notice";
            case "HEALTH_INCIDENT" -> "🚑 Health Incident Alert";
            case "MEDICATION_REQUEST" -> "💊 Medication Request Update";
            case "MEDICATION_ADMINISTERED", "MEDICATION_SCHEDULE" -> "✅ Medication Administered";
            case "EVENT_SIGNUP" -> "📥 Event Signup Status";
            case "EVENT_UPDATED" -> "🔄 Event Updated";
            case "EVENT_DELETED" -> "❌ Event Deleted";
            case "INTERNAL_ANNOUNCEMENT" -> "📩 Message from Principal";
            case "CUSTOM" -> "📢 General Notification";
            case "STUDENT_CONFIRMED" -> "✅ Student Confirmed";
            case "STUDENT_UNCONFIRMED" -> "❌ Student Not Accepted";
            default -> "📌 School Notification";
        };
    }

    private String buildEmailTemplate(String tag, String header, String content, String recipientName) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <title>School Health Notification</title>
                  <style>
                    body {
                      font-family: 'Segoe UI', sans-serif;
                      background-color: #f4f6f9;
                      color: #333;
                      margin: 0;
                      padding: 0;
                    }
                    .email-container {
                      max-width: 600px;
                      margin: 30px auto;
                      background-color: #fff;
                      border-radius: 10px;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                      padding: 30px;
                    }
                    .header {
                      text-align: center;
                      border-bottom: 1px solid #e0e0e0;
                      padding-bottom: 10px;
                      margin-bottom: 20px;
                    }
                    .header h2 {
                      color: #2e86de;
                      margin-bottom: 5px;
                    }
                    .tag {
                      display: inline-block;
                      background-color: #eaf4ff;
                      color: #2e86de;
                      padding: 4px 10px;
                      font-size: 13px;
                      border-radius: 20px;
                      margin-top: 5px;
                    }
                    .content {
                      font-size: 16px;
                      line-height: 1.6;
                    }
                    .note {
                      background-color: #f9f9f9;
                      border-left: 4px solid #2e86de;
                      padding: 10px 15px;
                      margin-top: 20px;
                      font-style: italic;
                      color: #444;
                    }
                    .button {
                      display: inline-block;
                      margin-top: 20px;
                      padding: 12px 24px;
                      background-color: #2e86de;
                      color: white;
                      text-decoration: none;
                      border-radius: 5px;
                    }
                    .footer {
                      margin-top: 30px;
                      font-size: 13px;
                      color: #888;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class='email-container'>
                    <div class='header'>
                      <h2>🏥 School Medical Notification</h2>
                      <div class='tag'>%s</div>
                      <p><strong>%s</strong></p>
                    </div>
                    <div class='content'>
                      <p>Dear %s,</p>
                      <p>%s</p>
                      <div class='note'>
                        This is an automated health alert from your child’s school. Please check the Parent Portal for more details.
                      </div>
                      <a href='%s' class='button'>View in Parent Portal</a>
                    </div>
                    <div class='footer'>
                      &copy; %d School Medical Management System – All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """, tag, header, recipientName, content, PARENT_PORTAL_URL, Year.now().getValue());
    }
}
