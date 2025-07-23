package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.request.ChangePasswordRequest;
import com.be_source.School_Medical_Management_System_.request.UserProfileUpdateRequest;
import com.be_source.School_Medical_Management_System_.response.UserProfileResponse;
import com.be_source.School_Medical_Management_System_.service.IUserService;
import com.be_source.School_Medical_Management_System_.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(UserMapper.toResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
