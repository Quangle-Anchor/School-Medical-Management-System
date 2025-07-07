package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.ForgotPasswordRequest;
import com.be_source.School_Medical_Management_System_.request.OtpVerificationRequest;
import com.be_source.School_Medical_Management_System_.request.ResetPasswordRequest;
import com.be_source.School_Medical_Management_System_.service.PasswordRecoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/password-recovery")

public class PasswordRecoveryController {
    @Autowired
    private PasswordRecoveryService passwordRecoveryService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody ForgotPasswordRequest request) {
        passwordRecoveryService.sendOtpToEmail(request.getEmail());
        return ResponseEntity.ok("Đã gửi OTP đến email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        passwordRecoveryService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("Xác thực OTP thành công.");
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordRecoveryService.resetPassword(
                request.getEmail(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );
        return ResponseEntity.ok("Mật khẩu đã được thay đổi.");
    }
}

