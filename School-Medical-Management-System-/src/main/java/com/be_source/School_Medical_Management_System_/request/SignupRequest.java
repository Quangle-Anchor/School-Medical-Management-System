package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
}
