package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.GoogleLoginRequest;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.request.SignupRequest;
import com.be_source.School_Medical_Management_System_.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void signUp(SignupRequest request);
    AuthResponse googleLogin(GoogleLoginRequest request);
}
