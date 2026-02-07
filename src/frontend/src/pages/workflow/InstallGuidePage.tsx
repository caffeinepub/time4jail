import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, Share, Plus, MoreVertical } from 'lucide-react';
import { SiApple, SiAndroid } from 'react-icons/si';

export default function InstallGuidePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-black">Install Guide</h2>
        <p className="text-muted-foreground mt-1">
          Install Time4jail as an app on your device for quick access
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiApple className="w-5 h-5" />
            iOS (iPhone/iPad)
          </CardTitle>
          <CardDescription>Install using Safari browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open this website in <strong>Safari</strong> (not Chrome or other browsers)</li>
            <li>
              Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> button at the bottom of the screen
            </li>
            <li>
              Scroll down and tap <Plus className="w-4 h-4 inline mx-1" /> <strong>"Add to Home Screen"</strong>
            </li>
            <li>Tap <strong>"Add"</strong> in the top right corner</li>
            <li>The app icon will appear on your home screen</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiAndroid className="w-5 h-5" />
            Android
          </CardTitle>
          <CardDescription>Install using Chrome browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open this website in <strong>Chrome</strong></li>
            <li>
              Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> <strong>menu</strong> button (three dots) in the top right
            </li>
            <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
            <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong> to confirm</li>
            <li>The app icon will appear on your home screen</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Desktop (Chrome, Edge, Brave)
          </CardTitle>
          <CardDescription>Install on Windows, Mac, or Linux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open this website in <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Brave</strong></li>
            <li>
              Look for the <Plus className="w-4 h-4 inline mx-1" /> <strong>install icon</strong> in the address bar (right side)
            </li>
            <li>Click the icon and then click <strong>"Install"</strong></li>
            <li>The app will open in its own window</li>
            <li>You can pin it to your taskbar or dock for easy access</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Why Install?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Quick Access:</strong> Launch the app directly from your home screen or desktop
          </p>
          <p>
            <strong>Full Screen:</strong> Works like a native app without browser toolbars
          </p>
          <p>
            <strong>Offline Ready:</strong> Access your data even without an internet connection
          </p>
          <p>
            <strong>Privacy:</strong> Runs in its own window, separate from your browser
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
