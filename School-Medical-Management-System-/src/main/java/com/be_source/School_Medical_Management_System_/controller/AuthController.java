package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.request.LoginRequest;
import com.be_source.School_Medical_Management_System_.response.AuthResponse;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.AuthService;
import com.be_source.School_Medical_Management_System_.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.webauthn.api.AuthenticatorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
//
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final UserService userService;

    public AuthController(JwtUtil jwtUtil, AuthService authService, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.userService = userService;
    }

    // Existing login endpoint
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        // Verify password: assume userService.checkPassword hashes and compares
        if (!userService.checkPassword(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Generate JWT token using username or userId
        String token = jwtUtil.generateToken(user.getUsername());

        // Extract role name from Role entity
        String roleName = user.getRole().getRoleName();

        AuthResponse response = new AuthResponse(token, roleName);
        return ResponseEntity.ok(response);
    }

    // Change this:
    // @PostMapping("/validate-token")
    // public ResponseEntity<?> validateToken(...) { ... }

    // To this:
    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        String token = authHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}