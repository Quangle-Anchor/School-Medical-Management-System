package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.EventSignupRequest;
import com.be_source.School_Medical_Management_System_.response.EventSignupResponse;
import com.be_source.School_Medical_Management_System_.service.EventSignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-signups")
public class EventSignupController {

    @Autowired
    private EventSignupService eventSignupService;

    @PostMapping
    public ResponseEntity<EventSignupResponse> createSignup(@RequestBody EventSignupRequest request) {
        return ResponseEntity.ok(eventSignupService.createSignup(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EventSignupResponse>> getMySignups() {
        return ResponseEntity.ok(eventSignupService.getMySignups());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventSignupResponse>> getSignupsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventSignupService.getSignupsByEvent(eventId));
    }

    @PutMapping("/{signupId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long signupId,
                                          @RequestParam("status") String status) {
        eventSignupService.updateStatus(signupId, status);
        return ResponseEntity.ok("Status updated successfully");
    }

    @PutMapping("/event/{eventId}/approve-all")
    public ResponseEntity<String> approveAllSignups(@PathVariable Long eventId) {
        eventSignupService.approveAllSignups(eventId);
        return ResponseEntity.ok("All signups for event ID " + eventId + " have been approved.");
    }
}
