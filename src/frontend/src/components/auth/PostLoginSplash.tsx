import { Button } from '@/components/ui/button';
import { getRandomSplashMessage } from '@/utils/postLoginSplashMessages';
import { getRandomMugshotImage } from '@/utils/postLoginSplashImages';
import { useState, useEffect } from 'react';
import { useGetCallerUserSettings } from '@/hooks/useQueries';

interface PostLoginSplashProps {
  onDismiss: () => void;
}

export default function PostLoginSplash({ onDismiss }: PostLoginSplashProps) {
  const [message] = useState(() => getRandomSplashMessage());
  const [fallbackImage] = useState(() => getRandomMugshotImage());
  const { data: settings, isLoading: settingsLoading } = useGetCallerUserSettings();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (settings?.motivationalVideo) {
      try {
        const url = settings.motivationalVideo.getDirectURL();
        setVideoUrl(url);
      } catch (error) {
        console.error('Failed to load motivational video:', error);
        setVideoError(true);
      }
    }
  }, [settings]);

  const hasVideo = videoUrl && !videoError;

  if (settingsLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col items-center gap-6">
            <div className="w-full max-w-md aspect-square relative rounded-lg overflow-hidden border-2 border-border shadow-lg bg-muted animate-pulse" />
            <div className="text-center px-4 py-3 bg-muted/50 rounded-lg border border-border max-w-md w-full h-16 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="w-full max-w-md aspect-square relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
            {hasVideo ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={fallbackImage}
                alt="Reference"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="text-center px-4 py-3 bg-muted/50 rounded-lg border border-border max-w-md w-full">
            <p className="text-lg font-semibold text-foreground">
              {message}
            </p>
          </div>
          
          <Button
            onClick={onDismiss}
            size="lg"
            className="w-full max-w-xs"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
