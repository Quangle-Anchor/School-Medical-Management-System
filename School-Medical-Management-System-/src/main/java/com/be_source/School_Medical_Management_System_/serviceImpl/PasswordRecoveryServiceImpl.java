package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.PasswordRecovery;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.PasswordRecoveryRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.service.EmailService;
import com.be_source.School_Medical_Management_System_.service.PasswordRecoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service

public class PasswordRecoveryServiceImpl implements PasswordRecoveryService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordRecoveryRepository passwordRecoveryRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void sendOtpToEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        String otp = OtpGeneratorUtil.generate6DigitOtp();

        PasswordRecovery recovery = new PasswordRecovery();
        recovery.setUser(user);
        recovery.setOtpCode(otp);
        recovery.setCreatedAt(LocalDateTime.now());
        recovery.setIsUsed(false);
        passwordRecoveryRepository.save(recovery);

        String htmlContent = generateOtpEmailHtml(email, otp);
        emailService.sendEmail(email, "OTP đặt lại mật khẩu", htmlContent);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        PasswordRecovery recovery = passwordRecoveryRepository
                .findTopByUserEmailAndIsUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy OTP hợp lệ"));

        if (!recovery.getOtpCode().equals(otp)) {
            throw new RuntimeException("OTP không đúng");
        }

        if (Duration.between(recovery.getCreatedAt(), LocalDateTime.now()).toMinutes() > 5) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        recovery.setIsUsed(true);
        passwordRecoveryRepository.save(recovery);
    }

    @Override
    public void resetPassword(String email, String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String generateOtpEmailHtml(String email, String otp) {
        return """
                <html>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                      <h2 style="color: #2E86C1;">🔐 Yêu cầu đặt lại mật khẩu</h2>
                      <p style="font-size: 16px; color: #333;">
                        Xin chào,<br><br>
                        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>%s</strong>.<br><br>
                        Vui lòng sử dụng mã OTP bên dưới để xác thực:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background-color: #2E86C1; color: white; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px;">
                          %s
                        </span>
                      </div>
                      <p style="font-size: 14px; color: #555;">
                        ⏱️ Mã OTP có hiệu lực trong vòng <strong>5 phút</strong> kể từ thời điểm nhận email này.<br>
                        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                      </p>
                      <hr style="margin-top: 30px;">
                      <p style="font-size: 12px; color: #888; text-align: center;">
                        Trân trọng,<br>
                        <strong>Trường học sức khoẻ SchoolMed</strong><br>
                        Hệ thống quản lý y tế học đường
                      </p>
                    </div>
                  </body>
                </html>
                """.formatted(email, otp);
    }
}
