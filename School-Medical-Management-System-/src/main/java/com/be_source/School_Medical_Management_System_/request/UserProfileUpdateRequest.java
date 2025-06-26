package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
        private String fullName;
        private String phone;
        private String username;
        private String email; // thêm dòng này
    }

