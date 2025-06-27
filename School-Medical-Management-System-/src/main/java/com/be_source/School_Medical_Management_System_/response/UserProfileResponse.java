package com.be_source.School_Medical_Management_System_.response;


import lombok.Data;


@Data

public class UserProfileResponse {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String role;
}
