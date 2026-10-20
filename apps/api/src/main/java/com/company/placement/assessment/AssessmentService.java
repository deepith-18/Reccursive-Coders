package com.company.placement.assessment;

import com.company.placement.assessment.dto.*;
import com.company.placement.auth.UserPrincipal;

import java.util.List;
import java.util.UUID;

public interface AssessmentService {

    AssessmentSummaryDto createAssessment(CreateAssessmentRequest request, UserPrincipal creator);

    List<AssessmentSummaryDto> listAssessments(AssessmentStatus status, UserPrincipal principal);

    AssessmentDetailDto getAssessmentDetails(UUID assessmentId, UserPrincipal principal);

    StartAssessmentResponse startAssessment(UUID assessmentId, UserPrincipal student);

    RecordViolationResponse recordViolation(UUID assessmentId, RecordViolationRequest request, UserPrincipal student);

    AssessmentDetailDto submitAssessment(UUID assessmentId, SubmitAssessmentRequest request, UserPrincipal student);

    List<AssessmentLeaderboardEntryDto> getLeaderboard(UUID assessmentId);

    List<AssessmentRosterEntryDto> getRoster(UUID assessmentId, UserPrincipal principal);

    List<AssessmentSummaryDto> getMyAttempts(UserPrincipal student);
}
