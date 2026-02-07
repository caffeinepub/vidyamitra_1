import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/' })} className="gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
