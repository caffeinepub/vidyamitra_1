import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brand } from '../components/Brand';
import { Rocket, Shield } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, loginStatus, identity } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
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
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in with Internet Identity to continue your career journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">Secure Authentication</p>
                <p className="text-purple-700 dark:text-purple-300">
                  Internet Identity provides secure, passwordless authentication powered by the Internet Computer blockchain.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2 h-12"
          >
            {isLoggingIn ? (
              <>
                <Rocket className="w-5 h-5 animate-bounce" />
                Connecting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Continue with Internet Identity
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/register' })}
              className="text-sm text-purple-600 hover:underline"
            >
              New to VidyaMitra? Learn more about registration
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
