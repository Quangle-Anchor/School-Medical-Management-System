package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.request.MedicationRequestRequest;
import com.be_source.School_Medical_Management_System_.response.MedicationRequestResponse;
import com.be_source.School_Medical_Management_System_.service.MedicationRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationRequestController {

    @Autowired
    private MedicationRequestService medicationRequestService;

    @Value("${medication.upload.prescription.path}")
    private String prescriptionUploadPath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/my")
    public ResponseEntity<List<MedicationRequestResponse>> getMyRequests() {
        return ResponseEntity.ok(medicationRequestService.getMyRequests());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createMedicationRequest(
            @RequestPart("medicationRequest") String medicationRequestJson,
            @RequestPart(value = "prescriptionFile", required = false) MultipartFile prescriptionFile) {
        try {
            MedicationRequestRequest request = objectMapper.readValue(medicationRequestJson, MedicationRequestRequest.class);
            medicationRequestService.create(request, prescriptionFile);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request data: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMedicationRequest(
            @PathVariable Long id,
            @RequestPart("medicationRequest") String medicationRequestJson,
            @RequestPart(value = "prescriptionFile", required = false) MultipartFile prescriptionFile) {
        try {
            MedicationRequestRequest request = objectMapper.readValue(medicationRequestJson, MedicationRequestRequest.class);
            MedicationRequestResponse updated = medicationRequestService.update(id, request, prescriptionFile);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        medicationRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<List<MedicationRequestResponse>> getHistoryByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(medicationRequestService.getHistoryByStudent(studentId));
    }

    @GetMapping("/nurse/pending")
    public ResponseEntity<List<MedicationRequestResponse>> getUnconfirmedRequests() {
        return ResponseEntity.ok(medicationRequestService.getUnconfirmedRequests());
    }

    @PutMapping("/nurse/confirm/{id}")
    public ResponseEntity<?> confirmRequest(@PathVariable Long id) {
        medicationRequestService.confirmRequest(id);
        return ResponseEntity.ok("Request confirmed successfully.");
    }

    @GetMapping("/prescription/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path currentDir = Paths.get(System.getProperty("user.dir"));
            Path uploadDir = currentDir.resolve("src/main/resources/static").resolve(prescriptionUploadPath);
            Path file = uploadDir.resolve(filename);
            
            Resource resource = null;
            String actualFilename = filename;
            
            // First try the exact filename
            if (java.nio.file.Files.exists(file)) {
                resource = new UrlResource(file.toUri());
            } else {
                // If file doesn't exist, try common extensions
                String[] extensions = {".jpg", ".jpeg", ".png", ".pdf", ".gif", ".bmp"};
                for (String ext : extensions) {
                    Path fileWithExt = uploadDir.resolve(filename + ext);
                    if (java.nio.file.Files.exists(fileWithExt)) {
                        resource = new UrlResource(fileWithExt.toUri());
                        actualFilename = filename + ext;
                        break;
                    }
                }
            }
            
            if (resource != null && resource.exists() && resource.isReadable()) {
                // Determine content type for inline viewing
                String contentType = "application/octet-stream";
                if (actualFilename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (actualFilename.toLowerCase().endsWith(".jpg") || actualFilename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (actualFilename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (actualFilename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (actualFilename.toLowerCase().endsWith(".bmp")) {
                    contentType = "image/bmp";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + actualFilename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/prescription/list")
    public ResponseEntity<?> listPrescriptionFiles() {
        try {
            Path currentDir = Paths.get(System.getProperty("user.dir"));
            Path uploadDir = currentDir.resolve("src/main/resources/static").resolve(prescriptionUploadPath);
            
            if (!java.nio.file.Files.exists(uploadDir)) {
                return ResponseEntity.ok("Upload directory does not exist: " + uploadDir);
            }
            
            java.util.List<String> files = java.nio.file.Files.list(uploadDir)
                    .map(path -> path.getFileName().toString())
                    .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(java.util.Map.of(
                "uploadDirectory", uploadDir.toString(),
                "files", files,
                "totalFiles", files.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error listing files: " + e.getMessage());
        }
    }
}
