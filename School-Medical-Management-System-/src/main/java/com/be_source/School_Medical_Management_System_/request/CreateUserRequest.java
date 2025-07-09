package com.be_source.School_Medical_Management_System_.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String password;

    @Email
    private String email;

    private String phone;
    private String fullName;
    private String roleName;
}
