import { ReactNode } from 'react';
import { SiGithub, SiX } from 'react-icons/si';
import { Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SettingsDialog from '../settings/SettingsDialog';

interface AppShellProps {
  children: ReactNode;
  isAuthenticated?: boolean;
}

export default function AppShell({ children, isAuthenticated }: AppShellProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-black text-lg">T4J</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Time4jail
              </h1>
            </div>
            
            <nav className="flex items-center gap-4">
              {isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              )}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="w-5 h-5" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              © 2026. Built with{' '}
              <Heart className="w-3.5 h-3.5 fill-primary text-primary inline-block" />{' '}
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {isAuthenticated && (
        <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
