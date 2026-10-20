package com.company.placement.notification;

import com.company.placement.notification.dto.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationService {

    NotificationResponse sendNotification(UUID userId, String title, String message, NotificationType type, String linkUrl);

    Page<NotificationResponse> getMyNotifications(String userEmail, Pageable pageable);

    long getUnreadCount(String userEmail);

    void markAsRead(String userEmail, UUID notificationId);

    void markAllAsRead(String userEmail);
}
