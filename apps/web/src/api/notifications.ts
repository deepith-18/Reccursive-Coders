import { apiClient } from './client';

export type NotificationType =
  | 'PLACEMENT_UPDATE'
  | 'ASSIGNMENT_POSTED'
  | 'SUBMISSION_VERDICT'
  | 'SYSTEM_ALERT'
  | 'ACHIEVEMENT';

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi = {
  getMyNotifications: async (params?: { page?: number; size?: number }) => {
    const res = await apiClient.get<{ success: boolean; data: { content: NotificationResponse[]; totalElements: number } }>(
      '/api/v1/notifications',
      { params }
    );
    return res.data.data;
  },

  getUnreadCount: async () => {
    const res = await apiClient.get<{ success: boolean; data: { unreadCount: number } }>(
      '/api/v1/notifications/unread-count'
    );
    return res.data.data?.unreadCount ?? 0;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch<{ success: boolean }>(
      `/api/v1/notifications/${id}/read`
    );
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.post<{ success: boolean }>(
      '/api/v1/notifications/read-all'
    );
    return res.data;
  },
};
