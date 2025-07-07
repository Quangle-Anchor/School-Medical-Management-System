package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.PasswordRecovery;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.PasswordRecoveryRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

        emailService.sendEmail(email, "OTP đặt lại mật khẩu", "Mã OTP của bạn là: " + otp);
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
}
