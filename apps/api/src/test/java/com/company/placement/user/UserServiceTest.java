package com.company.placement.user;

import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.user.dto.BulkUploadResult;
import com.company.placement.user.dto.CreateUserRequest;
import com.company.placement.user.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void createUser_Success() {
        CreateUserRequest request = CreateUserRequest.builder()
                .email("trainer@company.com")
                .fullName("Trainer John")
                .role(Role.TRAINER)
                .temporaryPassword("CustomTempPass1!")
                .build();

        when(userRepository.existsByEmailIgnoreCase("trainer@company.com")).thenReturn(false);
        when(passwordEncoder.encode("CustomTempPass1!")).thenReturn("hashedTempPass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });

        UserResponse response = userService.createUser(request, UUID.randomUUID(), "admin@company.com", null);

        assertNotNull(response);
        assertEquals("trainer@company.com", response.getEmail());
        assertEquals(Role.TRAINER, response.getRole());
        assertTrue(response.isForcePasswordChange());

        verify(auditLogService).record(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        CreateUserRequest request = CreateUserRequest.builder()
                .email("existing@company.com")
                .fullName("Existing User")
                .role(Role.STUDENT)
                .build();

        when(userRepository.existsByEmailIgnoreCase("existing@company.com")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () ->
                userService.createUser(request, UUID.randomUUID(), "admin@company.com", null)
        );
        assertEquals("EMAIL_ALREADY_EXISTS", ex.getErrorCode());
    }

    @Test
    void bulkUploadStudents_SuccessAndErrors() {
        String csvContent = "fullName,email,phone\n" +
                "Alice Smith,alice@student.com,9876543210\n" +
                "Bob Jones,bob@student.com,9876543211\n" +
                "Invalid Student,not-an-email,123\n" +
                ",missing.name@student.com,123\n";

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "students.csv",
                "text/csv",
                csvContent.getBytes(StandardCharsets.UTF_8)
        );

        when(userRepository.existsByEmailIgnoreCase("alice@student.com")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("bob@student.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedDefaultPass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });

        BulkUploadResult result = userService.bulkUploadStudents(file, UUID.randomUUID(), "admin@company.com", null);

        assertNotNull(result);
        assertEquals(2, result.getTotalSuccess());
        assertEquals(2, result.getTotalFailed());
        assertEquals(2, result.getErrors().size());
        assertTrue(result.getErrors().get(0).contains("Invalid email"));
        assertTrue(result.getErrors().get(1).contains("Missing full name"));
    }
}
