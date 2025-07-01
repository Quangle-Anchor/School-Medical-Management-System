package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.HealthEventRequest;
import com.be_source.School_Medical_Management_System_.response.HealthEventResponse;
import com.be_source.School_Medical_Management_System_.service.HealthEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-events")
public class HealthEventController {

    @Autowired
    private HealthEventService healthEventService;

    @GetMapping
    public ResponseEntity<List<HealthEventResponse>> getAllEvents() {
        return ResponseEntity.ok(healthEventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthEventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(healthEventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<HealthEventResponse> createEvent(@RequestBody HealthEventRequest request) {
        return ResponseEntity.ok(healthEventService.createEvent(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthEventResponse> updateEvent(@PathVariable Long id, @RequestBody HealthEventRequest request) {
        return ResponseEntity.ok(healthEventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        healthEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/events/upcoming")
    public ResponseEntity<List<HealthEventResponse>> getUpcomingEvents() {
        List<HealthEventResponse> events = healthEventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }
}
