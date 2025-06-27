package com.be_source.School_Medical_Management_System_.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventSignupResponse {
    private Long signupId;
    private Long eventId;
    private String eventTitle;
    private Long studentId;
    private String studentName;
    private String status;
    private LocalDateTime signupDate;
}
