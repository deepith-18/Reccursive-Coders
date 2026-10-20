package com.company.placement.question;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.utils.ApiResponse;
import com.company.placement.question.dto.CreateQuestionRequest;
import com.company.placement.question.dto.CreateTestCaseRequest;
import com.company.placement.question.dto.QuestionResponse;
import com.company.placement.question.dto.QuestionSummaryResponse;
import com.company.placement.question.dto.TestCaseDto;
import com.company.placement.question.dto.UpdateQuestionRequest;
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
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
@Tag(name = "Question Management", description = "Coding problem statements, markdown editor, and test case authoring")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Create a new coding question (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        QuestionResponse response = questionService.createQuestion(request, actorId, actorEmail, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Question created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Search and list questions with filters (Authenticated)")
    public ResponseEntity<ApiResponse<Page<QuestionSummaryResponse>>> listQuestions(
            @RequestParam(required = false) QuestionStatus status,
            @RequestParam(required = false) QuestionDifficulty difficulty,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        String sortProp = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProp));
        Page<QuestionSummaryResponse> result = questionService.searchQuestions(status, difficulty, tag, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Questions retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question by ID (Hidden test cases masked for students)")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        QuestionResponse response = questionService.getQuestionById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Question retrieved successfully", response));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get question by slug (Hidden test cases masked for students)")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionBySlug(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        QuestionResponse response = questionService.getQuestionBySlug(slug, principal);
        return ResponseEntity.ok(ApiResponse.ok("Question retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Update question metadata and description (ADMIN or author TRAINER)")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateQuestionRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        QuestionResponse response = questionService.updateQuestion(id, request, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Question updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Delete question (ADMIN or author TRAINER)")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        questionService.deleteQuestion(id, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Question deleted successfully", null));
    }

    @PostMapping("/{id}/test-cases")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Add a test case to a question (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<TestCaseDto>> addTestCase(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTestCaseRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        TestCaseDto response = questionService.addTestCase(id, request, actorId, actorEmail, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Test case added successfully", response));
    }

    @DeleteMapping("/{id}/test-cases/{testCaseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Delete a test case from a question (ADMIN or TRAINER)")
    public ResponseEntity<ApiResponse<Void>> deleteTestCase(
            @PathVariable UUID id,
            @PathVariable UUID testCaseId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        UUID actorId = principal != null ? principal.getId() : null;
        String actorEmail = principal != null ? principal.getEmail() : "system";

        questionService.deleteTestCase(id, testCaseId, actorId, actorEmail, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Test case deleted successfully", null));
    }
}
