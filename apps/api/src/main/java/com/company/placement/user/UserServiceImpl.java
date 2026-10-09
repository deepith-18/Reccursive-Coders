package com.company.placement.user;

import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.user.dto.BulkUploadResult;
import com.company.placement.user.dto.CreateUserRequest;
import com.company.placement.user.dto.UserResponse;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final String DEFAULT_TEMP_PASSWORD = "Welcome@2026!";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);

        if (userRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "User already exists with email: " + request.getEmail());
        }

        String rawPassword = (request.getTemporaryPassword() != null && !request.getTemporaryPassword().isBlank())
                ? request.getTemporaryPassword()
                : DEFAULT_TEMP_PASSWORD;

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .fullName(request.getFullName().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .role(request.getRole())
                .status(UserStatus.ACTIVE)
                .forcePasswordChange(true)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.record(
                actorId,
                actorEmail,
                "USER_CREATED",
                "USER",
                savedUser.getId().toString(),
                String.format("Created user %s with role %s", savedUser.getEmail(), savedUser.getRole()),
                clientIp
        );

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public BulkUploadResult bulkUploadStudents(MultipartFile file, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Uploaded CSV file is empty");
        }

        String clientIp = getClientIp(httpRequest);
        List<String> errors = new ArrayList<>();
        List<UserResponse> createdUsers = new ArrayList<>();
        int rowNumber = 1;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext();
            if (header == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CSV", "CSV file contains no headers");
            }

            // Expected headers: fullName, email, phone (case-insensitive)
            int fullNameIdx = -1, emailIdx = -1, phoneIdx = -1;
            for (int i = 0; i < header.length; i++) {
                String col = header[i].trim().toLowerCase();
                if (col.contains("name")) fullNameIdx = i;
                else if (col.contains("email")) emailIdx = i;
                else if (col.contains("phone") || col.contains("mobile")) phoneIdx = i;
            }

            if (fullNameIdx == -1 || emailIdx == -1) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CSV_HEADERS", "CSV must contain 'fullName' and 'email' headers");
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (line.length == 0 || (line.length == 1 && line[0].trim().isEmpty())) {
                    continue; // Skip blank lines
                }

                String fullName = (fullNameIdx < line.length) ? line[fullNameIdx].trim() : "";
                String email = (emailIdx < line.length) ? line[emailIdx].trim().toLowerCase() : "";
                String phone = (phoneIdx != -1 && phoneIdx < line.length) ? line[phoneIdx].trim() : null;

                if (fullName.isEmpty()) {
                    errors.add(String.format("Row %d: Missing full name", rowNumber));
                    continue;
                }

                if (email.isEmpty() || !email.contains("@")) {
                    errors.add(String.format("Row %d: Invalid email address '%s'", rowNumber, email));
                    continue;
                }

                if (userRepository.existsByEmailIgnoreCase(email)) {
                    errors.add(String.format("Row %d: Email '%s' already exists", rowNumber, email));
                    continue;
                }

                User student = User.builder()
                        .email(email)
                        .fullName(fullName)
                        .phone(phone)
                        .role(Role.STUDENT)
                        .status(UserStatus.ACTIVE)
                        .forcePasswordChange(true)
                        .passwordHash(passwordEncoder.encode(DEFAULT_TEMP_PASSWORD))
                        .build();

                User saved = userRepository.save(student);
                createdUsers.add(mapToUserResponse(saved));
            }

        } catch (CsvValidationException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CSV_FORMAT_ERROR", "Error validating CSV formatting: " + e.getMessage());
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CSV_IMPORT_FAILED", "Failed to process CSV: " + e.getMessage());
        }

        auditLogService.record(
                actorId,
                actorEmail,
                "BULK_USERS_IMPORTED",
                "USER",
                null,
                String.format("Bulk uploaded %d students successfully with %d errors", createdUsers.size(), errors.size()),
                clientIp
        );

        return BulkUploadResult.builder()
                .totalProcessed(rowNumber - 1)
                .totalSuccess(createdUsers.size())
                .totalFailed(errors.size())
                .errors(errors)
                .createdUsers(createdUsers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(Role role, UserStatus status, String query, Pageable pageable) {
        String searchQuery = (query != null && !query.isBlank()) ? query.trim() : null;
        return userRepository.searchUsers(role, status, searchQuery, pageable)
                .map(this::mapToUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .forcePasswordChange(user.isForcePasswordChange())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
