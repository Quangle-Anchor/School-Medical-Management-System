package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.request.ChangePasswordRequest;
import com.be_source.School_Medical_Management_System_.request.UserProfileUpdateRequest;
import com.be_source.School_Medical_Management_System_.response.UserProfileResponse;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    User saveUser(User user);
    boolean checkPassword(String rawPassword, String storedHash);
    Optional<User> findByEmail(String email);
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    void deleteUser(Long id);
    User getCurrentUser();
    UserProfileResponse updateProfile(UserProfileUpdateRequest request);
    void changePassword(ChangePasswordRequest request);
}
