package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.be_source.School_Medical_Management_System_.model.Notification;
import com.be_source.School_Medical_Management_System_.repository.NotificationRepository;
import com.be_source.School_Medical_Management_System_.response.HealthInfoResponse;
import com.be_source.School_Medical_Management_System_.response.StudentResponse;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.repository.StudentRepository;
import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private NotificationRepository notificationRepository;


    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserUtilService userUtilService;

    @Override
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable)
                .map(this::toDto);
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Students student = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));
        return toDto(student);
    }

    @Override
    public List<StudentResponse> getStudentsByCurrentParent() {
        User currentUser = userUtilService.getCurrentUser();
        return studentRepository.findByParent(currentUser).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse createStudent(StudentResponse dto) {
        Students student = toEntity(dto);
        student.setStudentId(null);
        student.setParent(userUtilService.getCurrentUser());
        student.setIsConfirm(false); // mặc định là false khi tạo
        return toDto(studentRepository.save(student));
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentResponse dto) {
        Students existing = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));

        existing.setFullName(dto.getFullName());
        existing.setDateOfBirth(dto.getDateOfBirth());
        existing.setClassName(dto.getClassName());
        existing.setGender(dto.getGender());
        existing.setBloodType(dto.getBloodType());
        existing.setHeightCm(dto.getHeightCm());
        existing.setWeightKg(dto.getWeightKg());
        existing.setHealthStatus(dto.getHealthStatus());

        // Có thể cho phép cập nhật lại confirm nếu cần
        if (dto.getIsConfirm() != null) {
            existing.setIsConfirm(dto.getIsConfirm());
        }

        return toDto(studentRepository.save(existing));
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public StudentResponse getStudentByCode(String studentCode) {
        Students student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new NoSuchElementException("Student not found with code: " + studentCode));
        return toDto(student);
    }

    @Override
    public List<StudentResponse> searchStudentsByCode(String keyword) {
        return studentRepository.findByStudentCodeContainingIgnoreCase(keyword).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse confirmStudent(Long studentId) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));

        student.setIsConfirm(true);
        Students savedStudent = studentRepository.save(student);

        // Gửi thông báo xác nhận thông tin học sinh
        User currentUser = userUtilService.getCurrentUser(); // Người xác nhận (y tá)
        User parent = student.getParent();                   // Phụ huynh của học sinh

        Notification notification = new Notification();
        notification.setTitle("Xác nhận thông tin học sinh");
        notification.setContent("Thông tin của học sinh '" + student.getFullName() + "' đã được xác nhận bởi y tế nhà trường.");
        notification.setCreatedBy(currentUser);
        notification.setUser(parent); // Gửi thông báo cho phụ huynh
        notification.setNotificationType("STUDENT_CONFIRMED");
        notification.setCreatedAt(ZonedDateTime.now());
        notification.setReadStatus(false);
        notification.setEmailSent(false);

        notificationRepository.save(notification);

        return toDto(savedStudent);
    }


    @Override
    public void rejectStudentByNurse(Long studentId, String reason) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found"));

        User currentUser = userUtilService.getCurrentUser(); // Người thực hiện (nurse)
        User parent = student.getParent(); // Phụ huynh

        // Gửi notification cho phụ huynh
        Notification notification = new Notification();
        notification.setTitle("Thông tin học sinh chưa được chấp nhận");
        notification.setContent("Thông tin của học sinh '" + student.getFullName() +
                "' chưa được chấp nhận với lý do: " + reason +
                ". Vui lòng cập nhật lại thông tin hoặc tạo mới. Nếu không, học sinh sẽ không thể sử dụng các dịch vụ y tế trên hệ thống.");
        notification.setCreatedBy(currentUser);
        notification.setUser(parent);
        notification.setNotificationType("STUDENT_UNCONFIRMED");
        notification.setCreatedAt(ZonedDateTime.now());
        notification.setReadStatus(false);
        notification.setEmailSent(false);

        notificationRepository.save(notification);
    }


    // ============================ Mapping ============================

    private StudentResponse toDto(Students s) {
        StudentResponse dto = new StudentResponse();
        dto.setStudentId(s.getStudentId());
        dto.setStudentCode(s.getStudentCode());
        dto.setFullName(s.getFullName());
        dto.setDateOfBirth(s.getDateOfBirth());
        dto.setClassName(s.getClassName());
        dto.setGender(s.getGender());
        dto.setBloodType(s.getBloodType());
        dto.setHeightCm(s.getHeightCm());
        dto.setWeightKg(s.getWeightKg());
        dto.setHealthStatus(s.getHealthStatus());
        dto.setUpdatedAt(s.getUpdatedAt());
        dto.setIsConfirm(s.getIsConfirm());

        if (s.getHealthInfoList() != null) {
            List<HealthInfoResponse> healthDtos = s.getHealthInfoList().stream().map(hi -> {
                HealthInfoResponse h = new HealthInfoResponse();
                h.setHealthInfoId(hi.getHealthInfoId());
                h.setMedicalConditions(hi.getMedicalConditions());
                h.setAllergies(hi.getAllergies());
                h.setNotes(hi.getNotes());
                h.setUpdatedAt(hi.getUpdatedAt());
                return h;
            }).collect(Collectors.toList());
            dto.setHealthInfoList(healthDtos);
        }

        return dto;
    }

    private Students toEntity(StudentResponse dto) {
        Students s = new Students();
        s.setStudentId(dto.getStudentId());
        s.setFullName(dto.getFullName());
        s.setDateOfBirth(dto.getDateOfBirth());
        s.setClassName(dto.getClassName());
        s.setGender(dto.getGender());
        s.setBloodType(dto.getBloodType());
        s.setHeightCm(dto.getHeightCm());
        s.setWeightKg(dto.getWeightKg());
        s.setHealthStatus(dto.getHealthStatus());
        s.setIsConfirm(dto.getIsConfirm() != null ? dto.getIsConfirm() : false);
        return s;
    }
}

