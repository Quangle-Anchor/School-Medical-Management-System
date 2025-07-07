package com.be_source.School_Medical_Management_System_.service;

public interface PasswordRecoveryService {
    void sendOtpToEmail(String email);
    void verifyOtp(String email, String otp);
    void resetPassword(String email, String newPassword, String confirmPassword);
}

