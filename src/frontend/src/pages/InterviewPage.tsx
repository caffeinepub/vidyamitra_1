import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveInterviewFeedback } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MessageSquare, Mic, MicOff, AlertCircle } from 'lucide-react';

export default function InterviewPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveFeedback = useSaveInterviewFeedback();

  const question = 'Tell me about a challenging project you worked on and how you overcame obstacles.';

  const handleSubmit = () => {
    if (!answer.trim()) {
      setSaveError('Please provide an answer before submitting');
      return;
    }

    saveFeedback.mutate(
      {
        overallScore: BigInt(85),
        communication: BigInt(90),
        technicalKnowledge: BigInt(80),
        suggestions: 'Great communication skills. Consider adding more technical details about your problem-solving approach.',
      },
      {
        onSuccess: () => {
          setSaveError(null);
          setShowFeedback(true);
        },
        onError: (error) => {
          setSaveError(error.message || 'Failed to save interview feedback');
        },
      }
    );
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setAnswer('This is a simulated voice transcript. In production, this would use the Web Speech API.');
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleRetry = () => {
    setShowFeedback(false);
    setAnswer('');
    setSaveError(null);
  };

  if (showFeedback) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Interview Feedback</h1>
        
        {saveError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-center text-purple-600">85%</CardTitle>
            <CardDescription className="text-center">Overall Performance Score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>Communication</CardDescription>
                  <CardTitle className="text-3xl">90%</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Technical Knowledge</CardDescription>
                  <CardTitle className="text-3xl">80%</CardTitle>
                </CardHeader>
              </Card>
            </div>
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardHeader>
                <CardTitle className="text-lg">Suggestions for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Great communication skills. Consider adding more technical details about your problem-solving approach.
                </p>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Start New Interview
              </Button>
              <Button onClick={() => navigate({ to: '/progress' })} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500">
                View Progress →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mock Interview</h1>
        <p className="text-muted-foreground mt-2">Practice your interview skills</p>
      </div>

      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Interview Question</CardTitle>
          <CardDescription>{question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'voice')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Response</TabsTrigger>
              <TabsTrigger value="voice">Voice Response</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </TabsContent>
            <TabsContent value="voice" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  variant={isRecording ? 'destructive' : 'default'}
                  className="w-24 h-24 rounded-full"
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
                {answer && (
                  <Card className="w-full mt-4">
                    <CardHeader>
                      <CardTitle className="text-sm">Transcript</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{answer}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || saveFeedback.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500"
          >
            {saveFeedback.isPending ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
