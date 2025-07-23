package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.mapper.UserMapper;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import com.be_source.School_Medical_Management_System_.request.ChangePasswordRequest;
import com.be_source.School_Medical_Management_System_.request.UserProfileUpdateRequest;
import com.be_source.School_Medical_Management_System_.response.UserProfileResponse;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
    @Autowired
    private UserUtilService userUtilService;

    @Override
    public User saveUser(User user) {
        String rawOrHash = user.getPasswordHash();
        if (rawOrHash != null && !rawOrHash.startsWith("$2a$") && !rawOrHash.startsWith("$2b$")) {
            user.setPasswordHash(passwordEncoder.encode(rawOrHash));
        }
        return userRepository.save(user);
    }

    @Override
    public boolean checkPassword(String rawPassword, String storedHash) {
        if (storedHash == null) return false;

        if (!storedHash.startsWith("$2a$") && !storedHash.startsWith("$2b$")) {
            boolean match = rawPassword.equals(storedHash);
            if (match) {
                // upgrade to hash (legacy support — optional)
                // Optional<User> userOpt = userRepository.findByEmail(...);
            }
            return match;
        }

        return passwordEncoder.matches(rawPassword, storedHash);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getCurrentUser() {
        return userUtilService.getCurrentUser();
    }

    @Override
    public UserProfileResponse updateProfile(UserProfileUpdateRequest request) {
        User currentUser = userUtilService.getCurrentUser();

        // Kiểm tra nếu email đã đổi và có email khác trùng
        if (!currentUser.getEmail().equals(request.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getUserId().equals(currentUser.getUserId())) {
                    throw new RuntimeException("Email already in use by another user");
                }
            });
            currentUser.setEmail(request.getEmail());
        }

        // Cập nhật các thông tin khác
        currentUser.setFullName(request.getFullName());
        currentUser.setPhone(request.getPhone());
        currentUser.setUsername(request.getUsername());

        return UserMapper.toResponse(userRepository.save(currentUser));
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User currentUser = userUtilService.getCurrentUser();

        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPasswordHash())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

}
