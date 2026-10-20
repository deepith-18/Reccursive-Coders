package com.company.placement.assessment;

import com.company.placement.assessment.dto.*;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
@Tag(name = "Assessments & Contests", description = "Timed mock placement tests, coding contests, and anti-cheat proctoring engine")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Create a new mock assessment or timed contest")
    public ResponseEntity<ApiResponse<AssessmentSummaryDto>> createAssessment(
            @Valid @RequestBody CreateAssessmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssessmentSummaryDto response = assessmentService.createAssessment(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Assessment created successfully", response));
    }

    @GetMapping
    @Operation(summary = "List all assessments with optional status filter")
    public ResponseEntity<ApiResponse<List<AssessmentSummaryDto>>> listAssessments(
            @RequestParam(required = false) AssessmentStatus status,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssessmentSummaryDto> list = assessmentService.listAssessments(status, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assessments retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed assessment metadata and question roster")
    public ResponseEntity<ApiResponse<AssessmentDetailDto>> getAssessmentDetails(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssessmentDetailDto details = assessmentService.getAssessmentDetails(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assessment details retrieved", details));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Start student assessment attempt and initialize proctored session")
    public ResponseEntity<ApiResponse<StartAssessmentResponse>> startAssessment(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        StartAssessmentResponse response = assessmentService.startAssessment(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assessment session started", response));
    }

    @PostMapping("/{id}/violations")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Audit proctoring violation (tab switch, copy-paste, window blur)")
    public ResponseEntity<ApiResponse<RecordViolationResponse>> recordViolation(
            @PathVariable UUID id,
            @Valid @RequestBody RecordViolationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        RecordViolationResponse response = assessmentService.recordViolation(id, request, principal);
        return ResponseEntity.ok(ApiResponse.ok("Proctoring violation audited", response));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Final submission of student assessment attempt")
    public ResponseEntity<ApiResponse<AssessmentDetailDto>> submitAssessment(
            @PathVariable UUID id,
            @Valid @RequestBody SubmitAssessmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssessmentDetailDto result = assessmentService.submitAssessment(id, request, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assessment submitted successfully", result));
    }

    @GetMapping("/{id}/leaderboard")
    @Operation(summary = "Get live leaderboard for a contest or mock assessment")
    public ResponseEntity<ApiResponse<List<AssessmentLeaderboardEntryDto>>> getLeaderboard(
            @PathVariable UUID id
    ) {
        List<AssessmentLeaderboardEntryDto> leaderboard = assessmentService.getLeaderboard(id);
        return ResponseEntity.ok(ApiResponse.ok("Assessment leaderboard retrieved", leaderboard));
    }

    @GetMapping("/{id}/roster")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Trainer / Admin view of candidate attempts and proctoring violations")
    public ResponseEntity<ApiResponse<List<AssessmentRosterEntryDto>>> getRoster(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssessmentRosterEntryDto> roster = assessmentService.getRoster(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assessment candidate roster retrieved", roster));
    }

    @GetMapping("/my-attempts")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "List current student assessment history and scorecards")
    public ResponseEntity<ApiResponse<List<AssessmentSummaryDto>>> getMyAttempts(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssessmentSummaryDto> attempts = assessmentService.getMyAttempts(principal);
        return ResponseEntity.ok(ApiResponse.ok("Student assessment history retrieved", attempts));
    }
}
