import { useNavigate } from '@tanstack/react-router';
import { useGetUserProgress, useGetQuizResults, useGetInterviewFeedback, useGetCallerLearningPlan } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { TrendingUp, Brain, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { data: progress, isLoading: progressLoading, isError: progressError } = useGetUserProgress();
  const { data: quiz, isError: quizError } = useGetQuizResults();
  const { data: interview, isError: interviewError } = useGetInterviewFeedback();
  const { data: learningPlan, isError: planError } = useGetCallerLearningPlan();

  const hasAnyError = progressError || quizError || interviewError || planError;

  const completedTasks = learningPlan?.completedTasks?.length || 0;
  const totalTasks = learningPlan?.plan?.reduce((sum, week) => sum + week.tasks.length, 0) || 0;
  const planProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const hasQuiz = !!quiz;
  const hasInterview = !!interview;
  const hasProgress = !!progress;

  if (hasAnyError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load some progress data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    );
  }

  if (!hasQuiz && !hasInterview && !learningPlan && !progressLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Progress Yet</p>
            <p className="text-muted-foreground mb-6 text-center">Start your learning journey to track your progress</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/learning-plan' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
                View Learning Plan
              </Button>
              <Button onClick={() => navigate({ to: '/quiz' })} variant="outline">
                Take a Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AsyncState isLoading={progressLoading}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground mt-2">Track your learning journey</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tasks Completed</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.completedTasks || 0)}</CardTitle>
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
              <CardDescription>Avg Quiz Score</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.averageQuizScore || 0)}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Interviews Done</CardDescription>
              <CardTitle className="text-3xl">{Number(progress?.interviewsCompleted || 0)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Plan Progress */}
        {learningPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Learning Plan Progress
              </CardTitle>
              <CardDescription>
                {completedTasks} of {totalTasks} tasks completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={planProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{planProgress}% complete</p>
            </CardContent>
          </Card>
        )}

        {/* Quiz Results */}
        {hasQuiz && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-600" />
                Latest Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Score</span>
                <span className="text-2xl font-bold">{Number(quiz.score)}/{quiz.questions.length}</span>
              </div>
              <Progress value={(Number(quiz.score) / quiz.questions.length) * 100} className="h-3" />
              <Button onClick={() => navigate({ to: '/quiz' })} variant="outline" className="w-full">
                Take Another Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interview Feedback */}
        {hasInterview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-600" />
                Latest Interview Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Overall</p>
                  <p className="text-2xl font-bold">{Number(interview.overallScore)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Communication</p>
                  <p className="text-2xl font-bold">{Number(interview.communication)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Technical</p>
                  <p className="text-2xl font-bold">{Number(interview.technicalKnowledge)}%</p>
                </div>
              </div>
              <Button onClick={() => navigate({ to: '/interview' })} variant="outline" className="w-full">
                Practice Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="border-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
          <CardHeader>
            <CardTitle>Keep Going!</CardTitle>
            <CardDescription>Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate({ to: '/learning-plan' })} variant="outline" className="w-full">
              Continue Learning Plan
            </Button>
            <Button onClick={() => navigate({ to: '/quiz' })} variant="outline" className="w-full">
              Take Another Quiz
            </Button>
            <Button onClick={() => navigate({ to: '/interview' })} variant="outline" className="w-full">
              Practice Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    </AsyncState>
  );
}
