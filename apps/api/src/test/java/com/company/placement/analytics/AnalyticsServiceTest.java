package com.company.placement.analytics;

import com.company.placement.analytics.dto.AnalyticsOverviewDto;
import com.company.placement.analytics.dto.TopicMasteryDto;
import com.company.placement.batch.BatchRepository;
import com.company.placement.batch.BatchStudentRepository;
import com.company.placement.execution.ProgrammingLanguage;
import com.company.placement.placement.PlacementDriveRepository;
import com.company.placement.question.QuestionRepository;
import com.company.placement.scoring.DailyActivityRepository;
import com.company.placement.submission.SubmissionRepository;
import com.company.placement.submission.SubmissionVerdict;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BatchRepository batchRepository;

    @Mock
    private BatchStudentRepository batchStudentRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private DailyActivityRepository dailyActivityRepository;

    @Mock
    private PlacementDriveRepository placementDriveRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    @Test
    void testGetOverview() {
        when(userRepository.countByRole(Role.STUDENT)).thenReturn(25L);
        when(userRepository.countByRole(Role.TRAINER)).thenReturn(3L);
        when(batchRepository.count()).thenReturn(2L);
        when(questionRepository.count()).thenReturn(15L);
        when(submissionRepository.count()).thenReturn(100L);
        when(submissionRepository.countByVerdict(SubmissionVerdict.ACCEPTED)).thenReturn(75L);
        when(dailyActivityRepository.countByActivityDate(any(LocalDate.class))).thenReturn(12L);
        when(placementDriveRepository.count()).thenReturn(4L);
        when(submissionRepository.countByLanguage(ProgrammingLanguage.PYTHON)).thenReturn(50L);
        when(submissionRepository.countByLanguage(ProgrammingLanguage.JAVA)).thenReturn(30L);
        when(submissionRepository.countByLanguage(ProgrammingLanguage.CPP)).thenReturn(20L);

        AnalyticsOverviewDto overview = analyticsService.getOverview();

        assertThat(overview).isNotNull();
        assertThat(overview.getTotalStudents()).isEqualTo(25L);
        assertThat(overview.getGlobalAcceptanceRate()).isEqualTo(75.0);
        assertThat(overview.getLanguageBreakdown()).containsEntry("PYTHON", 50L);
    }

    @Test
    void testGetWeakTopicsRadar() {
        when(submissionRepository.findAll()).thenReturn(List.of());
        when(questionRepository.findAll()).thenReturn(List.of());

        List<TopicMasteryDto> topics = analyticsService.getWeakTopicsRadar();

        assertThat(topics).isNotEmpty();
        // Dynamic Programming baseline should be labeled as NEEDS_ATTENTION (< 45%)
        TopicMasteryDto dp = topics.stream()
                .filter(t -> t.getCategory().contains("Dynamic Programming"))
                .findFirst()
                .orElse(null);

        assertThat(dp).isNotNull();
        assertThat(dp.getStatus()).isEqualTo("NEEDS_ATTENTION");
    }
}
