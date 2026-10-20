package com.company.placement.assessment;

import com.company.placement.assessment.dto.*;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.notification.NotificationService;
import com.company.placement.notification.NotificationType;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionRepository;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AssessmentSummaryDto createAssessment(CreateAssessmentRequest request, UserPrincipal creator) {
        User user = userRepository.findById(creator.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creator.getId()));

        int totalPoints = 0;
        List<AssessmentQuestion> assessmentQuestions = new ArrayList<>();

        Assessment assessment = Assessment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .companyTag(request.getCompanyTag())
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : AssessmentStatus.ACTIVE)
                .proctoringLevel(request.getProctoringLevel() != null ? request.getProctoringLevel() : ProctoringLevel.STRICT)
                .durationMinutes(request.getDurationMinutes())
                .maxViolationsAllowed(request.getMaxViolationsAllowed() != null ? request.getMaxViolationsAllowed() : 3)
                .passingScore(request.getPassingScore() != null ? request.getPassingScore() : 60)
                .startsAt(request.getStartsAt() != null ? request.getStartsAt() : Instant.now())
                .endsAt(request.getEndsAt() != null ? request.getEndsAt() : Instant.now().plus(Duration.ofDays(14)))
                .batchId(request.getBatchId())
                .createdBy(user)
                .build();

        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            int order = 1;
            for (CreateAssessmentRequest.AssessmentQuestionItem item : request.getQuestions()) {
                Question question = questionRepository.findById(item.getQuestionId())
                        .orElse(null);
                if (question != null) {
                    int pts = item.getPoints() != null ? item.getPoints() : 25;
                    totalPoints += pts;
                    AssessmentQuestion aq = AssessmentQuestion.builder()
                            .assessment(assessment)
                            .question(question)
                            .sectionName(item.getSectionName() != null ? item.getSectionName() : "Core Algorithms")
                            .points(pts)
                            .sortOrder(item.getSortOrder() != null ? item.getSortOrder() : order++)
                            .build();
                    assessmentQuestions.add(aq);
                }
            }
        }

        if (totalPoints == 0) {
            totalPoints = 100;
        }
        assessment.setTotalPoints(totalPoints);
        assessment.setQuestions(assessmentQuestions);

        Assessment saved = assessmentRepository.save(assessment);
        log.info("Created new assessment '{}' (ID: {}) by {}", saved.getTitle(), saved.getId(), creator.getEmail());

        return mapToSummary(saved, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentSummaryDto> listAssessments(AssessmentStatus status, UserPrincipal principal) {
        List<Assessment> assessments;
        if (principal.getRole() == Role.STUDENT) {
            assessments = assessmentRepository.findAllByOrderByCreatedAtDesc();
        } else {
            assessments = (status != null)
                    ? assessmentRepository.findByStatusOrderByCreatedAtDesc(status)
                    : assessmentRepository.findAllByOrderByCreatedAtDesc();
        }

        return assessments.stream()
                .map(a -> {
                    AssessmentAttempt attempt = attemptRepository.findByAssessmentIdAndStudentId(a.getId(), principal.getId()).orElse(null);
                    return mapToSummary(a, attempt);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentDetailDto getAssessmentDetails(UUID assessmentId, UserPrincipal principal) {
        Assessment assessment = assessmentRepository.findByIdWithQuestions(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        AssessmentAttempt attempt = attemptRepository.findByAssessmentIdAndStudentId(assessmentId, principal.getId()).orElse(null);

        List<AssessmentQuestionDto> questionDtos = assessment.getQuestions().stream()
                .map(aq -> {
                    Question q = aq.getQuestion();
                    return AssessmentQuestionDto.builder()
                            .id(aq.getId())
                            .questionId(q.getId())
                            .title(q.getTitle())
                            .slug(q.getSlug())
                            .description(q.getDescription())
                            .difficulty(q.getDifficulty())
                            .sectionName(aq.getSectionName())
                            .points(aq.getPoints())
                            .sortOrder(aq.getSortOrder())
                            .build();
                })
                .collect(Collectors.toList());

        Long remainingSeconds = null;
        if (attempt != null && attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            long elapsedSeconds = Duration.between(attempt.getStartedAt(), Instant.now()).getSeconds();
            long totalSeconds = assessment.getDurationMinutes() * 60L;
            remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
        }

        return AssessmentDetailDto.builder()
                .id(assessment.getId())
                .title(assessment.getTitle())
                .description(assessment.getDescription())
                .companyTag(assessment.getCompanyTag())
                .type(assessment.getType())
                .status(assessment.getStatus())
                .proctoringLevel(assessment.getProctoringLevel())
                .durationMinutes(assessment.getDurationMinutes())
                .maxViolationsAllowed(assessment.getMaxViolationsAllowed())
                .passingScore(assessment.getPassingScore())
                .totalPoints(assessment.getTotalPoints())
                .startsAt(assessment.getStartsAt())
                .endsAt(assessment.getEndsAt())
                .batchId(assessment.getBatchId())
                .questions(questionDtos)
                .myAttemptStatus(attempt != null ? attempt.getStatus() : AttemptStatus.NOT_STARTED)
                .myScore(attempt != null ? attempt.getScore() : null)
                .tabSwitchCount(attempt != null ? attempt.getTabSwitchCount() : 0)
                .copyPasteCount(attempt != null ? attempt.getCopyPasteCount() : 0)
                .remainingSeconds(remainingSeconds)
                .feedbackNotes(attempt != null ? attempt.getFeedbackNotes() : null)
                .build();
    }

    @Override
    @Transactional
    public StartAssessmentResponse startAssessment(UUID assessmentId, UserPrincipal studentPrincipal) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        User student = userRepository.findById(studentPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentPrincipal.getId()));

        AssessmentAttempt attempt = attemptRepository.findByAssessmentIdAndStudentId(assessmentId, studentPrincipal.getId())
                .orElseGet(() -> {
                    AssessmentAttempt newAttempt = AssessmentAttempt.builder()
                            .assessment(assessment)
                            .student(student)
                            .startedAt(Instant.now())
                            .status(AttemptStatus.IN_PROGRESS)
                            .score(0)
                            .tabSwitchCount(0)
                            .copyPasteCount(0)
                            .build();
                    return attemptRepository.save(newAttempt);
                });

        long elapsedSeconds = Duration.between(attempt.getStartedAt(), Instant.now()).getSeconds();
        long totalSeconds = assessment.getDurationMinutes() * 60L;
        long remaining = Math.max(0, totalSeconds - elapsedSeconds);

        if (remaining == 0 && attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            attempt.setStatus(AttemptStatus.AUTO_SUBMITTED);
            attempt.setSubmittedAt(Instant.now());
            attemptRepository.save(attempt);
        }

        return StartAssessmentResponse.builder()
                .attemptId(attempt.getId())
                .assessmentId(assessment.getId())
                .startedAt(attempt.getStartedAt())
                .remainingSeconds(remaining)
                .maxViolationsAllowed(assessment.getMaxViolationsAllowed())
                .status(attempt.getStatus())
                .build();
    }

    @Override
    @Transactional
    public RecordViolationResponse recordViolation(UUID assessmentId, RecordViolationRequest request, UserPrincipal student) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        AssessmentAttempt attempt = attemptRepository.findByAssessmentIdAndStudentId(assessmentId, student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "assessmentId", assessmentId));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            return RecordViolationResponse.builder()
                    .tabSwitchCount(attempt.getTabSwitchCount())
                    .copyPasteCount(attempt.getCopyPasteCount())
                    .maxViolationsAllowed(assessment.getMaxViolationsAllowed())
                    .isDisqualified(attempt.getStatus() == AttemptStatus.DISQUALIFIED)
                    .status(attempt.getStatus())
                    .warningMessage("Attempt is not in active progress")
                    .build();
        }

        if ("COPY_PASTE".equalsIgnoreCase(request.getViolationType())) {
            attempt.setCopyPasteCount(attempt.getCopyPasteCount() + 1);
        } else {
            attempt.setTabSwitchCount(attempt.getTabSwitchCount() + 1);
        }

        boolean disqualified = false;
        String warningMsg;

        if (assessment.getProctoringLevel() == ProctoringLevel.STRICT &&
                attempt.getTabSwitchCount() >= assessment.getMaxViolationsAllowed()) {
            attempt.setStatus(AttemptStatus.DISQUALIFIED);
            attempt.setSubmittedAt(Instant.now());
            attempt.setFeedbackNotes("Disqualified due to exceeding " + assessment.getMaxViolationsAllowed() + " tab switch violations.");
            disqualified = true;
            warningMsg = "ASSESSMENT DISQUALIFIED: You have exceeded the maximum allowed violations (" +
                    assessment.getMaxViolationsAllowed() + "). Your test has been terminated.";
            log.warn("Student {} disqualified on assessment {} due to {} violations",
                    student.getEmail(), assessment.getTitle(), attempt.getTabSwitchCount());
        } else {
            int strikesLeft = assessment.getMaxViolationsAllowed() - attempt.getTabSwitchCount();
            warningMsg = "Warning (" + attempt.getTabSwitchCount() + "/" + assessment.getMaxViolationsAllowed() +
                    "): Switching tabs is strictly monitored. " + strikesLeft + " strike(s) remaining before disqualification.";
        }

        attemptRepository.save(attempt);

        return RecordViolationResponse.builder()
                .tabSwitchCount(attempt.getTabSwitchCount())
                .copyPasteCount(attempt.getCopyPasteCount())
                .maxViolationsAllowed(assessment.getMaxViolationsAllowed())
                .isDisqualified(disqualified)
                .status(attempt.getStatus())
                .warningMessage(warningMsg)
                .build();
    }

    @Override
    @Transactional
    public AssessmentDetailDto submitAssessment(UUID assessmentId, SubmitAssessmentRequest request, UserPrincipal student) {
        Assessment assessment = assessmentRepository.findByIdWithQuestions(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        AssessmentAttempt attempt = attemptRepository.findByAssessmentIdAndStudentId(assessmentId, student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "assessmentId", assessmentId));

        if (attempt.getStatus() == AttemptStatus.DISQUALIFIED) {
            return getAssessmentDetails(assessmentId, student);
        }

        attempt.setSubmittedAt(Instant.now());
        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setScore(request.getEarnedScore() != null ? request.getEarnedScore() : 80);
        attempt.setFeedbackNotes(request.getFeedbackNotes() != null ? request.getFeedbackNotes() : "Completed test within allowed duration.");
        attemptRepository.save(attempt);

        try {
            notificationService.sendNotification(
                    student.getId(),
                    "Assessment Submitted: " + assessment.getTitle(),
                    "Congratulations! You scored " + attempt.getScore() + "/" + assessment.getTotalPoints() +
                            " on '" + assessment.getTitle() + "'. Review your scorecard now.",
                    NotificationType.ACHIEVEMENT,
                    "/student/assessments"
            );
        } catch (Exception e) {
            log.warn("Failed to dispatch assessment completion notification: {}", e.getMessage());
        }

        return getAssessmentDetails(assessmentId, student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentLeaderboardEntryDto> getLeaderboard(UUID assessmentId) {
        List<AssessmentAttempt> attempts = attemptRepository.findLeaderboardByAssessmentId(assessmentId);

        List<AssessmentLeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (AssessmentAttempt att : attempts) {
            Long timeTaken = 0L;
            if (att.getSubmittedAt() != null && att.getStartedAt() != null) {
                timeTaken = Duration.between(att.getStartedAt(), att.getSubmittedAt()).getSeconds();
            }

            result.add(AssessmentLeaderboardEntryDto.builder()
                    .rank(rank++)
                    .studentId(att.getStudent().getId())
                    .studentName(att.getStudent().getFullName())
                    .studentEmail(att.getStudent().getEmail())
                    .score(att.getScore())
                    .timeTakenSeconds(timeTaken)
                    .tabSwitchCount(att.getTabSwitchCount())
                    .status(att.getStatus())
                    .submittedAt(att.getSubmittedAt())
                    .build());
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentRosterEntryDto> getRoster(UUID assessmentId, UserPrincipal principal) {
        List<AssessmentAttempt> attempts = attemptRepository.findRosterByAssessmentId(assessmentId);

        return attempts.stream().map(att -> {
            Long timeTaken = 0L;
            if (att.getSubmittedAt() != null && att.getStartedAt() != null) {
                timeTaken = Duration.between(att.getStartedAt(), att.getSubmittedAt()).getSeconds();
            }
            return AssessmentRosterEntryDto.builder()
                    .attemptId(att.getId())
                    .studentId(att.getStudent().getId())
                    .studentName(att.getStudent().getFullName())
                    .studentEmail(att.getStudent().getEmail())
                    .status(att.getStatus())
                    .score(att.getScore())
                    .tabSwitchCount(att.getTabSwitchCount())
                    .copyPasteCount(att.getCopyPasteCount())
                    .startedAt(att.getStartedAt())
                    .submittedAt(att.getSubmittedAt())
                    .timeTakenSeconds(timeTaken)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentSummaryDto> getMyAttempts(UserPrincipal student) {
        List<AssessmentAttempt> attempts = attemptRepository.findByStudentIdOrderByStartedAtDesc(student.getId());
        return attempts.stream()
                .map(att -> mapToSummary(att.getAssessment(), att))
                .collect(Collectors.toList());
    }

    private AssessmentSummaryDto mapToSummary(Assessment assessment, AssessmentAttempt attempt) {
        return AssessmentSummaryDto.builder()
                .id(assessment.getId())
                .title(assessment.getTitle())
                .description(assessment.getDescription())
                .companyTag(assessment.getCompanyTag())
                .type(assessment.getType())
                .status(assessment.getStatus())
                .proctoringLevel(assessment.getProctoringLevel())
                .durationMinutes(assessment.getDurationMinutes())
                .maxViolationsAllowed(assessment.getMaxViolationsAllowed())
                .passingScore(assessment.getPassingScore())
                .totalPoints(assessment.getTotalPoints())
                .questionCount(assessment.getQuestions() != null ? assessment.getQuestions().size() : 0)
                .startsAt(assessment.getStartsAt())
                .endsAt(assessment.getEndsAt())
                .batchId(assessment.getBatchId())
                .createdByName(assessment.getCreatedBy() != null ? assessment.getCreatedBy().getFullName() : "Administrator")
                .myAttemptStatus(attempt != null ? attempt.getStatus() : AttemptStatus.NOT_STARTED)
                .myScore(attempt != null ? attempt.getScore() : null)
                .myStartedAt(attempt != null ? attempt.getStartedAt() : null)
                .mySubmittedAt(attempt != null ? attempt.getSubmittedAt() : null)
                .build();
    }
}
