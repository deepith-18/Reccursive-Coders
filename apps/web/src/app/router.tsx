import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RoleGuard } from '@/shared/guards/RoleGuard';

// Student Portal
import { StudentLayout } from '@/features/student/StudentLayout';
import { StudentDashboardPage } from '@/features/student/StudentDashboardPage';
import { StudentPracticePage } from '@/features/student/StudentPracticePage';
import { StudentAssignmentsPage } from '@/features/student/StudentAssignmentsPage';
import { StudentProfilePage } from '@/features/student/StudentProfilePage';
import { PlacementDrivesPage } from '@/features/student/PlacementDrivesPage';
import { StudentAssessmentsPage } from '@/features/student/StudentAssessmentsPage';
import { AssessmentArenaPage } from '@/features/student/AssessmentArenaPage';
import { CompanyQuestionsPage } from '@/features/student/CompanyQuestionsPage';

// Trainer Portal
import { TrainerLayout } from '@/features/trainer/TrainerLayout';
import { TrainerDashboardPage } from '@/features/trainer/TrainerDashboardPage';
import { TrainerBatchesPage } from '@/features/trainer/TrainerBatchesPage';
import { TrainerQuestionBuilderPage } from '@/features/trainer/TrainerQuestionBuilderPage';
import { TrainerDrivesPage } from '@/features/trainer/TrainerDrivesPage';
import { TrainerAssessmentsPage } from '@/features/trainer/TrainerAssessmentsPage';

// Admin Portal
import { AdminLayout } from '@/features/admin/AdminLayout';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { AdminBatchesPage } from '@/features/admin/AdminBatchesPage';
import { AdminImpersonationPage } from '@/features/admin/AdminImpersonationPage';

// Leaderboard
import { LeaderboardPage } from '@/features/leaderboard/LeaderboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // Student Portal Routes (Guarded: STUDENT)
      {
        path: 'student',
        element: (
          <RoleGuard allowedRoles={['STUDENT']}>
            <StudentLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <StudentDashboardPage /> },
          { path: 'practice', element: <StudentPracticePage /> },
          { path: 'company-archive', element: <CompanyQuestionsPage /> },
          { path: 'assignments', element: <StudentAssignmentsPage /> },
          { path: 'assessments', element: <StudentAssessmentsPage /> },
          { path: 'assessments/:id/arena', element: <AssessmentArenaPage /> },
          { path: 'placements', element: <PlacementDrivesPage /> },
          { path: 'leaderboard', element: <LeaderboardPage /> },
          { path: 'profile', element: <StudentProfilePage /> },
        ],
      },
      // Trainer Portal Routes (Guarded: TRAINER)
      {
        path: 'trainer',
        element: (
          <RoleGuard allowedRoles={['TRAINER']}>
            <TrainerLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <TrainerDashboardPage /> },
          { path: 'batches', element: <TrainerBatchesPage /> },
          { path: 'questions', element: <TrainerQuestionBuilderPage /> },
          { path: 'assessments', element: <TrainerAssessmentsPage /> },
          { path: 'placements', element: <TrainerDrivesPage /> },
          { path: 'leaderboard', element: <LeaderboardPage /> },
        ],
      },
      // Admin Portal Routes (Guarded: ADMIN)
      {
        path: 'admin',
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <AdminLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'batches', element: <AdminBatchesPage /> },
          { path: 'assessments', element: <TrainerAssessmentsPage /> },
          { path: 'placements', element: <TrainerDrivesPage /> },
          { path: 'leaderboard', element: <LeaderboardPage /> },
          { path: 'impersonate', element: <AdminImpersonationPage /> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
