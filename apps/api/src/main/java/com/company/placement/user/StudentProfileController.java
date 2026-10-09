package com.company.placement.user;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.utils.ApiResponse;
import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UpdateProfileRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student Profiles", description = "Academic credentials, placement portfolio, and resume uploads")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student profile and completion progress")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        StudentProfileResponse profile = studentProfileService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update current student academic credentials and skills")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        if (principal == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        StudentProfileResponse profile = studentProfileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    @PostMapping(value = "/profile/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Upload student resume document (PDF or DOCX max 5MB)")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> uploadResume(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestPart("file") MultipartFile file
    ) {
        if (principal == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        StudentProfileResponse profile = studentProfileService.uploadResume(principal.getId(), file);
        return ResponseEntity.ok(ApiResponse.ok("Resume uploaded successfully", profile));
    }

    @GetMapping("/profile/resume")
    @PreAuthorize("hasAnyRole('STUDENT', 'TRAINER', 'ADMIN')")
    @Operation(summary = "Download current student resume file")
    public ResponseEntity<Resource> getMyResume(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        Resource file = studentProfileService.getResume(principal.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    @GetMapping("/{studentId}/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "View candidate student profile (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentProfile(
            @PathVariable UUID studentId
    ) {
        StudentProfileResponse profile = studentProfileService.getProfile(studentId);
        return ResponseEntity.ok(ApiResponse.ok("Candidate profile retrieved", profile));
    }
}
