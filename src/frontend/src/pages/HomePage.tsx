import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Clock, AlertTriangle, FileText, Eye, Scale, Unlock, ArrowRight } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { checkCtaClickability } from '../utils/landingCtaRegressionCheck';

export default function HomePage() {
  const { identity, login, isLoggingIn, loginStatus, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [loginQueued, setLoginQueued] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  // Development-only regression log when authenticated user sees HomePage
  useEffect(() => {
    if (import.meta.env.DEV && isAuthenticated) {
      console.error(
        '❌ [DEV] Authenticated-routing regression: HomePage is rendering while user is authenticated. User should be seeing AuthenticatedApp instead.'
      );
    }
  }, [isAuthenticated]);

  // Handle login with queuing for initialization
  const handleLogin = useCallback(() => {
    if (isInitializing) {
      // Queue the login to happen after initialization
      setLoginQueued(true);
    } else {
      setLoginQueued(false);
      login();
    }
  }, [isInitializing, login]);

  // Execute queued login when initialization completes
  if (loginQueued && !isInitializing && loginStatus === 'idle') {
    setLoginQueued(false);
    login();
  }

  // Navigate to Incidents tab in authenticated workflow
  const handleGoToIncidents = useCallback(() => {
    window.location.hash = 'incidents';
  }, []);

  // Button is disabled only during active login attempt or when queued
  const isButtonDisabled = isLoggingIn || loginQueued;
  const buttonText = isLoggingIn || loginQueued ? 'Connecting...' : 'Report him!';

  // Development-only regression check for CTA clickability
  useEffect(() => {
    if (import.meta.env.DEV && !isAuthenticated && ctaButtonRef.current) {
      const runCheck = () => {
        if (ctaButtonRef.current) {
          try {
            checkCtaClickability(ctaButtonRef.current);
          } catch (error) {
            console.error('❌ CTA Clickability Check Failed:', error);
          }
        }
      };

      // Run check after layout settles
      const timeoutId = setTimeout(runCheck, 500);

      // Re-run on resize/orientation changes
      window.addEventListener('resize', runCheck);
      window.addEventListener('orientationchange', runCheck);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', runCheck);
        window.removeEventListener('orientationchange', runCheck);
      };
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Your Evidence, Your Power</span>
        </div>
        
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Zero Tolerance for Stalking.
          <br />
          Document It All.
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          He thinks he can terrorize you without consequences. He's wrong. This platform arms women with AI-powered tools to build bulletproof documentation that puts stalkers behind bars. Every incident you record, every piece of evidence you upload becomes part of an unbreakable case file designed for one purpose: reporting him to authorities and supporting his prosecution. Your evidence is blockchain-secured, tamper-proof, and ready to help law enforcement hold him accountable—whether that means restraining orders, criminal charges, or jail time.
        </p>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button
              ref={ctaButtonRef}
              onClick={handleLogin}
              disabled={isButtonDisabled}
              size="lg"
              className="min-w-[200px] font-bold cursor-pointer"
              data-testid="landing-cta-report-button"
            >
              {isButtonDisabled ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  {buttonText}
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5 mr-2" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button
              onClick={handleGoToIncidents}
              size="lg"
              className="min-w-[200px] font-bold cursor-pointer"
              data-testid="authenticated-go-to-incidents-button"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Incidents
            </Button>
          </div>
        )}

        {loginStatus === 'loginError' && (
          <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm font-medium">Authentication failed. Please try again.</p>
            </div>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-black text-center mb-12">
          Built for Survivors Who Refuse to Stay Silent
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-black">Document Everything</CardTitle>
              <CardDescription className="mt-2">
                Record every incident, message, encounter, and threat. Build an ironclad timeline that proves the pattern of harassment and stalking behavior.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-black">Your Eyes Only</CardTitle>
              <CardDescription className="mt-2">
                Complete privacy guaranteed. Your documentation is encrypted and stored on the blockchain—no one can access, alter, or delete your evidence without your permission.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-black">Justice-Ready</CardTitle>
              <CardDescription className="mt-2">
                When you're ready to take legal action, your evidence is organized, timestamped, and tamper-proof—exactly what you need to hold him accountable.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
