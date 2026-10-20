package com.company.placement.assessment;

import com.company.placement.assessment.dto.*;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.notification.NotificationService;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionRepository;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private AssessmentAttemptRepository attemptRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AssessmentServiceImpl assessmentService;

    private User admin;
    private User student;
    private Assessment assessment;
    private AssessmentAttempt attempt;
    private Question question;

    @BeforeEach
    void setUp() {
        admin = User.builder()
                .email("admin@test.com")
                .fullName("Admin User")
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
        admin.setId(UUID.randomUUID());

        student = User.builder()
                .email("student@test.com")
                .fullName("Student User")
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
        student.setId(UUID.randomUUID());

        question = Question.builder()
                .title("Two Sum")
                .slug("two-sum")
                .description("Find two numbers")
                .difficulty(QuestionDifficulty.EASY)
                .build();
        question.setId(UUID.randomUUID());

        assessment = Assessment.builder()
                .title("Amazon SDE-1 Mock Contest")
                .description("Mock placement contest")
                .companyTag("Amazon")
                .type(AssessmentType.MOCK_DRIVE)
                .status(AssessmentStatus.ACTIVE)
                .proctoringLevel(ProctoringLevel.STRICT)
                .durationMinutes(60)
                .maxViolationsAllowed(3)
                .passingScore(60)
                .totalPoints(100)
                .createdBy(admin)
                .questions(new ArrayList<>())
                .attempts(new ArrayList<>())
                .build();
        assessment.setId(UUID.randomUUID());

        attempt = AssessmentAttempt.builder()
                .assessment(assessment)
                .student(student)
                .startedAt(Instant.now())
                .status(AttemptStatus.IN_PROGRESS)
                .score(0)
                .tabSwitchCount(0)
                .copyPasteCount(0)
                .build();
        attempt.setId(UUID.randomUUID());
    }

    @Test
    void testCreateAssessment() {
        CreateAssessmentRequest req = CreateAssessmentRequest.builder()
                .title("Amazon SDE-1 Mock Contest")
                .description("Mock test")
                .companyTag("Amazon")
                .type(AssessmentType.MOCK_DRIVE)
                .durationMinutes(90)
                .proctoringLevel(ProctoringLevel.STRICT)
                .maxViolationsAllowed(3)
                .questions(List.of(
                        CreateAssessmentRequest.AssessmentQuestionItem.builder()
                                .questionId(question.getId())
                                .points(50)
                                .build()
                ))
                .build();

        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(invocation -> {
            Assessment a = invocation.getArgument(0);
            a.setId(UUID.randomUUID());
            return a;
        });

        UserPrincipal principal = UserPrincipal.create(admin);
        AssessmentSummaryDto summary = assessmentService.createAssessment(req, principal);

        assertThat(summary).isNotNull();
        assertThat(summary.getTitle()).isEqualTo("Amazon SDE-1 Mock Contest");
        assertThat(summary.getDurationMinutes()).isEqualTo(90);
        assertThat(summary.getProctoringLevel()).isEqualTo(ProctoringLevel.STRICT);
    }

    @Test
    void testStartAssessment() {
        when(assessmentRepository.findById(assessment.getId())).thenReturn(Optional.of(assessment));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(attemptRepository.findByAssessmentIdAndStudentId(assessment.getId(), student.getId()))
                .thenReturn(Optional.empty());
        when(attemptRepository.save(any(AssessmentAttempt.class))).thenReturn(attempt);

        UserPrincipal principal = UserPrincipal.create(student);
        StartAssessmentResponse response = assessmentService.startAssessment(assessment.getId(), principal);

        assertThat(response).isNotNull();
        assertThat(response.getAttemptId()).isEqualTo(attempt.getId());
        assertThat(response.getStatus()).isEqualTo(AttemptStatus.IN_PROGRESS);
        assertThat(response.getRemainingSeconds()).isGreaterThan(0L);
    }

    @Test
    void testRecordViolation_UnderLimit() {
        when(assessmentRepository.findById(assessment.getId())).thenReturn(Optional.of(assessment));
        when(attemptRepository.findByAssessmentIdAndStudentId(assessment.getId(), student.getId()))
                .thenReturn(Optional.of(attempt));
        when(attemptRepository.save(any(AssessmentAttempt.class))).thenReturn(attempt);

        RecordViolationRequest req = RecordViolationRequest.builder()
                .violationType("TAB_SWITCH")
                .details("Switched to Chrome DevTools")
                .build();

        UserPrincipal principal = UserPrincipal.create(student);
        RecordViolationResponse response = assessmentService.recordViolation(assessment.getId(), req, principal);

        assertThat(response.getTabSwitchCount()).isEqualTo(1);
        assertThat(response.isDisqualified()).isFalse();
        assertThat(response.getStatus()).isEqualTo(AttemptStatus.IN_PROGRESS);
    }

    @Test
    void testRecordViolation_ExceedsLimitDisqualifies() {
        attempt.setTabSwitchCount(2); // One more will trigger max 3 violations!
        when(assessmentRepository.findById(assessment.getId())).thenReturn(Optional.of(assessment));
        when(attemptRepository.findByAssessmentIdAndStudentId(assessment.getId(), student.getId()))
                .thenReturn(Optional.of(attempt));
        when(attemptRepository.save(any(AssessmentAttempt.class))).thenReturn(attempt);

        RecordViolationRequest req = RecordViolationRequest.builder()
                .violationType("TAB_SWITCH")
                .details("Switched browser window")
                .build();

        UserPrincipal principal = UserPrincipal.create(student);
        RecordViolationResponse response = assessmentService.recordViolation(assessment.getId(), req, principal);

        assertThat(response.getTabSwitchCount()).isEqualTo(3);
        assertThat(response.isDisqualified()).isTrue();
        assertThat(response.getStatus()).isEqualTo(AttemptStatus.DISQUALIFIED);
        assertThat(attempt.getStatus()).isEqualTo(AttemptStatus.DISQUALIFIED);
    }

    @Test
    void testSubmitAssessment() {
        when(assessmentRepository.findByIdWithQuestions(assessment.getId())).thenReturn(Optional.of(assessment));
        when(attemptRepository.findByAssessmentIdAndStudentId(assessment.getId(), student.getId()))
                .thenReturn(Optional.of(attempt));
        when(attemptRepository.save(any(AssessmentAttempt.class))).thenReturn(attempt);

        SubmitAssessmentRequest req = SubmitAssessmentRequest.builder()
                .earnedScore(85)
                .feedbackNotes("Clean code test")
                .build();

        UserPrincipal principal = UserPrincipal.create(student);
        AssessmentDetailDto result = assessmentService.submitAssessment(assessment.getId(), req, principal);

        assertThat(result).isNotNull();
        assertThat(attempt.getStatus()).isEqualTo(AttemptStatus.SUBMITTED);
        assertThat(attempt.getScore()).isEqualTo(85);
    }

    @Test
    void testGetLeaderboard() {
        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setScore(95);
        attempt.setSubmittedAt(Instant.now());

        when(attemptRepository.findLeaderboardByAssessmentId(assessment.getId()))
                .thenReturn(List.of(attempt));

        List<AssessmentLeaderboardEntryDto> leaderboard = assessmentService.getLeaderboard(assessment.getId());

        assertThat(leaderboard).hasSize(1);
        assertThat(leaderboard.get(0).getRank()).isEqualTo(1);
        assertThat(leaderboard.get(0).getStudentName()).isEqualTo("Student User");
        assertThat(leaderboard.get(0).getScore()).isEqualTo(95);
    }
}
