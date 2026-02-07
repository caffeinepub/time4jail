import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Lock, Unlock, Shield, Clock, AlertTriangle, FileText, Eye, Scale } from 'lucide-react';

export default function HomePage() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

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
          You deserve safety and justice. This is your secure, private space to document every incident, organize your evidence, and prepare for legal action. AI-powered tools help women build comprehensive documentation that supports reporting to authorities and strengthens accountability through the legal system. Your evidence is stored safely on the blockchain—tamper-proof and always accessible when you need it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAuthenticated ? (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="min-w-[200px] font-bold"
            >
              {isLoggingIn ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5 mr-2" />
                  Start Documenting
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={clear}
              variant="outline"
              size="lg"
              className="min-w-[200px] font-bold"
            >
              <Lock className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          )}
        </div>

        {loginStatus === 'loginError' && (
          <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm font-medium">Authentication failed. Please try again.</p>
            </div>
          </div>
        )}
      </section>

      {/* Status Section */}
      {isAuthenticated && (
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black">You're Protected</CardTitle>
                  <CardDescription className="mt-2">
                    Your identity is secure and your documentation is private
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Secured
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  Principal: {identity.getPrincipal().toString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

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
