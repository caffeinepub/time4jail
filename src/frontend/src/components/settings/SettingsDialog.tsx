import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserSettings, useSaveUserSettings, useSetMotivationalVideo } from '../../hooks/useQueries';
import { Clock, Upload, X, Video } from 'lucide-react';
import { UserSettings, Variant_redFeminineBold_default_womenSafety, Variant_assertiveWomen_directSafety_balanced } from '../../backend';
import { ExternalBlob } from '../../backend';
import { validateVideoFile, fileToUint8Array } from '../../utils/files';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { data: settings } = useGetCallerUserSettings();
  const saveSettings = useSaveUserSettings();
  const setMotivationalVideo = useSetMotivationalVideo();

  const [visualTheme, setVisualTheme] = useState<string>('default_');
  const [toneStyle, setToneStyle] = useState<string>('balanced');
  const [language, setLanguage] = useState('en');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [hasExistingVideo, setHasExistingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setVisualTheme(settings.visualTheme as string || 'default_');
      setToneStyle(settings.toneStyle as string || 'balanced');
      setLanguage(settings.language || 'en');
      setHasExistingVideo(!!settings.motivationalVideo);
    }
  }, [settings]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setVideoError(validation.error || 'Invalid video file');
      setVideoFile(null);
      return;
    }

    setVideoError(null);
    setVideoFile(file);
  };

  const handleClearVideo = () => {
    setVideoFile(null);
    setVideoError(null);
  };

  const handleRemoveExistingVideo = async () => {
    try {
      await setMotivationalVideo.mutateAsync(null);
      setHasExistingVideo(false);
    } catch (error) {
      console.error('Failed to remove video:', error);
      setVideoError('Failed to remove video');
    }
  };

  const handleSave = async () => {
    const themeVariant = visualTheme as Variant_redFeminineBold_default_womenSafety;
    const toneVariant = toneStyle as Variant_assertiveWomen_directSafety_balanced;

    const payload: UserSettings = {
      visualTheme: themeVariant,
      toneStyle: toneVariant,
      language,
    };

    try {
      await saveSettings.mutateAsync(payload);
      
      // Upload video if selected
      if (videoFile) {
        const bytes = await fileToUint8Array(videoFile);
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        await setMotivationalVideo.mutateAsync(blob);
      }
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', visualTheme);
      
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      setVideoError('Failed to save settings');
    }
  };

  const isSaving = saveSettings.isPending || setMotivationalVideo.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Visual Theme</Label>
            <RadioGroup value={visualTheme} onValueChange={setVisualTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default_" id="theme-default" />
                <Label htmlFor="theme-default" className="font-normal cursor-pointer">
                  Default - Balanced and professional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="womenSafety" id="theme-women" />
                <Label htmlFor="theme-women" className="font-normal cursor-pointer">
                  Women's Safety - Bold and empowering
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="redFeminineBold" id="theme-red" />
                <Label htmlFor="theme-red" className="font-normal cursor-pointer">
                  Red Feminine Bold - Personal and fierce
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tone-style">Default Message Tone</Label>
            <Select value={toneStyle} onValueChange={setToneStyle}>
              <SelectTrigger id="tone-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced - Professional and measured</SelectItem>
                <SelectItem value="assertiveWomen">Assertive Women - Direct and confident</SelectItem>
                <SelectItem value="directSafety">Direct Safety - Clear and firm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Motivational Video</Label>
            <p className="text-sm text-muted-foreground">
              Upload a video to see when you log in (MP4, max 50MB)
            </p>
            
            {hasExistingVideo && !videoFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm flex-1">Video set</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveExistingVideo}
                  disabled={setMotivationalVideo.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {videoFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm flex-1 truncate">{videoFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearVideo}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('video-upload')?.click()}
                disabled={isSaving}
              >
                <Upload className="w-4 h-4 mr-2" />
                {videoFile ? 'Change Video' : 'Upload Video'}
              </Button>
            </div>

            {videoError && (
              <p className="text-sm text-destructive">{videoError}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
