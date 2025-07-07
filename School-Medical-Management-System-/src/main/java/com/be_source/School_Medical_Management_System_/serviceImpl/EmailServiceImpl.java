package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String to, String subject, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // gửi HTML content
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
    }
}
