package com.be_source.School_Medical_Management_System_.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
