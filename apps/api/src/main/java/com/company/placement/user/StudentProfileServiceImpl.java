package com.company.placement.user;

import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UpdateProfileRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentProfileServiceImpl implements StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.upload.dir:uploads/resumes}")
    private String uploadDir;

    @Override
    @Transactional
    public StudentProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    StudentProfile initial = StudentProfile.builder()
                            .user(user)
                            .skills("[]")
                            .build();
                    return studentProfileRepository.save(initial);
                });

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public StudentProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> StudentProfile.builder().user(user).build());

        if (request.getDegree() != null) profile.setDegree(request.getDegree().trim());
        if (request.getBranch() != null) profile.setBranch(request.getBranch().trim());
        if (request.getCollege() != null) profile.setCollege(request.getCollege().trim());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());
        if (request.getCgpa() != null) profile.setCgpa(request.getCgpa());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl().trim());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl().trim());

        if (request.getSkills() != null) {
            try {
                profile.setSkills(objectMapper.writeValueAsString(request.getSkills()));
            } catch (Exception e) {
                profile.setSkills(String.join(",", request.getSkills()));
            }
        }

        StudentProfile updated = studentProfileRepository.save(profile);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public StudentProfileResponse uploadResume(UUID userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Uploaded file is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".pdf") && !originalFilename.toLowerCase().endsWith(".docx"))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE", "Only PDF and DOCX files are allowed");
        }

        // 5MB max
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE", "Resume file must not exceed 5MB");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        try {
            Path storageDirectory = Paths.get(uploadDir);
            Files.createDirectories(storageDirectory);

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFileName = "resume_" + userId + "_" + System.currentTimeMillis() + extension;
            Path targetLocation = storageDirectory.resolve(storedFileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            StudentProfile profile = studentProfileRepository.findByUserId(userId)
                    .orElseGet(() -> StudentProfile.builder().user(user).build());

            profile.setResumeFileName(originalFilename);
            profile.setResumeFilePath(targetLocation.toString());

            StudentProfile saved = studentProfileRepository.save(savedProfile(profile));
            return mapToResponse(saved);

        } catch (IOException e) {
            log.error("Failed to store resume for user {}", userId, e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "STORAGE_ERROR", "Could not upload resume file");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource getResume(UUID userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile", "userId", userId));

        if (profile.getResumeFilePath() == null || profile.getResumeFilePath().isBlank()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "RESUME_NOT_FOUND", "No resume document uploaded for this student");
        }

        try {
            Path filePath = Paths.get(profile.getResumeFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ApiException(HttpStatus.NOT_FOUND, "FILE_NOT_FOUND", "Resume file not found on disk");
            }
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_ERROR", "Error retrieving resume document");
        }
    }

    private StudentProfile savedProfile(StudentProfile profile) {
        return profile;
    }

    private StudentProfileResponse mapToResponse(StudentProfile profile) {
        List<String> skillsList = parseSkills(profile.getSkills());
        return StudentProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .degree(profile.getDegree())
                .branch(profile.getBranch())
                .college(profile.getCollege())
                .graduationYear(profile.getGraduationYear())
                .cgpa(profile.getCgpa())
                .skills(skillsList)
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeFileName(profile.getResumeFileName())
                .hasResume(profile.getResumeFilePath() != null && !profile.getResumeFilePath().isBlank())
                .completionPercentage(calculateCompleteness(profile, skillsList))
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(skillsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Arrays.stream(skillsJson.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
    }

    private int calculateCompleteness(StudentProfile p, List<String> skills) {
        int score = 0;
        if (p.getDegree() != null && !p.getDegree().isBlank()) score += 15;
        if (p.getBranch() != null && !p.getBranch().isBlank()) score += 10;
        if (p.getCollege() != null && !p.getCollege().isBlank()) score += 15;
        if (p.getGraduationYear() != null) score += 10;
        if (p.getCgpa() != null) score += 15;
        if (skills != null && !skills.isEmpty()) score += 15;
        if (p.getGithubUrl() != null && !p.getGithubUrl().isBlank()) score += 10;
        if (p.getResumeFilePath() != null && !p.getResumeFilePath().isBlank()) score += 10;
        return Math.min(100, score);
    }
}
