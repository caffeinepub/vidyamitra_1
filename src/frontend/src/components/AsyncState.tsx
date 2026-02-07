import { ReactNode } from 'react';
import { LoadingRocket } from './LoadingRocket';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface AsyncStateProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: () => void;
  emptyActionLabel?: string;
  children: ReactNode;
}

export function AsyncState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  emptyAction,
  emptyActionLabel = 'Get Started',
  children,
}: AsyncStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingRocket />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'Something went wrong. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptyAction && (
          <Button onClick={emptyAction} className="bg-gradient-to-r from-purple-600 to-purple-500">
            {emptyActionLabel}
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
