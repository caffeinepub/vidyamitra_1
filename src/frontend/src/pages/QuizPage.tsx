import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveQuizResults } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Brain, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { QuizQuestion } from '../backend';
import { generateQuizQuestions } from '../utils/quiz';

type QuizStep = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<QuizStep>('setup');
  const [questionCount, setQuestionCount] = useState('5');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveResults = useSaveQuizResults();

  const handleSetup = () => {
    const count = parseInt(questionCount);
    if (isNaN(count) || count < 1 || count > 20) {
      return;
    }
    const generatedQuestions = generateQuizQuestions(count);
    setQuestions(generatedQuestions);
    setStep('active');
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        const score = newAnswers.filter((ans, idx) => 
          ans === Number(questions[idx].correctAnswerIndex)
        ).length;
        
        saveResults.mutate(
          {
            id: BigInt(Date.now()),
            questions: questions,
            score: BigInt(score),
            attempts: BigInt(1),
          },
          {
            onSuccess: () => {
              setSaveError(null);
              setStep('results');
            },
            onError: (error) => {
              setSaveError(error.message || 'Failed to save quiz results');
              setStep('results');
            },
          }
        );
      }
    }
  };

  const handleRetry = () => {
    setStep('setup');
    setQuestionCount('5');
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSaveError(null);
  };

  const score = step === 'results' ? answers.filter((ans, idx) => ans === Number(questions[idx].correctAnswerIndex)).length : 0;
  const percentage = step === 'results' ? Math.round((score / questions.length) * 100) : 0;

  if (step === 'setup') {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Knowledge Quiz</h1>
        <Card>
          <CardHeader>
            <Brain className="w-12 h-12 text-purple-600 mb-4" />
            <CardTitle>Test Your Knowledge</CardTitle>
            <CardDescription>Configure your quiz and assess your skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                placeholder="Enter number of questions (1-20)"
              />
              <p className="text-sm text-muted-foreground">Choose between 1 and 20 questions</p>
            </div>
            <Button 
              onClick={handleSetup} 
              className="bg-gradient-to-r from-purple-600 to-purple-500 w-full"
              disabled={!questionCount || parseInt(questionCount) < 1 || parseInt(questionCount) > 20}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Quiz Results</h1>
        
        {saveError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-center text-purple-600">{percentage}%</CardTitle>
            <CardDescription className="text-center">You scored {score} out of {questions.length}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={percentage} className="h-3" />
            
            <div className="space-y-4 mt-6">
              {questions.map((q, idx) => {
                const userAnswer = answers[idx];
                const correct = userAnswer === Number(q.correctAnswerIndex);
                return (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">{q.questionText}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Your answer: <span className={correct ? 'text-green-600' : 'text-red-600'}>{q.answerOptions[userAnswer]}</span>
                          </p>
                          {!correct && (
                            <p className="text-muted-foreground">
                              Correct answer: <span className="text-green-600">{q.answerOptions[Number(q.correctAnswerIndex)]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Take Another Quiz
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

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Quiz</h1>
        <p className="text-muted-foreground mt-2">Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle>{currentQ.questionText}</CardTitle>
          <CardDescription>Category: {currentQ.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => setSelectedAnswer(parseInt(val))}>
            {currentQ.answerOptions.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || saveResults.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500"
          >
            {saveResults.isPending ? 'Saving...' : currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
