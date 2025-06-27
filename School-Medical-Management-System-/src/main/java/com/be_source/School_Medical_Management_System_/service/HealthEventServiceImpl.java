package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.HealthEventRequest;
import com.be_source.School_Medical_Management_System_.response.HealthEventResponse;
import com.be_source.School_Medical_Management_System_.model.HealthEvent;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.HealthEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthEventServiceImpl implements HealthEventService {

    @Autowired
    private HealthEventRepository healthEventRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Override
    public List<HealthEventResponse> getAllEvents() {
        return healthEventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HealthEventResponse getEventById(Long id) {
        HealthEvent event = healthEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HealthEvent not found"));
        return mapToResponse(event);
    }

    @Override
    public HealthEventResponse createEvent(HealthEventRequest request) {
        User user = userUtilService.getCurrentUser();

        HealthEvent event = new HealthEvent();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setScheduleDate(request.getScheduleDate());
        event.setCategory(request.getCategory());
        event.setCreatedBy(user);
        event.setCreatedAt(LocalDateTime.now());

        return mapToResponse(healthEventRepository.save(event));
    }

    @Override
    public HealthEventResponse updateEvent(Long id, HealthEventRequest request) {
        HealthEvent event = healthEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HealthEvent not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setScheduleDate(request.getScheduleDate());
        event.setCategory(request.getCategory());

        return mapToResponse(healthEventRepository.save(event));
    }

    @Override
    public void deleteEvent(Long id) {
        healthEventRepository.deleteById(id);
    }

    private HealthEventResponse mapToResponse(HealthEvent event) {
        return HealthEventResponse.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .scheduleDate(event.getScheduleDate())
                .createdAt(event.getCreatedAt())
                .createdBy(event.getCreatedBy().getFullName())
                .build();
    }
}
