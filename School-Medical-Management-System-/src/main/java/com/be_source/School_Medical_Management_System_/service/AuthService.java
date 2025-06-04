package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> login(LoginRequest request) {
        Optional<User> user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(request.getEmail())
                        && u.getPasswordHash().equals(request.getPassword()))
                .findFirst();
        return user;
    }
}