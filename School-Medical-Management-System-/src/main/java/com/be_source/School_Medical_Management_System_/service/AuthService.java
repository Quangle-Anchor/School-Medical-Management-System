package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.request.SignupRequest;

import java.util.Optional;

public interface AuthService {
    Optional<User> login(LoginRequest request);
    User signUp(SignupRequest request);
}
