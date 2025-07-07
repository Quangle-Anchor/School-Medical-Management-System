package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String email;
    private String otp;
}

