package com.company.placement.submission;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.execution.CodeExecutionResult;
import com.company.placement.execution.Judge0Client;
import com.company.placement.execution.Judge0Status;
import com.company.placement.execution.ProgrammingLanguage;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionRepository;
import com.company.placement.question.TestCase;
import com.company.placement.submission.dto.RunCodeRequest;
import com.company.placement.submission.dto.RunCodeResponse;
import com.company.placement.submission.dto.SubmitCodeRequest;
import com.company.placement.submission.dto.SubmitCodeResponse;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private SubmissionTestCaseResultRepository submissionTestCaseResultRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Judge0Client judge0Client;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private com.company.placement.scoring.ScoringService scoringService;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    private User student;
    private UserPrincipal studentPrincipal;
    private Question question;
    private final UUID studentId = UUID.randomUUID();
    private final UUID questionId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        student = User.builder()
                .email("student@company.com")
                .fullName("Alice Student")
                .role(Role.STUDENT)
                .build();
        student.setId(studentId);

        studentPrincipal = UserPrincipal.builder()
                .id(studentId)
                .email("student@company.com")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_STUDENT")))
                .build();

        question = Question.builder()
                .title("Two Sum")
                .slug("two-sum")
                .description("Find numbers that add up to target")
                .difficulty(QuestionDifficulty.EASY)
                .timeLimitMs(1000)
                .memoryLimitMb(256)
                .testCases(new ArrayList<>(List.of(
                        TestCase.builder()
                                .inputData("2 7 11 15\n9")
                                .expectedOutput("0 1")
                                .isSample(true)
                                .orderIndex(0)
                                .build(),
                        TestCase.builder()
                                .inputData("3 2 4\n6")
                                .expectedOutput("1 2")
                                .isSample(false)
                                .orderIndex(1)
                                .build()
                )))
                .build();
        question.setId(questionId);
    }

    @Test
    void runCode_SampleCases_Success() {
        RunCodeRequest request = RunCodeRequest.builder()
                .questionId(questionId)
                .language(ProgrammingLanguage.PYTHON)
                .sourceCode("print('0 1')")
                .build();

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(judge0Client.execute(any())).thenReturn(CodeExecutionResult.builder()
                .status(Judge0Status.ACCEPTED)
                .passed(true)
                .stdout("0 1")
                .executionTimeMs(15)
                .memoryKb(2048)
                .build());

        RunCodeResponse response = submissionService.runCode(request, studentPrincipal, null);

        assertNotNull(response);
        assertEquals(SubmissionVerdict.ACCEPTED, response.getOverallVerdict());
        assertTrue(response.isCompileSuccess());
        assertEquals(1, response.getTotalSampleCases());
        assertEquals(1, response.getPassedSampleCases());
    }

    @Test
    void submitCode_AllAccepted_ReturnsAcceptedVerdictAndScore() {
        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .questionId(questionId)
                .language(ProgrammingLanguage.PYTHON)
                .sourceCode("def solve(): pass")
                .build();

        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(judge0Client.execute(any())).thenReturn(CodeExecutionResult.builder()
                .status(Judge0Status.ACCEPTED)
                .passed(true)
                .stdout("output")
                .executionTimeMs(20)
                .memoryKb(3100)
                .build());

        when(submissionRepository.save(any(Submission.class))).thenAnswer(inv -> {
            Submission s = inv.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });

        SubmitCodeResponse response = submissionService.submitCode(request, studentPrincipal, null);

        assertNotNull(response);
        assertEquals(SubmissionVerdict.ACCEPTED, response.getVerdict());
        assertEquals(2, response.getPassedTestCases());
        assertEquals(2, response.getTotalTestCases());
        assertEquals(100, response.getScore());

        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }
}
