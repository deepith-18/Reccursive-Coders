import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { LandingPage } from '@/features/landing/LandingPage';
import { RoleGuard } from '@/shared/guards/RoleGuard';
// Student Portal
import { StudentLayout } from '@/features/student/StudentLayout';
import { StudentDashboardPage } from '@/features/student/StudentDashboardPage';
import { StudentPracticePage } from '@/features/student/StudentPracticePage';
import { StudentAssignmentsPage } from '@/features/student/StudentAssignmentsPage';
import { StudentProfilePage } from '@/features/student/StudentProfilePage';
// Trainer Portal
import { TrainerLayout } from '@/features/trainer/TrainerLayout';
import { TrainerDashboardPage } from '@/features/trainer/TrainerDashboardPage';
import { TrainerBatchesPage } from '@/features/trainer/TrainerBatchesPage';
import { TrainerQuestionBuilderPage } from '@/features/trainer/TrainerQuestionBuilderPage';
// Admin Portal
import { AdminLayout } from '@/features/admin/AdminLayout';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { AdminBatchesPage } from '@/features/admin/AdminBatchesPage';
import { AdminImpersonationPage } from '@/features/admin/AdminImpersonationPage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(RootLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(LandingPage, {}),
            },
            // Student Portal Routes
            {
                path: 'student',
                element: (_jsx(RoleGuard, { allowedRoles: ['STUDENT'], children: _jsx(StudentLayout, {}) })),
                children: [
                    { index: true, element: _jsx(StudentDashboardPage, {}) },
                    { path: 'practice', element: _jsx(StudentPracticePage, {}) },
                    { path: 'assignments', element: _jsx(StudentAssignmentsPage, {}) },
                    { path: 'profile', element: _jsx(StudentProfilePage, {}) },
                ],
            },
            // Trainer Portal Routes
            {
                path: 'trainer',
                element: (_jsx(RoleGuard, { allowedRoles: ['TRAINER'], children: _jsx(TrainerLayout, {}) })),
                children: [
                    { index: true, element: _jsx(TrainerDashboardPage, {}) },
                    { path: 'batches', element: _jsx(TrainerBatchesPage, {}) },
                    { path: 'questions', element: _jsx(TrainerQuestionBuilderPage, {}) },
                ],
            },
            // Admin Portal Routes
            {
                path: 'admin',
                element: (_jsx(RoleGuard, { allowedRoles: ['ADMIN'], children: _jsx(AdminLayout, {}) })),
                children: [
                    { index: true, element: _jsx(AdminDashboardPage, {}) },
                    { path: 'users', element: _jsx(AdminUsersPage, {}) },
                    { path: 'batches', element: _jsx(AdminBatchesPage, {}) },
                    { path: 'impersonate', element: _jsx(AdminImpersonationPage, {}) },
                ],
            },
            {
                path: '*',
                element: _jsx(Navigate, { to: "/", replace: true }),
            },
        ],
    },
]);
