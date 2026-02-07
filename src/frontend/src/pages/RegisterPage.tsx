import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brand } from '../components/Brand';
import { Rocket, Shield, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, loginStatus, identity } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleRegister = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message === 'User is already authenticated') {
        queryClient.clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Brand />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Get started with VidyaMitra using Internet Identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">No passwords to remember</p>
                <p className="text-muted-foreground">Internet Identity uses secure cryptographic authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Your data stays private</p>
                <p className="text-muted-foreground">Decentralized authentication on the Internet Computer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Quick setup</p>
                <p className="text-muted-foreground">Create your profile after authentication</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">How it works</p>
                <p className="text-purple-700 dark:text-purple-300">
                  Click below to create your Internet Identity. On first login, you'll set up your VidyaMitra profile with your name and preferences.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2 h-12"
          >
            {isLoggingIn ? (
              <>
                <Rocket className="w-5 h-5 animate-bounce" />
                Setting up...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Create Account with Internet Identity
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/login' })}
              className="text-sm text-purple-600 hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
