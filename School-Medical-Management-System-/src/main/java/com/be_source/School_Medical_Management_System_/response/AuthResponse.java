package com.be_source.School_Medical_Management_System_.response;

public class AuthResponse {
    private String token;
    private String role;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role  = role;
    }
    public String getToken() { return token; }
    public String getRole()  { return role; }
}