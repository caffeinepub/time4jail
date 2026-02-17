import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import AuthenticatedApp from './pages/AuthenticatedApp';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import PostLoginSplash from './components/auth/PostLoginSplash';
import { useGetCallerUserProfile } from './hooks/useQueries';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [showPostLoginSplash, setShowPostLoginSplash] = useState(false);
  const [lastPrincipal, setLastPrincipal] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Time4jail';
  }, []);

  // Apply default theme for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      document.documentElement.setAttribute('data-theme', 'default_');
    }
  }, [isAuthenticated]);

  // Show splash on login (keyed by principal to allow re-showing after logout/login)
  useEffect(() => {
    if (isAuthenticated && identity) {
      const currentPrincipal = identity.getPrincipal().toString();
      
      // If this is a new login (different principal or first login this session)
      if (currentPrincipal !== lastPrincipal) {
        setShowPostLoginSplash(true);
        setLastPrincipal(currentPrincipal);
      }
    } else {
      // Clear on logout
      setLastPrincipal(null);
    }
  }, [isAuthenticated, identity, lastPrincipal]);

  const handleDismissSplash = () => {
    setShowPostLoginSplash(false);
  };

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Development-only guard: log if authenticated user is seeing HomePage
  useEffect(() => {
    if (import.meta.env.DEV && isAuthenticated && !showPostLoginSplash) {
      console.warn(
        '⚠️ [DEV] Authenticated routing regression: User is authenticated but HomePage is being rendered. This should only happen briefly during profile setup flow.'
      );
    }
  }, [isAuthenticated, showPostLoginSplash]);

  return (
    <AppShell isAuthenticated={isAuthenticated}>
      {showProfileSetup && <ProfileSetupModal />}
      {showPostLoginSplash && <PostLoginSplash onDismiss={handleDismissSplash} />}
      {isAuthenticated ? <AuthenticatedApp /> : <HomePage />}
    </AppShell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
