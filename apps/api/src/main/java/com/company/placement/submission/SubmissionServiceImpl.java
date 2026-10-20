package com.company.placement.submission;

import com.company.placement.assignment.Assignment;
import com.company.placement.assignment.AssignmentQuestion;
import com.company.placement.assignment.AssignmentQuestionRepository;
import com.company.placement.assignment.AssignmentRepository;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.batch.BatchStudentRepository;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.execution.CodeExecutionResult;
import com.company.placement.execution.Judge0Client;
import com.company.placement.execution.Judge0Status;
import com.company.placement.execution.dto.Judge0SubmissionRequest;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionRepository;
import com.company.placement.question.TestCase;
import com.company.placement.submission.dto.RunCodeRequest;
import com.company.placement.submission.dto.RunCodeResponse;
import com.company.placement.submission.dto.SubmissionDetailResponse;
import com.company.placement.submission.dto.SubmissionSummaryResponse;
import com.company.placement.submission.dto.SubmitCodeRequest;
import com.company.placement.submission.dto.SubmitCodeResponse;
import com.company.placement.submission.dto.TestCaseRunResultDto;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionTestCaseResultRepository submissionTestCaseResultRepository;
    private final QuestionRepository questionRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final UserRepository userRepository;
    private final Judge0Client judge0Client;
    private final AuditLogService auditLogService;

    @Override
    public RunCodeResponse runCode(RunCodeRequest request, UserPrincipal principal, HttpServletRequest httpRequest) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", request.getQuestionId()));

        List<TestCaseRunResultDto> results = new ArrayList<>();
        boolean compileSuccess = true;
        String compileOutput = null;
        int passed = 0;

        if (request.getCustomInput() != null && !request.getCustomInput().isBlank()) {
            // Run against custom input
            Judge0SubmissionRequest jReq = Judge0SubmissionRequest.builder()
                    .sourceCode(request.getSourceCode())
                    .languageId(request.getLanguage().getJudge0Id())
                    .stdin(request.getCustomInput())
                    .cpuTimeLimit((float) (question.getTimeLimitMs() / 1000.0))
                    .memoryLimit(question.getMemoryLimitMb() * 1024)
                    .build();

            CodeExecutionResult execResult = judge0Client.execute(jReq);
            SubmissionVerdict verdict = mapJudge0StatusToVerdict(execResult.getStatus());

            if (verdict == SubmissionVerdict.COMPILATION_ERROR) {
                compileSuccess = false;
                compileOutput = execResult.getCompileOutput();
            }

            results.add(TestCaseRunResultDto.builder()
                    .testCaseNumber(1)
                    .isSample(true)
                    .status(verdict)
                    .input(request.getCustomInput())
                    .expectedOutput("(Custom Run)")
                    .actualOutput(execResult.getStdout())
                    .stderr(execResult.getStderr())
                    .executionTimeMs(execResult.getExecutionTimeMs())
                    .memoryKb(execResult.getMemoryKb())
                    .build());

            return RunCodeResponse.builder()
                    .overallVerdict(verdict)
                    .compileSuccess(compileSuccess)
                    .compileOutput(compileOutput)
                    .totalSampleCases(1)
                    .passedSampleCases(verdict == SubmissionVerdict.ACCEPTED ? 1 : 0)
                    .testCaseResults(results)
                    .build();
        }

        // Run against sample test cases
        List<TestCase> sampleCases = question.getTestCases() != null
                ? question.getTestCases().stream().filter(tc -> Boolean.TRUE.equals(tc.getIsSample()))
                        .collect(Collectors.toList())
                : List.of();

        if (sampleCases.isEmpty() && question.getTestCases() != null && !question.getTestCases().isEmpty()) {
            sampleCases = List.of(question.getTestCases().get(0));
        }

        SubmissionVerdict overallVerdict = SubmissionVerdict.ACCEPTED;

        for (int i = 0; i < sampleCases.size(); i++) {
            TestCase tc = sampleCases.get(i);
            Judge0SubmissionRequest jReq = Judge0SubmissionRequest.builder()
                    .sourceCode(request.getSourceCode())
                    .languageId(request.getLanguage().getJudge0Id())
                    .stdin(tc.getInputData())
                    .expectedOutput(tc.getExpectedOutput())
                    .cpuTimeLimit((float) (question.getTimeLimitMs() / 1000.0))
                    .memoryLimit(question.getMemoryLimitMb() * 1024)
                    .build();

            CodeExecutionResult exec = judge0Client.execute(jReq);
            SubmissionVerdict v = mapJudge0StatusToVerdict(exec.getStatus());

            // If stdout equals expected output, treat as accepted
            if (v == SubmissionVerdict.ACCEPTED || matchesOutput(exec.getStdout(), tc.getExpectedOutput())) {
                v = SubmissionVerdict.ACCEPTED;
                passed++;
            } else if (v == SubmissionVerdict.COMPILATION_ERROR) {
                compileSuccess = false;
                compileOutput = exec.getCompileOutput();
                overallVerdict = SubmissionVerdict.COMPILATION_ERROR;
            } else if (overallVerdict == SubmissionVerdict.ACCEPTED) {
                overallVerdict = v;
            }

            results.add(TestCaseRunResultDto.builder()
                    .testCaseNumber(i + 1)
                    .isSample(true)
                    .status(v)
                    .input(tc.getInputData())
                    .expectedOutput(tc.getExpectedOutput())
                    .actualOutput(exec.getStdout())
                    .stderr(exec.getStderr())
                    .executionTimeMs(exec.getExecutionTimeMs())
                    .memoryKb(exec.getMemoryKb())
                    .build());

            if (!compileSuccess) {
                break;
            }
        }

        return RunCodeResponse.builder()
                .overallVerdict(
                        compileSuccess && passed == sampleCases.size() ? SubmissionVerdict.ACCEPTED : overallVerdict)
                .compileSuccess(compileSuccess)
                .compileOutput(compileOutput)
                .totalSampleCases(sampleCases.size())
                .passedSampleCases(passed)
                .testCaseResults(results)
                .build();
    }

    @Override
    @Transactional
    public SubmitCodeResponse submitCode(SubmitCodeRequest request, UserPrincipal principal,
            HttpServletRequest httpRequest) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required to submit code");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", request.getQuestionId()));

        Assignment assignment = null;
        Integer assignmentPoints = null;

        if (request.getAssignmentId() != null) {
            assignment = assignmentRepository.findById(request.getAssignmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", request.getAssignmentId()));

            // Verify enrollment if user is student
            if (user.getRole() == Role.STUDENT) {
                boolean enrolled = batchStudentRepository.existsByBatchIdAndStudentId(
                        assignment.getBatch().getId(), user.getId());
                if (!enrolled) {
                    throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN",
                            "You are not enrolled in this assignment's cohort batch");
                }
            }

            // Look up points allocated for this question in the assignment
            Assignment finalAssignment = assignment;
            assignmentPoints = assignment.getAssignmentQuestions().stream()
                    .filter(aq -> aq.getQuestion().getId().equals(question.getId()))
                    .findFirst()
                    .map(AssignmentQuestion::getPoints)
                    .orElse(10);
        }

        List<TestCase> allCases = question.getTestCases() != null ? question.getTestCases() : List.of();
        int totalCases = allCases.size();
        int passedCases = 0;
        SubmissionVerdict overallVerdict = SubmissionVerdict.ACCEPTED;
        String compileOutput = null;
        Integer maxTimeMs = 0;
        Integer maxMemoryKb = 0;

        List<TestCaseRunResultDto> clientResults = new ArrayList<>();
        List<SubmissionTestCaseResult> dbResults = new ArrayList<>();

        Submission submission = Submission.builder()
                .user(user)
                .question(question)
                .assignment(assignment)
                .sourceCode(request.getSourceCode())
                .language(request.getLanguage())
                .judge0LanguageId(request.getLanguage().getJudge0Id())
                .type(SubmissionType.SUBMIT)
                .verdict(SubmissionVerdict.PENDING)
                .totalTestCases(totalCases)
                .score(0)
                .build();

        for (int i = 0; i < allCases.size(); i++) {
            TestCase tc = allCases.get(i);
            Judge0SubmissionRequest jReq = Judge0SubmissionRequest.builder()
                    .sourceCode(request.getSourceCode())
                    .languageId(request.getLanguage().getJudge0Id())
                    .stdin(tc.getInputData())
                    .expectedOutput(tc.getExpectedOutput())
                    .cpuTimeLimit((float) (question.getTimeLimitMs() / 1000.0))
                    .memoryLimit(question.getMemoryLimitMb() * 1024)
                    .build();

            CodeExecutionResult exec = judge0Client.execute(jReq);
            SubmissionVerdict v = mapJudge0StatusToVerdict(exec.getStatus());

            if (exec.getExecutionTimeMs() != null && exec.getExecutionTimeMs() > maxTimeMs) {
                maxTimeMs = exec.getExecutionTimeMs();
            }
            if (exec.getMemoryKb() != null && exec.getMemoryKb() > maxMemoryKb) {
                maxMemoryKb = exec.getMemoryKb();
            }

            if (v == SubmissionVerdict.ACCEPTED || matchesOutput(exec.getStdout(), tc.getExpectedOutput())) {
                v = SubmissionVerdict.ACCEPTED;
                passedCases++;
            } else if (v == SubmissionVerdict.COMPILATION_ERROR) {
                compileOutput = exec.getCompileOutput();
                overallVerdict = SubmissionVerdict.COMPILATION_ERROR;
            } else if (overallVerdict == SubmissionVerdict.ACCEPTED) {
                overallVerdict = v;
            }

            // Save test case result entity
            SubmissionTestCaseResult stc = SubmissionTestCaseResult.builder()
                    .submission(submission)
                    .testCase(tc)
                    .orderIndex(i)
                    .isSample(tc.getIsSample())
                    .status(v)
                    .executionTimeMs(exec.getExecutionTimeMs())
                    .memoryKb(exec.getMemoryKb())
                    .stdout(exec.getStdout())
                    .stderr(exec.getStderr())
                    .build();
            dbResults.add(stc);

            // Client DTO: For sample cases, show details. For hidden cases, mask
            // inputs/outputs!
            boolean isSample = Boolean.TRUE.equals(tc.getIsSample());
            boolean maskDetails = !isSample && user.getRole() == Role.STUDENT;

            clientResults.add(TestCaseRunResultDto.builder()
                    .testCaseNumber(i + 1)
                    .isSample(isSample)
                    .status(v)
                    .input(maskDetails ? "(Hidden Test Case)" : tc.getInputData())
                    .expectedOutput(maskDetails ? "(Hidden Test Case)" : tc.getExpectedOutput())
                    .actualOutput(
                            maskDetails ? (v == SubmissionVerdict.ACCEPTED ? "(Output Passed)" : "(Hidden Output)")
                                    : exec.getStdout())
                    .stderr(exec.getStderr())
                    .executionTimeMs(exec.getExecutionTimeMs())
                    .memoryKb(exec.getMemoryKb())
                    .build());

            if (overallVerdict == SubmissionVerdict.COMPILATION_ERROR) {
                break;
            }
        }

        if (totalCases > 0 && passedCases == totalCases) {
            overallVerdict = SubmissionVerdict.ACCEPTED;
        }

        // Calculate score
        int score;
        if (assignmentPoints != null) {
            score = (totalCases > 0) ? (passedCases * assignmentPoints) / totalCases : 0;
        } else {
            score = (totalCases > 0) ? (passedCases * 100) / totalCases : 0;
        }

        submission.setVerdict(overallVerdict);
        submission.setPassedTestCases(passedCases);
        submission.setExecutionTimeMs(maxTimeMs);
        submission.setMemoryKb(maxMemoryKb);
        submission.setCompileOutput(compileOutput);
        submission.setScore(score);
        submission.setTestCaseResults(dbResults);

        Submission saved = submissionRepository.save(submission);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(user.getId(), user.getEmail(), "CODE_SUBMITTED", "SUBMISSION",
                saved.getId().toString(), "Verdict: " + overallVerdict + " on " + question.getTitle(), clientIp);

        return SubmitCodeResponse.builder()
                .submissionId(saved.getId())
                .verdict(overallVerdict)
                .passedTestCases(passedCases)
                .totalTestCases(totalCases)
                .score(score)
                .executionTimeMs(maxTimeMs)
                .memoryKb(maxMemoryKb)
                .compileOutput(compileOutput)
                .submittedAt(saved.getCreatedAt() != null ? saved.getCreatedAt() : Instant.now())
                .testCaseResults(clientResults)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubmissionSummaryResponse> getMySubmissions(UUID questionId, UserPrincipal principal,
            Pageable pageable) {
        if (principal == null) {
            return Page.empty(pageable);
        }

        Page<Submission> page = (questionId != null)
                ? submissionRepository.findByUserIdAndQuestionIdOrderByCreatedAtDesc(principal.getId(), questionId,
                        pageable)
                : submissionRepository.findByUserIdOrderByCreatedAtDesc(principal.getId(), pageable);

        return page.map(this::mapToSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionDetailResponse getSubmissionById(UUID submissionId, UserPrincipal principal) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        return mapToDetail(submission, principal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionSummaryResponse> getSubmissionsByQuestion(UUID questionId, UserPrincipal principal) {
        return submissionRepository.findByQuestionIdOrderByCreatedAtDesc(questionId).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionSummaryResponse> getSubmissionsByAssignment(UUID assignmentId, UserPrincipal principal) {
        return submissionRepository.findByAssignmentIdOrderByCreatedAtDesc(assignmentId).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    private SubmissionVerdict mapJudge0StatusToVerdict(Judge0Status status) {
        if (status == null)
            return SubmissionVerdict.INTERNAL_ERROR;
        return switch (status) {
            case ACCEPTED -> SubmissionVerdict.ACCEPTED;
            case WRONG_ANSWER -> SubmissionVerdict.WRONG_ANSWER;
            case TIME_LIMIT_EXCEEDED -> SubmissionVerdict.TIME_LIMIT_EXCEEDED;
            case COMPILATION_ERROR -> SubmissionVerdict.COMPILATION_ERROR;
            case RUNTIME_ERROR_SIGSEGV, RUNTIME_ERROR_SIGXFSZ, RUNTIME_ERROR_SIGFPE,
                    RUNTIME_ERROR_SIGABRT, RUNTIME_ERROR_NZEC, RUNTIME_ERROR_OTHER,
                    EXEC_FORMAT_ERROR ->
                SubmissionVerdict.RUNTIME_ERROR;
            default -> SubmissionVerdict.INTERNAL_ERROR;
        };
    }

    private boolean matchesOutput(String actual, String expected) {
        if (actual == null || expected == null)
            return false;
        String a = actual.replaceAll("\r\n", "\n").trim();
        String e = expected.replaceAll("\r\n", "\n").trim();
        return a.equals(e);
    }

    private SubmissionSummaryResponse mapToSummary(Submission s) {
        return SubmissionSummaryResponse.builder()
                .id(s.getId())
                .questionId(s.getQuestion().getId())
                .questionTitle(s.getQuestion().getTitle())
                .questionSlug(s.getQuestion().getSlug())
                .assignmentId(s.getAssignment() != null ? s.getAssignment().getId() : null)
                .language(s.getLanguage())
                .verdict(s.getVerdict())
                .passedTestCases(s.getPassedTestCases())
                .totalTestCases(s.getTotalTestCases())
                .score(s.getScore())
                .executionTimeMs(s.getExecutionTimeMs())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private SubmissionDetailResponse mapToDetail(Submission s, UserPrincipal principal) {
        boolean isStudent = principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));

        List<TestCaseRunResultDto> caseResults = s.getTestCaseResults().stream().map(stc -> {
            boolean maskDetails = !stc.getIsSample() && isStudent;
            return TestCaseRunResultDto.builder()
                    .testCaseNumber(stc.getOrderIndex() + 1)
                    .isSample(stc.getIsSample())
                    .status(stc.getStatus())
                    .input(maskDetails ? "(Hidden Test Case)"
                            : (stc.getTestCase() != null ? stc.getTestCase().getInputData() : null))
                    .expectedOutput(maskDetails ? "(Hidden Test Case)"
                            : (stc.getTestCase() != null ? stc.getTestCase().getExpectedOutput() : null))
                    .actualOutput(maskDetails ? "(Output Hidden)" : stc.getStdout())
                    .stderr(stc.getStderr())
                    .executionTimeMs(stc.getExecutionTimeMs())
                    .memoryKb(stc.getMemoryKb())
                    .build();
        }).collect(Collectors.toList());

        return SubmissionDetailResponse.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .userName(s.getUser().getFullName())
                .questionId(s.getQuestion().getId())
                .questionTitle(s.getQuestion().getTitle())
                .questionSlug(s.getQuestion().getSlug())
                .assignmentId(s.getAssignment() != null ? s.getAssignment().getId() : null)
                .sourceCode(s.getSourceCode())
                .language(s.getLanguage())
                .type(s.getType())
                .verdict(s.getVerdict())
                .passedTestCases(s.getPassedTestCases())
                .totalTestCases(s.getTotalTestCases())
                .score(s.getScore())
                .executionTimeMs(s.getExecutionTimeMs())
                .memoryKb(s.getMemoryKb())
                .stdout(s.getStdout())
                .stderr(s.getStderr())
                .compileOutput(s.getCompileOutput())
                .createdAt(s.getCreatedAt())
                .testCaseResults(caseResults)
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null)
            return "127.0.0.1";
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
