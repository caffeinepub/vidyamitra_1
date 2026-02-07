import { useNavigate } from '@tanstack/react-router';
import { useCareerFlow } from '../state/careerFlowStore';
import { useGetCallerResumes } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';

export default function EligibilityCheckPage() {
  const navigate = useNavigate();
  const { jobRole } = useCareerFlow();
  const { data: resumes, isLoading, isError, error } = useGetCallerResumes();

  const hasResume = resumes && resumes.length > 0;
  const currentScore = hasResume ? 75 : 0;
  const threshold = 70;
  const isPassing = currentScore >= threshold;

  const improvementAreas = [
    'Add more relevant project experience',
    'Include certifications in cloud technologies',
    'Strengthen technical skills section',
    'Add quantifiable achievements'
  ];

  if (isError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Eligibility Check</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Failed to load resume data. Please try again.'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/dashboard' })} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!jobRole) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Eligibility Check</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a job role first to check your eligibility.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/job-role' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
          Select Job Role
        </Button>
      </div>
    );
  }

  if (!hasResume && !isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Eligibility Check</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Resume Required</p>
            <p className="text-muted-foreground mb-6 text-center">Please upload your resume to check eligibility for {jobRole}</p>
            <Button onClick={() => navigate({ to: '/resume' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AsyncState isLoading={isLoading}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Eligibility Check</h1>
          <p className="text-muted-foreground mt-2">Assessment for: {jobRole}</p>
        </div>

        <Card className={`border-2 ${isPassing ? 'border-green-500' : 'border-orange-500'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Eligibility Result</CardTitle>
                <CardDescription>Based on your resume analysis</CardDescription>
              </div>
              {isPassing ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-orange-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Your Score</span>
                <span className="font-bold text-2xl">{currentScore}%</span>
              </div>
              <Progress value={currentScore} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Threshold: {threshold}%</span>
                <Badge variant={isPassing ? 'default' : 'secondary'} className={isPassing ? 'bg-green-600' : 'bg-orange-600'}>
                  {isPassing ? 'Eligible' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>

            {!isPassing && (
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {improvementAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/learning-plan' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
                View Learning Plan →
              </Button>
              <Button onClick={() => navigate({ to: '/analysis' })} variant="outline">
                Back to Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AsyncState>
  );
}
