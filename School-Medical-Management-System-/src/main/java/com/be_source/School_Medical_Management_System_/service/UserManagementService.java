package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.CreateUserRequest;
import com.be_source.School_Medical_Management_System_.request.UpdateUserRequest;
import com.be_source.School_Medical_Management_System_.response.UserManagementResponse;
import java.util.List;

public interface UserManagementService {
    UserManagementResponse createUser(CreateUserRequest request);
    UserManagementResponse updateUser(Long userId, UpdateUserRequest request);
    void deleteUser(Long userId);
    List<UserManagementResponse> getAllUsers();
}
