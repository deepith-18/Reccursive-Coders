package com.company.placement.notification;

import com.company.placement.notification.dto.NotificationResponse;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User student;
    private Notification notification;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .email("student@test.com")
                .fullName("Test Student")
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
        student.setId(UUID.randomUUID());

        notification = Notification.builder()
                .id(UUID.randomUUID())
                .userId(student.getId())
                .title("New Drive Announced")
                .message("Amazon SDE-1 Recruitment Drive is now open.")
                .type(NotificationType.PLACEMENT_UPDATE)
                .linkUrl("/student/placements")
                .read(false)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void testSendNotification() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        NotificationResponse response = notificationService.sendNotification(
                student.getId(),
                "New Drive Announced",
                "Amazon SDE-1 Recruitment Drive is now open.",
                NotificationType.PLACEMENT_UPDATE,
                "/student/placements"
        );

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("New Drive Announced");
        assertThat(response.getType()).isEqualTo(NotificationType.PLACEMENT_UPDATE);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testGetMyNotifications() {
        when(userRepository.findByEmailIgnoreCase("student@test.com")).thenReturn(Optional.of(student));
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(eq(student.getId()), any()))
                .thenReturn(new PageImpl<>(List.of(notification)));

        Page<NotificationResponse> result = notificationService.getMyNotifications("student@test.com", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("New Drive Announced");
    }

    @Test
    void testGetUnreadCount() {
        when(userRepository.findByEmailIgnoreCase("student@test.com")).thenReturn(Optional.of(student));
        when(notificationRepository.countByUserIdAndReadFalse(student.getId())).thenReturn(3L);

        long count = notificationService.getUnreadCount("student@test.com");
        assertThat(count).isEqualTo(3L);
    }

    @Test
    void testMarkAsRead() {
        when(userRepository.findByEmailIgnoreCase("student@test.com")).thenReturn(Optional.of(student));
        when(notificationRepository.findById(notification.getId())).thenReturn(Optional.of(notification));

        notificationService.markAsRead("student@test.com", notification.getId());

        assertThat(notification.isRead()).isTrue();
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void testMarkAllAsRead() {
        when(userRepository.findByEmailIgnoreCase("student@test.com")).thenReturn(Optional.of(student));
        when(notificationRepository.markAllAsRead(student.getId())).thenReturn(2);

        notificationService.markAllAsRead("student@test.com");
        verify(notificationRepository, times(1)).markAllAsRead(student.getId());
    }
}
