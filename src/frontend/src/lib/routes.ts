import { Home, LayoutDashboard, FileText, BarChart3, Briefcase, CheckCircle, BookOpen, Brain, MessageSquare, TrendingUp } from 'lucide-react';

export const routes = [
  { path: '/', label: 'Home', icon: Home, public: true },
  { path: '/login', label: 'Login', icon: Home, public: true },
  { path: '/register', label: 'Register', icon: Home, public: true },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  { path: '/resume', label: 'Resume Upload', icon: FileText, protected: true },
  { path: '/analysis', label: 'Analysis', icon: BarChart3, protected: true },
  { path: '/domain', label: 'Domain Selection', icon: Briefcase, protected: true },
  { path: '/job-role', label: 'Job Role', icon: Briefcase, protected: true },
  { path: '/eligibility', label: 'Eligibility Check', icon: CheckCircle, protected: true },
  { path: '/learning-plan', label: 'Learning Plan', icon: BookOpen, protected: true },
  { path: '/quiz', label: 'Quiz', icon: Brain, protected: true },
  { path: '/interview', label: 'Interview', icon: MessageSquare, protected: true },
  { path: '/progress', label: 'Progress', icon: TrendingUp, protected: true },
];

export const publicRoutes = routes.filter(r => r.public);
export const protectedRoutes = routes.filter(r => r.protected);
