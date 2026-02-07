import { Rocket } from 'lucide-react';

export function LoadingRocket() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Rocket className="w-12 h-12 text-purple-600 animate-bounce" />
        <div className="absolute inset-0 bg-purple-400 blur-xl opacity-50 animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
