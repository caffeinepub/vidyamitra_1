import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { AppShell } from './components/AppShell';
import { AuthGate } from './components/AuthGate';
import { LoadingRocket } from './components/LoadingRocket';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import AnalysisPage from './pages/AnalysisPage';
import DomainSelectionPage from './pages/DomainSelectionPage';
import JobRoleSelectionPage from './pages/JobRoleSelectionPage';
import EligibilityCheckPage from './pages/EligibilityCheckPage';
import LearningPlanPage from './pages/LearningPlanPage';
import QuizPage from './pages/QuizPage';
import InterviewPage from './pages/InterviewPage';
import ProgressPage from './pages/ProgressPage';
import NotFoundPage from './components/NotFoundPage';

const protectedPaths = [
  '/dashboard',
  '/resume',
  '/analysis',
  '/domain',
  '/job-role',
  '/eligibility',
  '/learning-plan',
  '/quiz',
  '/interview',
  '/progress',
];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/login' });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingRocket />
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return <>{children}</>;
}

function Layout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <AuthGate>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthGate>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const resumeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resume',
  component: () => (
    <ProtectedRoute>
      <ResumeUploadPage />
    </ProtectedRoute>
  ),
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analysis',
  component: () => (
    <ProtectedRoute>
      <AnalysisPage />
    </ProtectedRoute>
  ),
});

const domainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/domain',
  component: () => (
    <ProtectedRoute>
      <DomainSelectionPage />
    </ProtectedRoute>
  ),
});

const jobRoleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/job-role',
  component: () => (
    <ProtectedRoute>
      <JobRoleSelectionPage />
    </ProtectedRoute>
  ),
});

const eligibilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/eligibility',
  component: () => (
    <ProtectedRoute>
      <EligibilityCheckPage />
    </ProtectedRoute>
  ),
});

const learningPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/learning-plan',
  component: () => (
    <ProtectedRoute>
      <LearningPlanPage />
    </ProtectedRoute>
  ),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: () => (
    <ProtectedRoute>
      <QuizPage />
    </ProtectedRoute>
  ),
});

const interviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/interview',
  component: () => (
    <ProtectedRoute>
      <InterviewPage />
    </ProtectedRoute>
  ),
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: () => (
    <ProtectedRoute>
      <ProgressPage />
    </ProtectedRoute>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  resumeRoute,
  analysisRoute,
  domainRoute,
  jobRoleRoute,
  eligibilityRoute,
  learningPlanRoute,
  quizRoute,
  interviewRoute,
  progressRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
