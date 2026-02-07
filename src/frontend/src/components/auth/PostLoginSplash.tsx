import { Button } from '@/components/ui/button';
import { getRandomSplashMessage } from '@/utils/postLoginSplashMessages';
import { useState } from 'react';

interface PostLoginSplashProps {
  onDismiss: () => void;
}

export default function PostLoginSplash({ onDismiss }: PostLoginSplashProps) {
  // Select a random message once when the component mounts
  const [message] = useState(() => getRandomSplashMessage());

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="w-full max-w-md aspect-square relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
            <img
              src="/assets/5425a899ef3d6.image.jpg"
              alt="Reference"
              className="w-full h-full object-cover"
            />
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
