package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.NotificationRequest;
import com.be_source.School_Medical_Management_System_.response.NotificationResponse;
import com.be_source.School_Medical_Management_System_.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody NotificationRequest request) {
        notificationService.createNotification(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody NotificationRequest request) {
        notificationService.updateNotification(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        Sort sortObj = Sort.by(Sort.Order.by(sort[0]));
        if (sort.length > 1 && "desc".equalsIgnoreCase(sort[1])) {
            sortObj = sortObj.descending();
        }
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<NotificationResponse>> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        Sort sortObj = Sort.by(Sort.Order.by(sort[0]));
        if (sort.length > 1 && "desc".equalsIgnoreCase(sort[1])) {
            sortObj = sortObj.descending();
        }
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return ResponseEntity.ok(notificationService.getNotificationsForCurrentUser(pageable));
    }

}
