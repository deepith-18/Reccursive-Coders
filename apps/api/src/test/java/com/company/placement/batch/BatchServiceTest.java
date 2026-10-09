package com.company.placement.batch;

import com.company.placement.batch.dto.BatchResponse;
import com.company.placement.batch.dto.CreateBatchRequest;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BatchServiceTest {

    @Mock
    private BatchRepository batchRepository;

    @Mock
    private BatchStudentRepository batchStudentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private BatchServiceImpl batchService;

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
    void createBatch_Success() {
        CreateBatchRequest request = CreateBatchRequest.builder()
                .name("Full Stack Java 2026")
                .code("FS-JAVA-01")
                .trainerId(trainerId)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(4))
                .status(BatchStatus.ACTIVE)
                .build();

        when(batchRepository.existsByCodeIgnoreCase("FS-JAVA-01")).thenReturn(false);
        when(userRepository.findById(trainerId)).thenReturn(Optional.of(trainer));
        when(batchRepository.save(any(Batch.class))).thenAnswer(inv -> {
            Batch b = inv.getArgument(0);
            b.setId(UUID.randomUUID());
            return b;
        });

        BatchResponse response = batchService.createBatch(request, UUID.randomUUID(), "admin@company.com", null);

        assertNotNull(response);
        assertEquals("Full Stack Java 2026", response.getName());
        assertEquals("FS-JAVA-01", response.getCode());
        assertNotNull(response.getTrainer());
        assertEquals("trainer@company.com", response.getTrainer().getEmail());

        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void createBatch_DuplicateCode_ThrowsException() {
        CreateBatchRequest request = CreateBatchRequest.builder()
                .name("Duplicate Batch")
                .code("FS-JAVA-01")
                .build();

        when(batchRepository.existsByCodeIgnoreCase("FS-JAVA-01")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () ->
                batchService.createBatch(request, UUID.randomUUID(), "admin@company.com", null)
        );
        assertEquals("BATCH_CODE_EXISTS", ex.getErrorCode());
    }

    @Test
    void enrollStudents_Success() {
        UUID batchId = UUID.randomUUID();
        UUID studentId = UUID.randomUUID();
        Batch batch = Batch.builder().name("Java Batch").code("JB-01").build();
        batch.setId(batchId);

        User student = User.builder().email("student@company.com").role(Role.STUDENT).build();
        student.setId(studentId);

        when(batchRepository.findById(batchId)).thenReturn(Optional.of(batch));
        when(batchStudentRepository.existsByBatchIdAndStudentId(batchId, studentId)).thenReturn(false);
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));

        batchService.enrollStudents(batchId, List.of(studentId), UUID.randomUUID(), "admin@company.com", null);

        verify(batchStudentRepository).save(any(BatchStudent.class));
        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }
}
