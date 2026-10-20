package com.company.placement.scoring;

import com.company.placement.common.utils.ApiResponse;
import com.company.placement.scoring.dto.LeaderboardEntryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leaderboards")
@RequiredArgsConstructor
@Tag(name = "Leaderboards", description = "Global and batch rankings with Asia/Kolkata streaks")
public class LeaderboardController {

    private final ScoringService scoringService;

    @GetMapping("/global")
    @Operation(summary = "Get global leaderboard ranked by score, problems solved, and streaks")
    public ResponseEntity<ApiResponse<Page<LeaderboardEntryDto>>> getGlobalLeaderboard(
            @PageableDefault(size = 50, sort = "totalScore", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<LeaderboardEntryDto> leaderboard = scoringService.getGlobalLeaderboard(pageable);
        return ResponseEntity.ok(ApiResponse.ok(leaderboard));
    }

    @GetMapping("/batch/{batchId}")
    @Operation(summary = "Get cohort batch leaderboard ranked by score, problems solved, and streaks")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getBatchLeaderboard(
            @PathVariable UUID batchId) {
        List<LeaderboardEntryDto> leaderboard = scoringService.getBatchLeaderboard(batchId);
        return ResponseEntity.ok(ApiResponse.ok(leaderboard));
    }
}
