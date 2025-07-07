package com.be_source.School_Medical_Management_System_.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    @Email
    private String email;

    private String phone;

    @NotBlank
    private String fullName;

    @NotBlank
    private String roleName;
}
