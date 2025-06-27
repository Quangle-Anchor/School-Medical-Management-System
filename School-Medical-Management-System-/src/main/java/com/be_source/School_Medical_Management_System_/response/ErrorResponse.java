package com.be_source.School_Medical_Management_System_.response;


import lombok.Data;


@Data

public class ErrorResponse {
    private String error;
    private String message;
    private int status;
    
    public ErrorResponse(String message) {
        this.message = message;
        this.error = "Error";
    }
    
    public ErrorResponse(String error, String message) {
        this.error = error;
        this.message = message;
    }
}
