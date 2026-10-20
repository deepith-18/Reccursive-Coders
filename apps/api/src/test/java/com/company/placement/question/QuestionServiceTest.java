package com.company.placement.question;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.question.dto.CreateQuestionRequest;
import com.company.placement.question.dto.CreateTestCaseRequest;
import com.company.placement.question.dto.QuestionResponse;
import com.company.placement.question.dto.UpdateQuestionRequest;
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
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private TestCaseRepository testCaseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private User trainer;
    private final UUID trainerId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        trainer = User.builder()
                .email("trainer@company.com")
                .fullName("Trainer Bob")
                .role(Role.TRAINER)
                .build();
        trainer.setId(trainerId);
    }

    @Test
    void createQuestion_Success() {
        CreateQuestionRequest request = CreateQuestionRequest.builder()
                .title("Two Sum")
                .description("Given an array of integers, return indices of the two numbers such that they add up to a specific target.")
                .difficulty(QuestionDifficulty.EASY)
                .tags("Arrays, Hash Table")
                .timeLimitMs(1000)
                .memoryLimitMb(256)
                .status(QuestionStatus.PUBLISHED)
                .testCases(List.of(
                        CreateTestCaseRequest.builder()
                                .inputData("nums = [2,7,11,15], target = 9")
                                .expectedOutput("[0,1]")
                                .isSample(true)
                                .explanation("nums[0] + nums[1] == 9")
                                .orderIndex(0)
                                .build(),
                        CreateTestCaseRequest.builder()
                                .inputData("nums = [3,2,4], target = 6")
                                .expectedOutput("[1,2]")
                                .isSample(false)
                                .orderIndex(1)
                                .build()
                ))
                .build();

        when(userRepository.findById(trainerId)).thenReturn(Optional.of(trainer));
        when(questionRepository.existsBySlugIgnoreCase("two-sum")).thenReturn(false);
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> {
            Question q = inv.getArgument(0);
            q.setId(UUID.randomUUID());
            return q;
        });

        QuestionResponse response = questionService.createQuestion(request, trainerId, "trainer@company.com", null);

        assertNotNull(response);
        assertEquals("Two Sum", response.getTitle());
        assertEquals("two-sum", response.getSlug());
        assertEquals(QuestionDifficulty.EASY, response.getDifficulty());
        assertEquals(2, response.getTotalTestCasesCount());
        assertEquals(1, response.getHiddenTestCasesCount());

        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void getQuestionById_MasksHiddenTestCasesForStudent() {
        UUID questionId = UUID.randomUUID();
        Question question = Question.builder()
                .title("Reverse String")
                .slug("reverse-string")
                .description("Reverse the given string.")
                .difficulty(QuestionDifficulty.EASY)
                .author(trainer)
                .testCases(new ArrayList<>(List.of(
                        TestCase.builder()
                                .inputData("hello")
                                .expectedOutput("olleh")
                                .isSample(true)
                                .build(),
                        TestCase.builder()
                                .inputData("secret hidden input")
                                .expectedOutput("tupni neddih terces")
                                .isSample(false)
                                .build()
                )))
                .build();
        question.setId(questionId);

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));

        UserPrincipal studentPrincipal = UserPrincipal.builder()
                .id(UUID.randomUUID())
                .email("student@company.com")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_STUDENT")))
                .build();

        QuestionResponse response = questionService.getQuestionById(questionId, studentPrincipal);

        assertNotNull(response);
        assertEquals(1, response.getTestCases().size());
        assertTrue(response.getTestCases().get(0).getIsSample());
        assertEquals(2, response.getTotalTestCasesCount());
        assertEquals(1, response.getHiddenTestCasesCount());
    }

    @Test
    void updateQuestion_ForbiddenForDifferentTrainer() {
        UUID questionId = UUID.randomUUID();
        Question question = Question.builder()
                .title("Binary Search")
                .slug("binary-search")
                .description("Search target in sorted array")
                .difficulty(QuestionDifficulty.EASY)
                .author(trainer)
                .build();
        question.setId(questionId);

        UUID otherTrainerId = UUID.randomUUID();
        User otherTrainer = User.builder()
                .email("other@company.com")
                .role(Role.TRAINER)
                .build();
        otherTrainer.setId(otherTrainerId);

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(userRepository.findById(otherTrainerId)).thenReturn(Optional.of(otherTrainer));

        UpdateQuestionRequest updateReq = UpdateQuestionRequest.builder()
                .title("New Title")
                .description("Updated desc")
                .difficulty(QuestionDifficulty.MEDIUM)
                .timeLimitMs(1000)
                .memoryLimitMb(256)
                .status(QuestionStatus.PUBLISHED)
                .build();

        assertThrows(ApiException.class, () ->
                questionService.updateQuestion(questionId, updateReq, otherTrainerId, "other@company.com", null)
        );
    }
}
