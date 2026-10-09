package com.company.placement.user;

import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UpdateProfileRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentProfileServiceTest {

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private StudentProfileServiceImpl studentProfileService;

    private User student;
    private final UUID studentId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(studentProfileService, "uploadDir", "target/test-uploads");

        student = User.builder()
                .email("student@company.com")
                .fullName("Student Alice")
                .role(Role.STUDENT)
                .build();
        student.setId(studentId);
    }

    @Test
    void updateProfile_Success() {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .degree("B.Tech CSE")
                .branch("Computer Science")
                .college("National Institute of Tech")
                .graduationYear(2026)
                .cgpa(new BigDecimal("8.80"))
                .skills(List.of("Java", "Spring Boot", "React"))
                .githubUrl("https://github.com/alice")
                .linkedinUrl("https://linkedin.com/in/alice")
                .build();

        StudentProfile existingProfile = StudentProfile.builder()
                .user(student)
                .build();

        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentProfileRepository.findByUserId(studentId)).thenReturn(Optional.of(existingProfile));
        when(studentProfileRepository.save(any(StudentProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        StudentProfileResponse response = studentProfileService.updateProfile(studentId, request);

        assertNotNull(response);
        assertEquals("B.Tech CSE", response.getDegree());
        assertEquals("Computer Science", response.getBranch());
        assertEquals("National Institute of Tech", response.getCollege());
        assertEquals(2026, response.getGraduationYear());
        assertEquals(new BigDecimal("8.80"), response.getCgpa());
        assertTrue(response.getCompletionPercentage() > 50);
    }
}
