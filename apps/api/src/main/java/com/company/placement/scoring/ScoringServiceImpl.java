package com.company.placement.scoring;

import com.company.placement.assignment.Assignment;
import com.company.placement.question.Question;
import com.company.placement.scoring.dto.DailyHeatmapDto;
import com.company.placement.scoring.dto.LeaderboardEntryDto;
import com.company.placement.scoring.dto.StudentScoringOverviewDto;
import com.company.placement.submission.SubmissionRepository;
import com.company.placement.submission.SubmissionVerdict;
import com.company.placement.user.StudentProfile;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoringServiceImpl implements ScoringService {

    public static final ZoneId ASIA_KOLKATA = ZoneId.of("Asia/Kolkata");

    private final DailyActivityRepository dailyActivityRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    @Transactional
    public void processSubmissionScoring(User user, Question question, Assignment assignment, boolean isAccepted, int pointsAwarded) {
        LocalDate today = LocalDate.now(ASIA_KOLKATA);

        // 1. Retrieve or initialize today's daily activity
        DailyActivity activity = dailyActivityRepository.findByUserIdAndActivityDate(user.getId(), today)
                .orElseGet(() -> DailyActivity.builder()
                        .user(user)
                        .activityDate(today)
                        .problemsSolvedCount(0)
                        .submissionsCount(0)
                        .pointsEarned(0)
                        .build());

        activity.setSubmissionsCount(activity.getSubmissionsCount() + 1);

        // 2. Retrieve or initialize student profile
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> StudentProfile.builder()
                        .user(user)
                        .totalScore(0)
                        .problemsSolved(0)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        if (isAccepted) {
            // Check if this user had already solved this question prior to this submission
            boolean alreadySolved = submissionRepository.existsByUserIdAndQuestionIdAndVerdict(
                    user.getId(), question.getId(), SubmissionVerdict.ACCEPTED);

            if (!alreadySolved) {
                activity.setProblemsSolvedCount(activity.getProblemsSolvedCount() + 1);
                activity.setPointsEarned(activity.getPointsEarned() + pointsAwarded);

                profile.setProblemsSolved(profile.getProblemsSolved() + 1);
                profile.setTotalScore(profile.getTotalScore() + pointsAwarded);
            }

            // Update streak on accepted solve
            updateStreak(profile, today);
        }

        dailyActivityRepository.save(activity);
        studentProfileRepository.save(profile);
        log.info("Updated scoring & streak for user {} (today: {}, solved: {}, totalScore: {}, streak: {})",
                user.getEmail(), today, profile.getProblemsSolved(), profile.getTotalScore(), profile.getCurrentStreak());
    }

    private void updateStreak(StudentProfile profile, LocalDate today) {
        LocalDate lastActive = profile.getLastActiveDate();
        int currentStreak = profile.getCurrentStreak();
        int longestStreak = profile.getLongestStreak();

        if (lastActive == null) {
            currentStreak = 1;
        } else if (lastActive.equals(today)) {
            // Already active today; retain existing streak
        } else if (lastActive.equals(today.minusDays(1))) {
            // Consecutive day in Asia/Kolkata
            currentStreak += 1;
        } else {
            // Streak broken (gap of 2 or more calendar days)
            currentStreak = 1;
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        profile.setCurrentStreak(currentStreak);
        profile.setLongestStreak(longestStreak);
        profile.setLastActiveDate(today);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyHeatmapDto> getHeatmap(UUID userId, int days) {
        if (days <= 0 || days > 365) {
            days = 365;
        }

        LocalDate endDate = LocalDate.now(ASIA_KOLKATA);
        LocalDate startDate = endDate.minusDays(days - 1);

        List<DailyActivity> activities = dailyActivityRepository
                .findAllByUserIdAndActivityDateBetweenOrderByActivityDateAsc(userId, startDate, endDate);

        Map<LocalDate, DailyActivity> activityMap = activities.stream()
                .collect(Collectors.toMap(DailyActivity::getActivityDate, a -> a));

        List<DailyHeatmapDto> result = new ArrayList<>();
        LocalDate cur = startDate;
        while (!cur.isAfter(endDate)) {
            DailyActivity da = activityMap.get(cur);
            int count = (da != null) ? da.getSubmissionsCount() : 0;
            int solved = (da != null) ? da.getProblemsSolvedCount() : 0;
            int points = (da != null) ? da.getPointsEarned() : 0;

            int level = 0;
            if (count >= 10) level = 4;
            else if (count >= 6) level = 3;
            else if (count >= 3) level = 2;
            else if (count >= 1) level = 1;

            result.add(DailyHeatmapDto.builder()
                    .date(cur)
                    .count(count)
                    .problemsSolved(solved)
                    .pointsEarned(points)
                    .level(level)
                    .build());

            cur = cur.plusDays(1);
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeaderboardEntryDto> getGlobalLeaderboard(Pageable pageable) {
        Page<StudentProfile> profiles = studentProfileRepository
                .findAllByOrderByTotalScoreDescProblemsSolvedDescLongestStreakDesc(pageable);

        long startRank = pageable.getOffset() + 1;
        List<LeaderboardEntryDto> dtos = new ArrayList<>();

        for (int i = 0; i < profiles.getContent().size(); i++) {
            StudentProfile sp = profiles.getContent().get(i);
            dtos.add(mapToLeaderboardEntry(sp, startRank + i));
        }

        return new PageImpl<>(dtos, pageable, profiles.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getBatchLeaderboard(UUID batchId) {
        List<StudentProfile> profiles = studentProfileRepository.findBatchLeaderboard(batchId);
        List<LeaderboardEntryDto> dtos = new ArrayList<>();

        for (int i = 0; i < profiles.size(); i++) {
            dtos.add(mapToLeaderboardEntry(profiles.get(i), i + 1));
        }

        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentScoringOverviewDto getStudentScoringOverview(UUID userId) {
        LocalDate today = LocalDate.now(ASIA_KOLKATA);

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            return StudentScoringOverviewDto.builder()
                    .globalRank(0)
                    .totalScore(0)
                    .problemsSolved(0)
                    .currentStreak(0)
                    .longestStreak(0)
                    .lastActiveDate(null)
                    .build();
        }

        long rank = studentProfileRepository.calculateGlobalRank(profile.getTotalScore(), profile.getProblemsSolved());

        // Check if streak has decayed (i.e. more than 1 day has passed without activity)
        int effectiveCurrentStreak = profile.getCurrentStreak();
        if (profile.getLastActiveDate() != null && profile.getLastActiveDate().isBefore(today.minusDays(1))) {
            effectiveCurrentStreak = 0;
        }

        return StudentScoringOverviewDto.builder()
                .globalRank(rank)
                .totalScore(profile.getTotalScore())
                .problemsSolved(profile.getProblemsSolved())
                .currentStreak(effectiveCurrentStreak)
                .longestStreak(profile.getLongestStreak())
                .lastActiveDate(profile.getLastActiveDate())
                .build();
    }

    private LeaderboardEntryDto mapToLeaderboardEntry(StudentProfile sp, long rank) {
        User u = sp.getUser();
        return LeaderboardEntryDto.builder()
                .rank(rank)
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .college(sp.getCollege())
                .graduationYear(sp.getGraduationYear())
                .totalScore(sp.getTotalScore())
                .problemsSolved(sp.getProblemsSolved())
                .currentStreak(sp.getCurrentStreak())
                .longestStreak(sp.getLongestStreak())
                .build();
    }
}
