package com.be_source.School_Medical_Management_System_.serviceImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

    public void deleteFileByUrl(String fileUrlOrPublicId) {
        try {
            String publicId;

            // Trường hợp là URL đầy đủ → trích xuất public_id
            if (fileUrlOrPublicId.startsWith("http://") || fileUrlOrPublicId.startsWith("https://")) {
                URL url = new URL(fileUrlOrPublicId);
                String decodedPath = URLDecoder.decode(url.getPath(), StandardCharsets.UTF_8);
                String[] pathParts = decodedPath.split("/upload/");
                if (pathParts.length < 2) {
                    throw new RuntimeException("Invalid Cloudinary file URL: " + fileUrlOrPublicId);
                }

                String filePath = pathParts[1]; // ví dụ: v123/folder/my file.jpg
                String[] subParts = filePath.split("/", 2);
                String potentialPath = subParts.length == 2 ? subParts[1] : subParts[0];
                publicId = potentialPath.replaceAll("\\.[^.]+$", "");
            } else {
                // Trường hợp là tên file như: abc_xyz.pdf → bỏ đuôi .pdf
                publicId = fileUrlOrPublicId.replaceAll("\\.[^.]+$", "");
            }

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

}
