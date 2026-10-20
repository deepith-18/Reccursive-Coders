package com.company.placement.submission;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.submission.dto.RunCodeRequest;
import com.company.placement.submission.dto.RunCodeResponse;
import com.company.placement.submission.dto.SubmissionDetailResponse;
import com.company.placement.submission.dto.SubmissionSummaryResponse;
import com.company.placement.submission.dto.SubmitCodeRequest;
import com.company.placement.submission.dto.SubmitCodeResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SubmissionService {

    RunCodeResponse runCode(RunCodeRequest request, UserPrincipal principal, HttpServletRequest httpRequest);

    SubmitCodeResponse submitCode(SubmitCodeRequest request, UserPrincipal principal, HttpServletRequest httpRequest);

    Page<SubmissionSummaryResponse> getMySubmissions(UUID questionId, UserPrincipal principal, Pageable pageable);

    SubmissionDetailResponse getSubmissionById(UUID submissionId, UserPrincipal principal);

    List<SubmissionSummaryResponse> getSubmissionsByQuestion(UUID questionId, UserPrincipal principal);

    List<SubmissionSummaryResponse> getSubmissionsByAssignment(UUID assignmentId, UserPrincipal principal);
}
