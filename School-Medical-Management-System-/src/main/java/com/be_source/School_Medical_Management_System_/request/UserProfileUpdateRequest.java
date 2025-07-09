package com.be_source.School_Medical_Management_System_.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
        private String fullName;
        private String phone;
        private String username;
        @Email
        private String email;
    }

