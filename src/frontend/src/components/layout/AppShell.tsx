import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import SettingsDialog from '../settings/SettingsDialog';

interface AppShellProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function AppShell({ children, isAuthenticated }: AppShellProps) {
  const { login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const isLoggingIn = loginStatus === 'logging-in';
  const authButtonText = isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header
        ref={(el) => {
          if (el && el.offsetHeight !== headerHeight) {
            setHeaderHeight(el.offsetHeight);
          }
        }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Time4jail
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
            >
              {authButtonText}
            </Button>
          </div>
        </div>
      </header>

      <main
        className="flex-1 container mx-auto px-4"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        {children}
      </main>

      <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Time4jail. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'time4jail'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {isAuthenticated && <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
