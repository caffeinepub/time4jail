import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Copy } from 'lucide-react';
import { generateMessage, type MessageTone } from '../../utils/messageGenerator';
import { createSmsLink } from '../../utils/smsLink';
import { useGetCallerIncidents } from '../../hooks/useQueries';
import { formatIncidentReference } from '../../utils/incidentText';
import { toast } from 'sonner';
import type { Variant_assertiveWomen_directSafety_balanced } from '../../backend';

interface MessageGeneratorPageProps {
  defaultTone?: Variant_assertiveWomen_directSafety_balanced;
}

export default function MessageGeneratorPage({ defaultTone }: MessageGeneratorPageProps) {
  const { data: incidents = [] } = useGetCallerIncidents();
  const [tone, setTone] = useState<MessageTone>('firm');
  const [message, setMessage] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');

  useEffect(() => {
    if (defaultTone) {
      const toneMap: Record<string, MessageTone> = {
        balanced: 'calm',
        assertiveWomen: 'firm',
        directSafety: 'severe',
      };
      const defaultToneStr = defaultTone as string;
      const mappedTone = toneMap[defaultToneStr] || 'firm';
      setTone(mappedTone);
    }
  }, [defaultTone]);

  useEffect(() => {
    const incident = incidents.find(i => i.id.toString() === selectedIncidentId);
    const incidentRef = incident ? formatIncidentReference(incident) : undefined;
    setMessage(generateMessage(tone, incidentRef));
  }, [tone, selectedIncidentId, incidents]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const handleSendSms = () => {
    const smsUrl = createSmsLink(message);
    window.open(smsUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-black">Message Generator</h2>
        <p className="text-muted-foreground mt-1">
          Generate cease-and-desist messages with different tones
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Generate Message
          </CardTitle>
          <CardDescription>
            Select a tone and optionally include incident details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Message Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as MessageTone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calm">Calm - Professional and measured</SelectItem>
                <SelectItem value="firm">Firm - Direct and assertive</SelectItem>
                <SelectItem value="severe">Severe - Strong warning</SelectItem>
                <SelectItem value="very harsh">Very Harsh - Final notice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {incidents.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="incident">Include Incident Reference (Optional)</Label>
              <Select value={selectedIncidentId} onValueChange={setSelectedIncidentId}>
                <SelectTrigger id="incident">
                  <SelectValue placeholder="Select an incident" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {incidents.map((incident) => (
                    <SelectItem key={incident.id.toString()} value={incident.id.toString()}>
                      {incident.criminalActivityReportNumber} - {incident.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Generated Message (Editable)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendSms} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send via SMS
            </Button>
            <Button onClick={handleCopy} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              Note: Clicking "Send via SMS" will open your device's messaging app with this message pre-filled. 
              You can review and edit before sending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
