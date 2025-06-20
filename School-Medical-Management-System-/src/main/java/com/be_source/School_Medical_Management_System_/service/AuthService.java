package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.Role;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.RoleRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.request.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<User> login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPasswordHash()));
    }

    public User signUp(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // Tự động gán role "parent"
        Role parentRole = roleRepository.findByRoleName("Parent")
                .orElseThrow(() -> new RuntimeException("Default role 'parent' not found"));

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword())); // hash password
        newUser.setPhone(request.getPhone());
        newUser.setFullName(request.getFullName());
        newUser.setRole(parentRole);

        return userRepository.save(newUser);
    }

}