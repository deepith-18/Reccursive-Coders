package com.company.placement.scoring;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.utils.ApiResponse;
import com.company.placement.scoring.dto.DailyHeatmapDto;
import com.company.placement.scoring.dto.StudentScoringOverviewDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/scoring")
@RequiredArgsConstructor
@Tag(name = "Scoring & Engagement", description = "Streaks, Asia/Kolkata activity heatmaps, and score overviews")
public class ScoringController {

    private final ScoringService scoringService;

    @GetMapping("/heatmap")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's daily activity heatmap for past N days (defaults to 365 days)")
    public ResponseEntity<ApiResponse<List<DailyHeatmapDto>>> getMyHeatmap(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(name = "days", defaultValue = "365") int days) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        }
        List<DailyHeatmapDto> heatmap = scoringService.getHeatmap(principal.getId(), days);
        return ResponseEntity.ok(ApiResponse.ok(heatmap));
    }

    @GetMapping("/heatmap/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Get candidate student's activity heatmap for past N days (trainers and admins)")
    public ResponseEntity<ApiResponse<List<DailyHeatmapDto>>> getStudentHeatmap(
            @PathVariable UUID studentId,
            @RequestParam(name = "days", defaultValue = "365") int days) {
        List<DailyHeatmapDto> heatmap = scoringService.getHeatmap(studentId, days);
        return ResponseEntity.ok(ApiResponse.ok(heatmap));
    }

    @GetMapping("/overview")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's scoring rank, solved count, and streak status")
    public ResponseEntity<ApiResponse<StudentScoringOverviewDto>> getMyScoringOverview(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        }
        StudentScoringOverviewDto overview = scoringService.getStudentScoringOverview(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(overview));
    }

    @GetMapping("/overview/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Get candidate student's scoring rank, solved count, and streak status")
    public ResponseEntity<ApiResponse<StudentScoringOverviewDto>> getStudentScoringOverview(
            @PathVariable UUID studentId) {
        StudentScoringOverviewDto overview = scoringService.getStudentScoringOverview(studentId);
        return ResponseEntity.ok(ApiResponse.ok(overview));
    }
}
