package com.be_source.School_Medical_Management_System_.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserManagementResponse {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String roleName;
}
