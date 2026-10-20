package com.company.placement.placement;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.utils.ApiResponse;
import com.company.placement.placement.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/placements")
@RequiredArgsConstructor
@Tag(name = "Placement Drives", description = "Recruitment drives, company job posts, eligibility criteria, and candidate applications")
public class PlacementController {

    private final PlacementService placementService;

    @GetMapping("/drives")
    @Operation(summary = "List all placement drives with search and filter tabs")
    public ResponseEntity<ApiResponse<Page<PlacementDriveResponse>>> getAllDrives(
            @RequestParam(required = false) DriveStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "applicationDeadline"));
        Page<PlacementDriveResponse> response = placementService.getAllDrives(status, search, pageable, principal);
        return ResponseEntity.ok(ApiResponse.ok("Placement drives retrieved successfully", response));
    }

    @GetMapping("/drives/{id}")
    @Operation(summary = "Get placement drive details by ID")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> getDriveById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PlacementDriveResponse response = placementService.getDriveById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Placement drive details retrieved", response));
    }

    @PostMapping("/drives")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Create a new placement recruitment drive (ADMIN / TRAINER)")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> createDrive(
            @Valid @RequestBody CreatePlacementDriveRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PlacementDriveResponse response = placementService.createDrive(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Placement drive created successfully", response));
    }

    @PutMapping("/drives/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Update an existing placement drive")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> updateDrive(
            @PathVariable UUID id,
            @Valid @RequestBody CreatePlacementDriveRequest request
    ) {
        PlacementDriveResponse response = placementService.updateDrive(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Placement drive updated successfully", response));
    }

    @PostMapping("/drives/{id}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply to a placement drive (STUDENT)")
    public ResponseEntity<ApiResponse<PlacementApplicationResponse>> applyToDrive(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PlacementApplicationResponse response = placementService.applyToDrive(id, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully", response));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "View current student's placement applications and hiring pipeline")
    public ResponseEntity<ApiResponse<List<PlacementApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<PlacementApplicationResponse> response = placementService.getMyApplications(principal);
        return ResponseEntity.ok(ApiResponse.ok("Student applications retrieved", response));
    }

    @GetMapping("/drives/{id}/applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Review applicant roster for a drive (ADMIN / TRAINER)")
    public ResponseEntity<ApiResponse<Page<PlacementApplicationResponse>>> getDriveApplications(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<PlacementApplicationResponse> response = placementService.getDriveApplications(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Drive applications retrieved", response));
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Update student application hiring status & interview scheduling")
    public ResponseEntity<ApiResponse<PlacementApplicationResponse>> updateApplicationStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        PlacementApplicationResponse response = placementService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated successfully", response));
    }
}
