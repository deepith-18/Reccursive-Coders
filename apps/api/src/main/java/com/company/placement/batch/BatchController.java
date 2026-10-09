package com.company.placement.batch;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.batch.dto.AssignTrainerRequest;
import com.company.placement.batch.dto.BatchResponse;
import com.company.placement.batch.dto.BatchStudentResponse;
import com.company.placement.batch.dto.CreateBatchRequest;
import com.company.placement.batch.dto.EnrollStudentsRequest;
import com.company.placement.batch.dto.UpdateBatchRequest;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/batches")
@RequiredArgsConstructor
@Tag(name = "Batch Management", description = "Training cohorts, trainer assignments, and student enrollment")
public class BatchController {

    private final BatchService batchService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new training batch (ADMIN only)")
    public ResponseEntity<ApiResponse<BatchResponse>> createBatch(
            @Valid @RequestBody CreateBatchRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        BatchResponse created = batchService.createBatch(request, actorId, actorEmail, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Batch created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "List batches with status and trainer filters")
    public ResponseEntity<ApiResponse<Page<BatchResponse>>> getBatches(
            @RequestParam(required = false) BatchStatus status,
            @RequestParam(required = false) UUID trainerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<BatchResponse> batches = batchService.getBatches(status, trainerId, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Batches retrieved successfully", batches));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'STUDENT')")
    @Operation(summary = "Get batch overview and metrics by ID")
    public ResponseEntity<ApiResponse<BatchResponse>> getBatchById(@PathVariable UUID id) {
        BatchResponse batch = batchService.getBatchById(id);
        return ResponseEntity.ok(ApiResponse.ok("Batch details retrieved", batch));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update batch details (ADMIN only)")
    public ResponseEntity<ApiResponse<BatchResponse>> updateBatch(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBatchRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        BatchResponse updated = batchService.updateBatch(id, request, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Batch updated successfully", updated));
    }

    @PostMapping("/{id}/trainer")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign or reassign trainer to cohort (ADMIN only)")
    public ResponseEntity<ApiResponse<BatchResponse>> assignTrainer(
            @PathVariable UUID id,
            @Valid @RequestBody AssignTrainerRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        BatchResponse updated = batchService.assignTrainer(id, request.getTrainerId(), actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Trainer assigned successfully", updated));
    }

    @PostMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Enroll students into cohort")
    public ResponseEntity<ApiResponse<Void>> enrollStudents(
            @PathVariable UUID id,
            @Valid @RequestBody EnrollStudentsRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        batchService.enrollStudents(id, request.getStudentIds(), actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Students enrolled successfully", null));
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Remove student enrollment from cohort")
    public ResponseEntity<ApiResponse<Void>> removeStudent(
            @PathVariable UUID id,
            @PathVariable UUID studentId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        batchService.removeStudent(id, studentId, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Student enrollment removed", null));
    }

    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Get list of enrolled students in batch")
    public ResponseEntity<ApiResponse<Page<BatchStudentResponse>>> getEnrolledStudents(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BatchStudentResponse> students = batchService.getEnrolledStudents(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Enrolled students retrieved", students));
    }

    @GetMapping("/my-batch")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's active enrolled batch")
    public ResponseEntity<ApiResponse<BatchResponse>> getMyActiveBatch(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        }
        BatchResponse batch = batchService.getActiveBatchForStudent(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(batch != null ? "Active batch retrieved" : "No active batch", batch));
    }
}
