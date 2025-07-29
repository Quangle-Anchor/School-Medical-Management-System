package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import com.be_source.School_Medical_Management_System_.enums.SignupStatus;
import com.be_source.School_Medical_Management_System_.request.EventSignupRequest;
import com.be_source.School_Medical_Management_System_.response.EventSignupResponse;
import com.be_source.School_Medical_Management_System_.model.*;
import com.be_source.School_Medical_Management_System_.repository.*;
import com.be_source.School_Medical_Management_System_.service.EventSignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

        // ✅ Kiểm tra trạng thái xác nhận
        if (student.getConfirmationStatus() != ConfirmationStatus.confirmed) {
            throw new RuntimeException("Student information is not confirmed by school. Please update before registering.");
        }

        HealthEvent event = healthEventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (eventSignupRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("Student already signed up for this event");
        }

        EventSignup signup = new EventSignup();
        signup.setEvent(event);
        signup.setStudent(student);
        signup.setSignupDate(LocalDateTime.now());
        signup.setStatus(SignupStatus.PENDING);

        return mapToResponse(eventSignupRepository.save(signup));
    }



    @Override
    public List<EventSignupResponse> getMySignups() {
        User parent = userUtilService.getCurrentUser();
        List<Students> children = studentRepository.findByParent(parent);

        Sort sort = Sort.by(Sort.Direction.DESC, "signupDate");

        return eventSignupRepository.findByStudentIn(children, sort).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<EventSignupResponse> getSignupsByEvent(Long eventId) {
        HealthEvent event = healthEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Sort sort = Sort.by(Sort.Direction.DESC, "signupDate");

        return eventSignupRepository.findByEvent(event, sort).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public void updateStatus(Long signupId, String status) {
        EventSignup signup = eventSignupRepository.findById(signupId)
                .orElseThrow(() -> new RuntimeException("Signup not found"));

        try {
            SignupStatus newStatus = SignupStatus.valueOf(status.toUpperCase());
            signup.setStatus(newStatus);
            eventSignupRepository.save(signup);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value. Use: PENDING, APPROVED, REJECTED");
        }
    }

    @Override
    public void approveAllSignups(Long eventId) {
        HealthEvent event = healthEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Thêm Sort theo ngày đăng ký giảm dần (nếu cần)
        Sort sort = Sort.by(Sort.Direction.DESC, "signupDate");
        List<EventSignup> signups = eventSignupRepository.findByEvent(event, sort);

        if (signups.isEmpty()) {
            throw new RuntimeException("No signups found for this event");
        }

        signups.forEach(signup -> signup.setStatus(SignupStatus.APPROVED));
        eventSignupRepository.saveAll(signups);
    }


    private EventSignupResponse mapToResponse(EventSignup signup) {
        return EventSignupResponse.builder()
                .signupId(signup.getSignupId())
                .eventId(signup.getEvent().getEventId())
                .eventTitle(signup.getEvent().getTitle())
                .studentId(signup.getStudent().getStudentId())
                .studentName(signup.getStudent().getFullName())
                .status(signup.getStatus().name())
                .signupDate(signup.getSignupDate())
                .build();
    }
}
