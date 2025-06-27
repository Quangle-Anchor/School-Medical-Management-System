package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.EventSignupRequest;
import com.be_source.School_Medical_Management_System_.response.EventSignupResponse;

import java.util.List;

public interface EventSignupService {
    EventSignupResponse createSignup(EventSignupRequest request);
    List<EventSignupResponse> getMySignups(); // theo parent
    List<EventSignupResponse> getSignupsByEvent(Long eventId); // cho nurse, principal
    void updateStatus(Long signupId, String status); // duyệt hoặc từ chối
}
