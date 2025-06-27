package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.HealthEventRequest;
import com.be_source.School_Medical_Management_System_.response.HealthEventResponse;

import java.util.List;

public interface HealthEventService {
    List<HealthEventResponse> getAllEvents();
    HealthEventResponse getEventById(Long id);
    HealthEventResponse createEvent(HealthEventRequest request);
    HealthEventResponse updateEvent(Long id, HealthEventRequest request);
    void deleteEvent(Long id);
}
