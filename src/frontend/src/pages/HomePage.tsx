import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brand } from '../components/Brand';
import { Rocket, GraduationCap, Target, TrendingUp, FileText, Brain } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative px-4 py-20 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <Rocket className="w-4 h-4" />
                AI-Powered Career Mentor
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Career with{' '}
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  VidyaMitra
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Your intelligent career companion for resume evaluation, skill mapping, mock interviews, and
                personalized learning plans. Powered by AI to help you achieve your career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate({ to: '/dashboard' })}
                      className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2"
                    >
                      <GraduationCap className="w-5 h-5" />
                      Go to Dashboard
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate({ to: '/resume' })}
                      className="gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Upload Resume
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate({ to: '/login' })}
                      className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                    >
                      Get Started
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate({ to: '/register' })}>
                      Learn More
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/assets/generated/vidyamitra-hero.dim_1600x900.png"
                alt="VidyaMitra Hero"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Career Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to evaluate, improve, and track your career progress in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <FileText className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Resume Evaluation</CardTitle>
                <CardDescription>
                  AI-powered analysis of your resume with ATS score checking and improvement suggestions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Target className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Identify missing skills and get personalized recommendations for your target role
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <GraduationCap className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Learning Plans</CardTitle>
                <CardDescription>
                  4-week personalized learning roadmaps with curated resources and progress tracking
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Brain className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Mock Interviews</CardTitle>
                <CardDescription>
                  Practice with AI-powered interviews in text or voice mode with detailed feedback
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey with comprehensive analytics and achievement tracking
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Rocket className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Career Transition</CardTitle>
                <CardDescription>
                  Get guidance for career shifts with transferable skills analysis and roadmaps
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-500">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Join VidyaMitra today and start your journey towards your dream career with AI-powered guidance
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/login' })}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t bg-card/50">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
