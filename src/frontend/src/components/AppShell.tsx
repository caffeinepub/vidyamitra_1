import { ReactNode, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { protectedRoutes } from '../lib/routes';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import { Brand } from './Brand';

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const NavItems = () => (
    <>
      {protectedRoutes.map((route) => {
        const Icon = route.icon;
        const isActive = currentPath === route.path;
        return (
          <button
            key={route.path}
            onClick={() => {
              navigate({ to: route.path });
              setMobileOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md'
                : 'text-foreground/70 hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{route.label}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Brand />
                  </div>
                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItems />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Brand />
          </div>

          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-semibold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{userProfile.name}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card/50 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 p-4 space-y-2">
            <NavItems />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
