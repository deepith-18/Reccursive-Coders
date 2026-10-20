package com.company.placement.notification.dto;

import com.company.placement.notification.Notification;
import com.company.placement.notification.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private String linkUrl;
    private boolean read;
    private Instant createdAt;

    public static NotificationResponse fromEntity(Notification entity) {
        return NotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .type(entity.getType())
                .linkUrl(entity.getLinkUrl())
                .read(entity.isRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
