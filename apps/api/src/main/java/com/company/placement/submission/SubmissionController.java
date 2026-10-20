package com.company.placement.submission;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.utils.ApiResponse;
import com.company.placement.submission.dto.RunCodeRequest;
import com.company.placement.submission.dto.RunCodeResponse;
import com.company.placement.submission.dto.SubmissionDetailResponse;
import com.company.placement.submission.dto.SubmissionSummaryResponse;
import com.company.placement.submission.dto.SubmitCodeRequest;
import com.company.placement.submission.dto.SubmitCodeResponse;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
@Tag(name = "Code Execution & Submissions", description = "Judge0 sandbox execution, Run vs Submit evaluation, and verdicts")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/run")
    @Operation(summary = "Run code against sample test cases or custom input (Instant feedback without score)")
    public ResponseEntity<ApiResponse<RunCodeResponse>> runCode(
            @Valid @RequestBody RunCodeRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        RunCodeResponse response = submissionService.runCode(request, principal, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Code executed successfully", response));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit code evaluation against full test suite (Computes final verdict & score)")
    public ResponseEntity<ApiResponse<SubmitCodeResponse>> submitCode(
            @Valid @RequestBody SubmitCodeRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        SubmitCodeResponse response = submissionService.submitCode(request, principal, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Code submitted successfully", response));
    }

    @GetMapping("/my-submissions")
    @Operation(summary = "Get user's personal submission history (Authenticated)")
    public ResponseEntity<ApiResponse<Page<SubmissionSummaryResponse>>> getMySubmissions(
            @RequestParam(required = false) UUID questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<SubmissionSummaryResponse> result = submissionService.getMySubmissions(questionId, principal, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed submission report with per-test-case verdicts")
    public ResponseEntity<ApiResponse<SubmissionDetailResponse>> getSubmissionById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SubmissionDetailResponse response = submissionService.getSubmissionById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Submission details retrieved successfully", response));
    }

    @GetMapping("/question/{questionId}")
    @Operation(summary = "Get recent submissions for a specific question")
    public ResponseEntity<ApiResponse<List<SubmissionSummaryResponse>>> getSubmissionsByQuestion(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<SubmissionSummaryResponse> response = submissionService.getSubmissionsByQuestion(questionId, principal);
        return ResponseEntity.ok(ApiResponse.ok("Question submissions retrieved successfully", response));
    }

    @GetMapping("/assignment/{assignmentId}")
    @Operation(summary = "Get submissions for a specific assignment")
    public ResponseEntity<ApiResponse<List<SubmissionSummaryResponse>>> getSubmissionsByAssignment(
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<SubmissionSummaryResponse> response = submissionService.getSubmissionsByAssignment(assignmentId, principal);
        return ResponseEntity.ok(ApiResponse.ok("Assignment submissions retrieved successfully", response));
    }
}
