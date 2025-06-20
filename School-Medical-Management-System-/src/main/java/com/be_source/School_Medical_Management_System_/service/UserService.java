package com.be_source.School_Medical_Management_System_.service;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Save or update a user. If the passwordHash field is not already a BCrypt hash,
     * encode it before saving.
     */
    public User saveUser(User user) {
        String rawOrHash = user.getPasswordHash();
        if (rawOrHash != null) {
            // If not BCrypt format, hash and overwrite
            if (!rawOrHash.startsWith("$2a$") && !rawOrHash.startsWith("$2b$")) {
                user.setPasswordHash(passwordEncoder.encode(rawOrHash));
            }
        }
        return userRepository.save(user);
    }

    /**
     * Compare a raw password against a stored password hash.
     * If storedHash is not BCrypt, do plain comparison and then upgrade to hashed.
     */
    public boolean checkPassword(String rawPassword, String storedHash) {
        if (storedHash == null) {
            return false;
        }
        // Stored value is plain text (legacy): compare directly
        if (!storedHash.startsWith("$2a$") && !storedHash.startsWith("$2b$")) {
            boolean match = rawPassword.equals(storedHash);
            if (match) {
                // upgrade to BCrypt hashed password
                userRepository.findByEmail(getEmailFromHash(storedHash))
                        .ifPresent(u -> {
                            u.setPasswordHash(passwordEncoder.encode(rawPassword));
                            userRepository.save(u);
                        });
            }
            return match;
        }
        // Standard BCrypt comparison
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    // Helper to retrieve email for upgrade; adjust if needed
    private String getEmailFromHash(String hash) {
        // implement lookup if required; else skip upgrade
        return null;
    }

    // Other methods
    public Optional<User> findByEmail(String email) { return userRepository.findByEmail(email); }
    public List<User> getAllUsers()            { return userRepository.findAll(); }
    public Optional<User> getUserById(Long id) { return userRepository.findById(id); }
    public void deleteUser(Long id)            { userRepository.deleteById(id); }


    @Autowired
    private JwtUtil jwtUtil;
    public User findByToken(String token) {
        // Bỏ "Bearer " nếu token có prefix này
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtUtil.extractUsername(token); // hoặc extract email nếu bạn dùng email làm subject
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

}