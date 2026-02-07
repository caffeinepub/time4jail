import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import AuthenticatedApp from './pages/AuthenticatedApp';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
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

  useEffect(() => {
    document.title = 'Time4jail';
  }, []);

  // Apply default theme for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      document.documentElement.setAttribute('data-theme', 'default_');
    }
  }, [isAuthenticated]);

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppShell isAuthenticated={isAuthenticated}>
      {showProfileSetup && <ProfileSetupModal />}
      {isAuthenticated && userProfile ? <AuthenticatedApp /> : <HomePage />}
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
