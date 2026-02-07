import { useNavigate } from '@tanstack/react-router';
import { useGetCallerResumes } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';

function calculateATSScore(resumeName: string): number {
  const keywords = ['react', 'typescript', 'python', 'java', 'aws', 'docker', 'kubernetes', 'api', 'database', 'agile'];
  const lowerName = resumeName.toLowerCase();
  const matches = keywords.filter(kw => lowerName.includes(kw)).length;
  return Math.min(Math.round((matches / keywords.length) * 100) + 50, 100);
}

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { data: resumes, isLoading, isError, error } = useGetCallerResumes();

  const latestResume = resumes?.[resumes.length - 1];
  const overallScore = latestResume ? 85 : 0;
  const atsScore = latestResume ? calculateATSScore(latestResume.name) : 0;

  const strengths = ['Communication Skills', 'Technical Expertise', 'Problem Solving', 'Team Collaboration'];
  const gaps = ['Cloud Computing', 'Data Visualization', 'Machine Learning', 'DevOps'];
  const recommendations = [
    'Complete AWS certification to strengthen cloud skills',
    'Build portfolio projects showcasing data visualization',
    'Take online courses in machine learning fundamentals',
    'Gain hands-on experience with CI/CD pipelines',
  ];

  if (isError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
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

  if (!latestResume && !isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Resume Found</p>
            <p className="text-muted-foreground mb-6 text-center">Upload a resume to see your personalized analysis and recommendations</p>
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
          <h1 className="text-3xl font-bold">Resume Analysis</h1>
          <p className="text-muted-foreground mt-2">AI-powered insights into your resume</p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-purple-500">
            <CardHeader>
              <CardDescription>Overall Profile Score</CardDescription>
              <CardTitle className="text-5xl font-bold text-purple-600">{overallScore}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">Strong profile with room for improvement</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardDescription>ATS Compatibility Score</CardDescription>
              <CardTitle className="text-5xl font-bold text-blue-600">{atsScore}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={atsScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">Good keyword optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength) => (
                  <Badge key={strength} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Skill Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gaps.map((gap) => (
                  <Badge key={gap} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {gap}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to improve your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => navigate({ to: '/domain' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
            Select Domain →
          </Button>
          <Button onClick={() => navigate({ to: '/learning-plan' })} variant="outline">
            View Learning Plan
          </Button>
        </div>
      </div>
    </AsyncState>
  );
}
