package com.company.placement.scoring;

import com.company.placement.assignment.Assignment;
import com.company.placement.question.Question;
import com.company.placement.scoring.dto.DailyHeatmapDto;
import com.company.placement.scoring.dto.LeaderboardEntryDto;
import com.company.placement.scoring.dto.StudentScoringOverviewDto;
import com.company.placement.submission.SubmissionRepository;
import com.company.placement.submission.SubmissionVerdict;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfile;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScoringServiceTest {

    @Mock
    private DailyActivityRepository dailyActivityRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @InjectMocks
    private ScoringServiceImpl scoringService;

    private User testUser;
    private Question testQuestion;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("student@test.com")
                .fullName("Test Student")
                .role(Role.STUDENT)
                .build();
        testUser.setId(UUID.randomUUID());

        testQuestion = Question.builder()
                .title("Two Sum")
                .build();
        testQuestion.setId(UUID.randomUUID());
    }

    @Test
    void testProcessSubmissionScoring_FirstAccepted_StartsStreakAndAddsScore() {
        LocalDate today = LocalDate.now(ScoringServiceImpl.ASIA_KOLKATA);

        when(dailyActivityRepository.findByUserIdAndActivityDate(testUser.getId(), today))
                .thenReturn(Optional.empty());
        when(studentProfileRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.empty());
        when(submissionRepository.existsByUserIdAndQuestionIdAndVerdict(
                testUser.getId(), testQuestion.getId(), SubmissionVerdict.ACCEPTED))
                .thenReturn(false);

        scoringService.processSubmissionScoring(testUser, testQuestion, null, true, 20);

        ArgumentCaptor<StudentProfile> profileCaptor = ArgumentCaptor.forClass(StudentProfile.class);
        verify(studentProfileRepository).save(profileCaptor.capture());
        StudentProfile savedProfile = profileCaptor.getValue();

        assertThat(savedProfile.getTotalScore()).isEqualTo(20);
        assertThat(savedProfile.getProblemsSolved()).isEqualTo(1);
        assertThat(savedProfile.getCurrentStreak()).isEqualTo(1);
        assertThat(savedProfile.getLongestStreak()).isEqualTo(1);
        assertThat(savedProfile.getLastActiveDate()).isEqualTo(today);

        ArgumentCaptor<DailyActivity> actCaptor = ArgumentCaptor.forClass(DailyActivity.class);
        verify(dailyActivityRepository).save(actCaptor.capture());
        DailyActivity savedActivity = actCaptor.getValue();
        assertThat(savedActivity.getPointsEarned()).isEqualTo(20);
        assertThat(savedActivity.getProblemsSolvedCount()).isEqualTo(1);
        assertThat(savedActivity.getSubmissionsCount()).isEqualTo(1);
    }

    @Test
    void testProcessSubmissionScoring_ConsecutiveDay_IncrementsStreak() {
        LocalDate today = LocalDate.now(ScoringServiceImpl.ASIA_KOLKATA);
        LocalDate yesterday = today.minusDays(1);

        StudentProfile existingProfile = StudentProfile.builder()
                .user(testUser)
                .totalScore(100)
                .problemsSolved(5)
                .currentStreak(3)
                .longestStreak(3)
                .lastActiveDate(yesterday)
                .build();

        when(dailyActivityRepository.findByUserIdAndActivityDate(testUser.getId(), today))
                .thenReturn(Optional.empty());
        when(studentProfileRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.of(existingProfile));
        when(submissionRepository.existsByUserIdAndQuestionIdAndVerdict(
                testUser.getId(), testQuestion.getId(), SubmissionVerdict.ACCEPTED))
                .thenReturn(false);

        scoringService.processSubmissionScoring(testUser, testQuestion, null, true, 10);

        assertThat(existingProfile.getCurrentStreak()).isEqualTo(4);
        assertThat(existingProfile.getLongestStreak()).isEqualTo(4);
        assertThat(existingProfile.getLastActiveDate()).isEqualTo(today);
        assertThat(existingProfile.getTotalScore()).isEqualTo(110);
    }

    @Test
    void testProcessSubmissionScoring_GapInDays_ResetsStreakToOne() {
        LocalDate today = LocalDate.now(ScoringServiceImpl.ASIA_KOLKATA);
        LocalDate threeDaysAgo = today.minusDays(3);

        StudentProfile existingProfile = StudentProfile.builder()
                .user(testUser)
                .totalScore(100)
                .problemsSolved(5)
                .currentStreak(5)
                .longestStreak(5)
                .lastActiveDate(threeDaysAgo)
                .build();

        when(dailyActivityRepository.findByUserIdAndActivityDate(testUser.getId(), today))
                .thenReturn(Optional.empty());
        when(studentProfileRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.of(existingProfile));
        when(submissionRepository.existsByUserIdAndQuestionIdAndVerdict(
                testUser.getId(), testQuestion.getId(), SubmissionVerdict.ACCEPTED))
                .thenReturn(false);

        scoringService.processSubmissionScoring(testUser, testQuestion, null, true, 10);

        assertThat(existingProfile.getCurrentStreak()).isEqualTo(1);
        assertThat(existingProfile.getLongestStreak()).isEqualTo(5); // Retains highest historical streak
        assertThat(existingProfile.getLastActiveDate()).isEqualTo(today);
    }

    @Test
    void testGetHeatmap_ReturnsRequestedContiguousDayCount() {
        LocalDate today = LocalDate.now(ScoringServiceImpl.ASIA_KOLKATA);
        DailyActivity activeDay = DailyActivity.builder()
                .user(testUser)
                .activityDate(today)
                .submissionsCount(7)
                .problemsSolvedCount(2)
                .pointsEarned(30)
                .build();

        when(dailyActivityRepository.findAllByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
                eq(testUser.getId()), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(activeDay));

        List<DailyHeatmapDto> heatmap = scoringService.getHeatmap(testUser.getId(), 30);

        assertThat(heatmap).hasSize(30);
        DailyHeatmapDto lastEntry = heatmap.get(heatmap.size() - 1);
        assertThat(lastEntry.getDate()).isEqualTo(today);
        assertThat(lastEntry.getCount()).isEqualTo(7);
        assertThat(lastEntry.getLevel()).isEqualTo(3); // 6-9 submissions is level 3
    }

    @Test
    void testGetGlobalLeaderboard_MapsRanksCorrectly() {
        StudentProfile p1 = StudentProfile.builder()
                .user(testUser)
                .totalScore(350)
                .problemsSolved(15)
                .currentStreak(5)
                .longestStreak(10)
                .build();

        PageRequest pageRequest = PageRequest.of(0, 10);
        when(studentProfileRepository.findAllByOrderByTotalScoreDescProblemsSolvedDescLongestStreakDesc(pageRequest))
                .thenReturn(new PageImpl<>(List.of(p1), pageRequest, 1));

        Page<LeaderboardEntryDto> leaderboard = scoringService.getGlobalLeaderboard(pageRequest);

        assertThat(leaderboard.getContent()).hasSize(1);
        LeaderboardEntryDto entry = leaderboard.getContent().get(0);
        assertThat(entry.getRank()).isEqualTo(1L);
        assertThat(entry.getTotalScore()).isEqualTo(350);
        assertThat(entry.getProblemsSolved()).isEqualTo(15);
    }
}
