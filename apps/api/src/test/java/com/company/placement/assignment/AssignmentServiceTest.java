package com.company.placement.assignment;

import com.company.placement.assignment.dto.AssignmentResponse;
import com.company.placement.assignment.dto.AssignmentQuestionItemRequest;
import com.company.placement.assignment.dto.CreateAssignmentRequest;
import com.company.placement.batch.Batch;
import com.company.placement.batch.BatchRepository;
import com.company.placement.batch.BatchStudentRepository;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionRepository;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private AssignmentQuestionRepository assignmentQuestionRepository;

    @Mock
    private BatchRepository batchRepository;

    @Mock
    private BatchStudentRepository batchStudentRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AssignmentServiceImpl assignmentService;

    private User trainer;
    private Batch batch;
    private Question question;
    private final UUID trainerId = UUID.randomUUID();
    private final UUID batchId = UUID.randomUUID();
    private final UUID questionId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        trainer = User.builder()
                .email("trainer@company.com")
                .fullName("Trainer Bob")
                .role(Role.TRAINER)
                .build();
        trainer.setId(trainerId);

        batch = Batch.builder()
                .name("Batch Alpha")
                .code("BATCH-A")
                .trainer(trainer)
                .build();
        batch.setId(batchId);

        question = Question.builder()
                .title("Two Sum")
                .slug("two-sum")
                .description("Two sum description")
                .difficulty(QuestionDifficulty.EASY)
                .build();
        question.setId(questionId);
    }

    @Test
    void createAssignment_Success() {
        CreateAssignmentRequest request = CreateAssignmentRequest.builder()
                .batchId(batchId)
                .title("Week 1 DSA Practice")
                .description("Solve the following algorithmic tasks.")
                .dueDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .status(AssignmentStatus.PUBLISHED)
                .questions(List.of(
                        AssignmentQuestionItemRequest.builder()
                                .questionId(questionId)
                                .points(25)
                                .orderIndex(0)
                                .build()
                ))
                .build();

        when(batchRepository.findById(batchId)).thenReturn(Optional.of(batch));
        when(userRepository.findById(trainerId)).thenReturn(Optional.of(trainer));
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(inv -> {
            Assignment a = inv.getArgument(0);
            a.setId(UUID.randomUUID());
            return a;
        });

        AssignmentResponse response = assignmentService.createAssignment(request, trainerId, "trainer@company.com", null);

        assertNotNull(response);
        assertEquals("Week 1 DSA Practice", response.getTitle());
        assertEquals("BATCH-A", response.getBatchCode());
        assertEquals(25, response.getTotalPoints());
        assertEquals(1, response.getQuestionCount());
        assertEquals(1, response.getQuestions().size());
        assertEquals("Two Sum", response.getQuestions().get(0).getTitle());

        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }
}
