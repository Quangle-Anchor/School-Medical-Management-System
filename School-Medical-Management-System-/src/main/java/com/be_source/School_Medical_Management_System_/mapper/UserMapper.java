package com.be_source.School_Medical_Management_System_.mapper;

import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.response.UserProfileResponse;

public class UserMapper {

    public static UserProfileResponse toResponse(User user) {
        if (user == null) return null;

        return new UserProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getRole() != null ? user.getRole().getRoleName() : null
        );
    }
}
