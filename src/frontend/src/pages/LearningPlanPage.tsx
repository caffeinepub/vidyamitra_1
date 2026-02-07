import { useGetCallerLearningPlan, useMarkTaskComplete, useCreateLearningPlan } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';
import { useEffect, useState } from 'react';
import type { WeekPlan } from '../backend';

const defaultPlan: WeekPlan[] = [
  {
    weekNumber: BigInt(1),
    tasks: [
      { name: 'Complete React fundamentals course', description: 'Learn React basics', resourceLink: 'https://react.dev' },
      { name: 'Build a todo app', description: 'Practice component creation', resourceLink: undefined },
    ],
  },
  {
    weekNumber: BigInt(2),
    tasks: [
      { name: 'Learn TypeScript', description: 'Type safety fundamentals', resourceLink: 'https://www.typescriptlang.org' },
      { name: 'Refactor todo app with TypeScript', description: 'Apply TypeScript knowledge', resourceLink: undefined },
    ],
  },
  {
    weekNumber: BigInt(3),
    tasks: [
      { name: 'Study state management', description: 'Learn React Query', resourceLink: 'https://tanstack.com/query' },
      { name: 'Build a data-fetching app', description: 'Practice async state', resourceLink: undefined },
    ],
  },
  {
    weekNumber: BigInt(4),
    tasks: [
      { name: 'Deploy your project', description: 'Learn deployment basics', resourceLink: 'https://vercel.com' },
      { name: 'Create portfolio website', description: 'Showcase your work', resourceLink: undefined },
    ],
  },
];

export default function LearningPlanPage() {
  const { data: plan, isLoading, isError, error } = useGetCallerLearningPlan();
  const markComplete = useMarkTaskComplete();
  const createPlan = useCreateLearningPlan();
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!plan && !isLoading && !isError) {
      createPlan.mutate(defaultPlan, {
        onError: (err) => {
          setCreateError(err.message || 'Failed to create learning plan');
        },
      });
    }
  }, [plan, isLoading, isError]);

  const completedTasks = plan?.completedTasks || [];

  if (isError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">4-Week Learning Plan</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Failed to load learning plan. Please try again.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (createError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">4-Week Learning Plan</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{createError}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <AsyncState isLoading={isLoading || (createPlan.isPending && !plan)}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">4-Week Learning Plan</h1>
          <p className="text-muted-foreground mt-2">Your personalized roadmap to success</p>
        </div>

        <div className="grid gap-6">
          {(plan?.plan || defaultPlan).map((week) => (
            <Card key={Number(week.weekNumber)}>
              <CardHeader>
                <CardTitle>Week {Number(week.weekNumber)}</CardTitle>
                <CardDescription>
                  {week.tasks.filter(t => completedTasks.includes(t.name)).length} of {week.tasks.length} tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {week.tasks.map((task) => {
                  const isCompleted = completedTasks.includes(task.name);
                  return (
                    <div key={task.name} className="flex items-start gap-3 p-3 rounded-lg border">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => markComplete.mutate(task.name)}
                        disabled={markComplete.isPending}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {task.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        {task.resourceLink && (
                          <a
                            href={task.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            View Resource <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AsyncState>
  );
}
