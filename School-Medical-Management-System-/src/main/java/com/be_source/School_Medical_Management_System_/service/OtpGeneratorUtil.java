package com.be_source.School_Medical_Management_System_.service;

import java.util.Random;

public class OtpGeneratorUtil {
    public static String generate6DigitOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}

