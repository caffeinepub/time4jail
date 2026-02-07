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

const POST_LOGIN_SPLASH_KEY = 'time4jail_post_login_splash_shown';

function AppContent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [showPostLoginSplash, setShowPostLoginSplash] = useState(false);

  useEffect(() => {
    document.title = 'Time4jail';
  }, []);

  // Apply default theme for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      document.documentElement.setAttribute('data-theme', 'default_');
    }
  }, [isAuthenticated]);

  // Check if we should show the post-login splash
  useEffect(() => {
    if (isAuthenticated) {
      const splashShown = sessionStorage.getItem(POST_LOGIN_SPLASH_KEY);
      if (!splashShown) {
        setShowPostLoginSplash(true);
      }
    }
  }, [isAuthenticated]);

  const handleDismissSplash = () => {
    sessionStorage.setItem(POST_LOGIN_SPLASH_KEY, 'true');
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
