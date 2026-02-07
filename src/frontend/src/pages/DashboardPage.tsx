import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useGetCallerResumes, useGetUserProgress } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileText, BarChart3, BookOpen, Brain, MessageSquare, TrendingUp, Rocket, AlertCircle } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = useGetCallerUserProfile();
  const { data: resumes, isLoading: resumesLoading, isError: resumesError } = useGetCallerResumes();
  const { data: progress, isError: progressError } = useGetUserProgress();

  const hasResume = resumes && resumes.length > 0;

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Start by uploading your resume for AI analysis',
      icon: FileText,
      path: '/resume',
      color: 'from-blue-600 to-blue-500',
    },
    {
      title: 'View Analysis',
      description: 'See your resume score and skill gaps',
      icon: BarChart3,
      path: '/analysis',
      color: 'from-purple-600 to-purple-500',
      disabled: !hasResume,
      disabledMessage: 'Upload resume first',
    },
    {
      title: 'Learning Plan',
      description: 'Access your personalized 4-week plan',
      icon: BookOpen,
      path: '/learning-plan',
      color: 'from-green-600 to-green-500',
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge and skills',
      icon: Brain,
      path: '/quiz',
      color: 'from-orange-600 to-orange-500',
    },
    {
      title: 'Mock Interview',
      description: 'Practice with AI-powered interviews',
      icon: MessageSquare,
      path: '/interview',
      color: 'from-pink-600 to-pink-500',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      icon: TrendingUp,
      path: '/progress',
      color: 'from-indigo-600 to-indigo-500',
    },
  ];

  if (profileError || resumesError || progressError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <AsyncState isLoading={profileLoading || resumesLoading}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {userProfile?.name || 'there'}! <Rocket className="inline w-8 h-8 text-purple-600" />
            </h1>
            <p className="text-muted-foreground mt-2">Here's your career development dashboard</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resumes Uploaded</CardDescription>
              <CardTitle className="text-3xl">{resumes?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quizzes Taken</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.quizzesTaken || 0)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Interviews Completed</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.interviewsCompleted || 0)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tasks Completed</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.completedTasks || 0)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.path}
                  className={`border-2 hover:border-purple-500 transition-all hover:shadow-lg ${
                    action.disabled ? 'opacity-50' : 'cursor-pointer'
                  }`}
                  onClick={() => !action.disabled && navigate({ to: action.path })}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full"
                      disabled={action.disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!action.disabled) navigate({ to: action.path });
                      }}
                    >
                      {action.disabled ? action.disabledMessage : 'Get Started →'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started Guide */}
        {!hasResume && (
          <Card className="border-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-600" />
                Getting Started
              </CardTitle>
              <CardDescription>Follow these steps to begin your career journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Upload Your Resume</p>
                  <p className="text-sm text-muted-foreground">Let our AI analyze your skills and experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Review Your Analysis</p>
                  <p className="text-sm text-muted-foreground">See your strengths and areas for improvement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Start Learning</p>
                  <p className="text-sm text-muted-foreground">Follow your personalized learning plan</p>
                </div>
              </div>
              <Button
                onClick={() => navigate({ to: '/resume' })}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                Upload Resume Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AsyncState>
  );
}
