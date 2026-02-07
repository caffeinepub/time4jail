import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Copy, Download, FileText } from 'lucide-react';
import { generateEvidenceSummary, type EvidenceSummaryTone } from '../../utils/generateEvidenceSummary';
import { downloadTextFile } from '../../utils/download';
import type { EvidenceFile } from '../../backend';
import { toast } from 'sonner';

interface EvidenceSummaryDialogProps {
  evidence: EvidenceFile[];
  open: boolean;
  onClose: () => void;
}

export default function EvidenceSummaryDialog({ evidence, open, onClose }: EvidenceSummaryDialogProps) {
  const [tone, setTone] = useState<EvidenceSummaryTone>('plain');
  
  const summary = generateEvidenceSummary(evidence, tone);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Evidence summary copied to clipboard');
  };

  const handleDownload = () => {
    downloadTextFile(summary, 'evidence-summary.txt');
    toast.success('Evidence summary downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Evidence Summary
          </DialogTitle>
          <DialogDescription>
            A comprehensive summary of all documented evidence
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone-select">Report Tone</Label>
            <Select value={tone} onValueChange={(value) => setTone(value as EvidenceSummaryTone)}>
              <SelectTrigger id="tone-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain">Plain</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="urgent-feminine">Urgent (with a feminine touch)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <pre className="text-sm whitespace-pre-wrap font-mono">{summary}</pre>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download as Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
