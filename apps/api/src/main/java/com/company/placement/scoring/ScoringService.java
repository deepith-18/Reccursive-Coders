package com.company.placement.scoring;

import com.company.placement.assignment.Assignment;
import com.company.placement.question.Question;
import com.company.placement.scoring.dto.DailyHeatmapDto;
import com.company.placement.scoring.dto.LeaderboardEntryDto;
import com.company.placement.scoring.dto.StudentScoringOverviewDto;
import com.company.placement.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ScoringService {

    void processSubmissionScoring(User user, Question question, Assignment assignment, boolean isAccepted, int pointsAwarded);

    List<DailyHeatmapDto> getHeatmap(UUID userId, int days);

    Page<LeaderboardEntryDto> getGlobalLeaderboard(Pageable pageable);

    List<LeaderboardEntryDto> getBatchLeaderboard(UUID batchId);

    StudentScoringOverviewDto getStudentScoringOverview(UUID userId);
}
