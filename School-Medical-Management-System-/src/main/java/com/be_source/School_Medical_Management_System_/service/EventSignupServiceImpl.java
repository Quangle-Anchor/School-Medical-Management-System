package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.request.EventSignupRequest;
import com.be_source.School_Medical_Management_System_.response.EventSignupResponse;
import com.be_source.School_Medical_Management_System_.model.*;
import com.be_source.School_Medical_Management_System_.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventSignupServiceImpl implements EventSignupService {

    @Autowired
    private EventSignupRepository eventSignupRepository;

    @Autowired
    private HealthEventRepository healthEventRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Override
    public EventSignupResponse createSignup(EventSignupRequest request) {
        User parent = userUtilService.getCurrentUser();

        Students student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getParent().getUserId().equals(parent.getUserId())) {
            throw new RuntimeException("Student does not belong to current parent");
        }

        HealthEvent event = healthEventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventSignup signup = new EventSignup();
        signup.setEvent(event);
        signup.setStudent(student);
        signup.setSignupDate(LocalDateTime.now());
        signup.setStatus("pending");

        return mapToResponse(eventSignupRepository.save(signup));
    }

    @Override
    public List<EventSignupResponse> getMySignups() {
        User parent = userUtilService.getCurrentUser();
        List<Students> children = studentRepository.findByParent(parent);

        return eventSignupRepository.findByStudentIn(children).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventSignupResponse> getSignupsByEvent(Long eventId) {
        HealthEvent event = healthEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return eventSignupRepository.findByEvent(event).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatus(Long signupId, String status) {
        EventSignup signup = eventSignupRepository.findById(signupId)
                .orElseThrow(() -> new RuntimeException("Signup not found"));

        signup.setStatus(status);
        eventSignupRepository.save(signup);
    }

    private EventSignupResponse mapToResponse(EventSignup signup) {
        return EventSignupResponse.builder()
                .signupId(signup.getSignupId())
                .eventId(signup.getEvent().getEventId())
                .eventTitle(signup.getEvent().getTitle())
                .studentId(signup.getStudent().getStudentId())
                .studentName(signup.getStudent().getFullName())
                .status(signup.getStatus())
                .signupDate(signup.getSignupDate())
                .build();
    }
}
