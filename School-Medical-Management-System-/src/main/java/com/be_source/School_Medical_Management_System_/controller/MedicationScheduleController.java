package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.MedicationScheduleRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationScheduleResponse;
import com.be_source.School_Medical_Management_System_.service.MedicationScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class MedicationScheduleController {

    private final MedicationScheduleService scheduleService;


    @GetMapping("/nurse/all")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<List<MedicationScheduleResponse>> getAllForNurse() {
        return ResponseEntity.ok(scheduleService.getAllForNurse());
    }


    @GetMapping("/my-students")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<MedicationScheduleResponse>> getSchedulesForCurrentParent() {
        return ResponseEntity.ok(scheduleService.getForCurrentParentStudents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<MedicationScheduleResponse> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<MedicationScheduleResponse> create(@RequestBody MedicationScheduleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleService.create(request));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<MedicationScheduleResponse> update(@PathVariable Long id,
                                                             @RequestBody MedicationScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.update(id, request));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
