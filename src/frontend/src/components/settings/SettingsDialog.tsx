import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserSettings, useSaveUserSettings } from '../../hooks/useQueries';
import { Clock } from 'lucide-react';
import { UserSettings, Variant_redFeminineBold_default_womenSafety, Variant_assertiveWomen_directSafety_balanced } from '../../backend';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { data: settings } = useGetCallerUserSettings();
  const saveSettings = useSaveUserSettings();

  const [visualTheme, setVisualTheme] = useState<string>('default_');
  const [toneStyle, setToneStyle] = useState<string>('balanced');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (settings) {
      setVisualTheme(settings.visualTheme as string || 'default_');
      setToneStyle(settings.toneStyle as string || 'balanced');
      setLanguage(settings.language || 'en');
    }
  }, [settings]);

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
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', visualTheme);
      
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saveSettings.isPending} className="flex-1">
              {saveSettings.isPending ? (
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
