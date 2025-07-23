package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.Role;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.RoleRepository;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.GoogleLoginRequest;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.request.SignupRequest;
import com.be_source.School_Medical_Management_System_.response.AuthResponse;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.AuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName().toUpperCase()))
        );

        String token = jwtUtil.generateToken(userDetails, user.getRole().getRoleName());

        return new AuthResponse(token, user.getRole().getRoleName(), user.getEmail(),user.getFullName());
    }

    @Override
    public void signUp(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Role parentRole = roleRepository.findByRoleName("Parent")
                .orElseThrow(() -> new RuntimeException("Default role 'Parent' not found"));

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setPhone(request.getPhone());
        newUser.setFullName(request.getFullName());
        newUser.setRole(parentRole);

        userRepository.save(newUser);
    }


    @Override
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            final NetHttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            final JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList("623576178799-bpcpe0v4n2961g59hrsdfhfpsb016mnh.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new RuntimeException("Invalid ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String fullName = (String) payload.get("name");

            // Tìm hoặc tạo mới user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                Role parentRole = roleRepository.findByRoleName("Parent")
                        .orElseThrow(() -> new RuntimeException("Default role 'Parent' not found"));
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFullName(fullName);
                newUser.setUsername(email.split("@")[0]);
                newUser.setRole(parentRole);
                newUser.setPasswordHash("");
                return userRepository.save(newUser);
            });

            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    user.getEmail(), "", // password rỗng
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName().toUpperCase()))
            );

            String token = jwtUtil.generateToken(userDetails, user.getRole().getRoleName());

            return new AuthResponse(token, user.getRole().getRoleName(), user.getEmail(), user.getFullName());
        } catch (Exception e) {
            throw new RuntimeException("Google login failed: " + e.getMessage());
        }
    }

}
