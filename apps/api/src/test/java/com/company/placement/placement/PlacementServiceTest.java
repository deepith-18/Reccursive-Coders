package com.company.placement.placement;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.placement.dto.CreatePlacementDriveRequest;
import com.company.placement.placement.dto.PlacementApplicationResponse;
import com.company.placement.placement.dto.PlacementDriveResponse;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfile;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlacementServiceTest {

    @Mock
    private PlacementDriveRepository driveRepository;

    @Mock
    private PlacementApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private com.company.placement.notification.NotificationService notificationService;

    @InjectMocks
    private PlacementServiceImpl placementService;

    private User admin;
    private User student;
    private UserPrincipal adminPrincipal;
    private UserPrincipal studentPrincipal;
    private PlacementDrive drive;
    private StudentProfile studentProfile;

    @BeforeEach
    void setUp() {
        admin = User.builder()
                .email("admin@test.com")
                .role(Role.ADMIN)
                .build();
        admin.setId(UUID.randomUUID());

        student = User.builder()
                .email("student@test.com")
                .fullName("Alex Chen")
                .role(Role.STUDENT)
                .build();
        student.setId(UUID.randomUUID());

        adminPrincipal = UserPrincipal.create(admin);
        studentPrincipal = UserPrincipal.create(student);

        drive = PlacementDrive.builder()
                .title("Amazon SDE Drive")
                .companyName("Amazon")
                .jobRole("SDE-1")
                .description("Amazon recruitment")
                .packageCtcLpa(new BigDecimal("18.50"))
                .minCgpa(7.5)
                .minCodingScore(50)
                .applicationDeadline(Instant.now().plus(7, ChronoUnit.DAYS))
                .status(DriveStatus.OPEN)
                .openingsCount(10)
                .creator(admin)
                .build();
        drive.setId(UUID.randomUUID());

        studentProfile = StudentProfile.builder()
                .user(student)
                .college("RV College of Engineering")
                .branch("Computer Science")
                .cgpa(new BigDecimal("8.50"))
                .totalScore(100)
                .resumeFileName("alex_resume.pdf")
                .build();
    }

    @Test
    void createDrive_Success() {
        CreatePlacementDriveRequest req = CreatePlacementDriveRequest.builder()
                .title("Amazon SDE Drive")
                .companyName("Amazon")
                .jobRole("SDE-1")
                .description("Amazon recruitment")
                .packageCtcLpa(new BigDecimal("18.50"))
                .applicationDeadline(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();

        when(userRepository.findById(adminPrincipal.getId())).thenReturn(Optional.of(admin));
        when(driveRepository.save(any(PlacementDrive.class))).thenAnswer(invocation -> {
            PlacementDrive d = invocation.getArgument(0);
            d.setId(UUID.randomUUID());
            return d;
        });

        PlacementDriveResponse response = placementService.createDrive(req, adminPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Amazon SDE Drive");
        assertThat(response.getCompanyName()).isEqualTo("Amazon");
        verify(driveRepository).save(any(PlacementDrive.class));
    }

    @Test
    void applyToDrive_Success() {
        when(driveRepository.findById(drive.getId())).thenReturn(Optional.of(drive));
        when(applicationRepository.existsByDriveIdAndStudentId(drive.getId(), studentPrincipal.getId())).thenReturn(false);
        when(userRepository.findById(studentPrincipal.getId())).thenReturn(Optional.of(student));
        when(studentProfileRepository.findByUserId(studentPrincipal.getId())).thenReturn(Optional.of(studentProfile));
        when(applicationRepository.save(any(PlacementApplication.class))).thenAnswer(invocation -> {
            PlacementApplication a = invocation.getArgument(0);
            a.setId(UUID.randomUUID());
            return a;
        });

        PlacementApplicationResponse response = placementService.applyToDrive(drive.getId(), studentPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
        assertThat(response.getStudentName()).isEqualTo("Alex Chen");
        assertThat(response.getCompanyName()).isEqualTo("Amazon");
        verify(applicationRepository).save(any(PlacementApplication.class));
    }

    @Test
    void applyToDrive_AlreadyApplied_ThrowsConflict() {
        when(driveRepository.findById(drive.getId())).thenReturn(Optional.of(drive));
        when(applicationRepository.existsByDriveIdAndStudentId(drive.getId(), studentPrincipal.getId())).thenReturn(true);

        assertThatThrownBy(() -> placementService.applyToDrive(drive.getId(), studentPrincipal))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("already applied");
    }

    @Test
    void applyToDrive_IneligibleCgpa_ThrowsException() {
        studentProfile.setCgpa(new BigDecimal("6.50")); // drive requires 7.5

        when(driveRepository.findById(drive.getId())).thenReturn(Optional.of(drive));
        when(applicationRepository.existsByDriveIdAndStudentId(drive.getId(), studentPrincipal.getId())).thenReturn(false);
        when(userRepository.findById(studentPrincipal.getId())).thenReturn(Optional.of(student));
        when(studentProfileRepository.findByUserId(studentPrincipal.getId())).thenReturn(Optional.of(studentProfile));

        assertThatThrownBy(() -> placementService.applyToDrive(drive.getId(), studentPrincipal))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("does not meet the minimum requirement");
    }

    @Test
    void deleteDrive_Success() {
        when(driveRepository.findById(drive.getId())).thenReturn(Optional.of(drive));

        placementService.deleteDrive(drive.getId());

        verify(driveRepository).delete(drive);
    }
}
