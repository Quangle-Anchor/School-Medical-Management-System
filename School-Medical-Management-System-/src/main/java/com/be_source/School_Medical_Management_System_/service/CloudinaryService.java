package com.be_source.School_Medical_Management_System_.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }
    public void deleteFileByUrl(String fileUrl) {
        try {
            // Cloudinary public_id là phần sau cloudinary.com/<cloud_name>/image/upload/
            // VD: https://res.cloudinary.com/demo/image/upload/v1716999999/abc_xyz.pdf
            // → publicId = abc_xyz (không có extension)

            URI uri = new URI(fileUrl);
            String[] parts = uri.getPath().split("/");
            String publicIdWithExt = parts[parts.length - 1];  // abc_xyz.pdf

            String publicId = publicIdWithExt.contains(".")
                    ? publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'))
                    : publicIdWithExt;

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

}
