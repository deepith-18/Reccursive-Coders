import { apiClient } from './client';

export type DriveStatus = 'UPCOMING' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'OA_SCHEDULED'
  | 'INTERVIEW_ROUND_1'
  | 'INTERVIEW_ROUND_2'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface PlacementDriveResponse {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  jobRole: string;
  description: string;
  packageCtcLpa: number;
  location?: string;
  minCgpa?: number;
  eligibleBranches?: string;
  minCodingScore?: number;
  driveDate?: string;
  applicationDeadline: string;
  status: DriveStatus;
  openingsCount?: number;
  applicantCount: number;
  applied: boolean;
  eligible: boolean;
  eligibilityReason?: string;
  createdAt: string;
}

export interface PlacementApplicationResponse {
  id: string;
  driveId: string;
  driveTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  jobRole: string;
  packageCtcLpa: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  collegeName?: string;
  branch?: string;
  cgpa?: number;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  recruiterNotes?: string;
  interviewDate?: string;
  offeredCtcLpa?: number;
}

export interface CreatePlacementDriveRequest {
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  jobRole: string;
  description: string;
  packageCtcLpa: number;
  location?: string;
  minCgpa?: number;
  eligibleBranches?: string;
  minCodingScore?: number;
  driveDate?: string;
  applicationDeadline: string;
  status?: DriveStatus;
  openingsCount?: number;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  recruiterNotes?: string;
  interviewDate?: string;
  offeredCtcLpa?: number;
}

export const placementApi = {
  getAllDrives: async (params?: { status?: DriveStatus; search?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<{ success: boolean; data: { content: PlacementDriveResponse[]; totalElements: number } }>(
      '/api/v1/placements/drives',
      { params }
    );
    return res.data.data;
  },

  getDriveById: async (id: string) => {
    const res = await apiClient.get<{ success: boolean; data: PlacementDriveResponse }>(
      `/api/v1/placements/drives/${id}`
    );
    return res.data.data;
  },

  createDrive: async (data: CreatePlacementDriveRequest) => {
    const res = await apiClient.post<{ success: boolean; data: PlacementDriveResponse }>(
      '/api/v1/placements/drives',
      data
    );
    return res.data.data;
  },

  updateDrive: async (id: string, data: CreatePlacementDriveRequest) => {
    const res = await apiClient.put<{ success: boolean; data: PlacementDriveResponse }>(
      `/api/v1/placements/drives/${id}`,
      data
    );
    return res.data.data;
  },

  applyToDrive: async (id: string) => {
    const res = await apiClient.post<{ success: boolean; data: PlacementApplicationResponse }>(
      `/api/v1/placements/drives/${id}/apply`
    );
    return res.data.data;
  },

  getMyApplications: async () => {
    const res = await apiClient.get<{ success: boolean; data: PlacementApplicationResponse[] }>(
      '/api/v1/placements/my-applications'
    );
    return res.data.data;
  },

  getDriveApplications: async (driveId: string, params?: { page?: number; size?: number }) => {
    const res = await apiClient.get<{ success: boolean; data: { content: PlacementApplicationResponse[]; totalElements: number } }>(
      `/api/v1/placements/drives/${driveId}/applications`,
      { params }
    );
    return res.data.data;
  },

  updateApplicationStatus: async (appId: string, data: UpdateApplicationStatusRequest) => {
    const res = await apiClient.patch<{ success: boolean; data: PlacementApplicationResponse }>(
      `/api/v1/placements/applications/${appId}/status`,
      data
    );
    return res.data.data;
  },
};
