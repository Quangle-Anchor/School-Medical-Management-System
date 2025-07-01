package com.be_source.School_Medical_Management_System_.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthInfoResponse {
    private Long healthInfoId;

    // ✅ Dùng student object để lấy studentId (dùng khi create/update)
    private StudentResponse student;

    // Hoặc bạn có thể giữ cả studentId nếu chỉ muốn gửi ID riêng (không bắt buộc)
    private Long studentId;

    private String medicalConditions;
    private String allergies;
    private String notes;
    private LocalDateTime updatedAt;
}
