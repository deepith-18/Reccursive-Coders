package com.company.placement.assignment;

import com.company.placement.assignment.dto.AssignmentResponse;
import com.company.placement.assignment.dto.AssignmentSummaryResponse;
import com.company.placement.assignment.dto.CreateAssignmentRequest;
import com.company.placement.assignment.dto.UpdateAssignmentRequest;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
@Tag(name = "Assignment Management", description = "Batch assignments, questions selection, and deadlines")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Create an assignment for a cohort batch (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        AssignmentResponse response = assignmentService.createAssignment(request, actorId, actorEmail, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Assignment created successfully", response));
    }

    @GetMapping("/batch/{batchId}")
    @Operation(summary = "Get all assignments for a batch (Trainer/Admin or enrolled Student)")
    public ResponseEntity<ApiResponse<List<AssignmentSummaryResponse>>> getAssignmentsByBatch(
            @PathVariable UUID batchId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssignmentSummaryResponse> response = assignmentService.getAssignmentsByBatch(batchId, principal);
        return ResponseEntity.ok(ApiResponse.ok("Batch assignments retrieved successfully", response));
    }

    @GetMapping("/my-assignments")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get assignments for the authenticated student's enrolled cohorts")
    public ResponseEntity<ApiResponse<List<AssignmentSummaryResponse>>> getMyAssignments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssignmentSummaryResponse> response = assignmentService.getMyAssignments(principal);
        return ResponseEntity.ok(ApiResponse.ok("Personal assignments retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assignment details with attached questions (Trainer/Admin or enrolled Student)")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignmentById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssignmentResponse response = assignmentService.getAssignmentById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assignment details retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Update assignment information and questions (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        AssignmentResponse response = assignmentService.updateAssignment(id, request, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Assignment updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Delete an assignment (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        assignmentService.deleteAssignment(id, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Assignment deleted successfully", null));
    }
}
