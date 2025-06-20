package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.request.SignupRequest;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.AuthService;
import com.be_source.School_Medical_Management_System_.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController  {

    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    public AuthController(JwtUtil jwtUtil, AuthService authService, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.userService = userService;
    }

    // API Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = authService.login(request);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName().toUpperCase()))
            );

            String token = jwtUtil.generateToken(userDetails, user.getRole().getRoleName());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole().getRoleName()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }


    // API Validate Token
    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (jwtUtil.isTokenValid(token, userDetails)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            User createdUser = authService.signUp(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "User registered successfully",
                    "userId", createdUser.getUserId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}
