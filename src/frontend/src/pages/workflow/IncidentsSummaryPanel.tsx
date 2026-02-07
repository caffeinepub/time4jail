import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { generateIncidentSummary } from '../../utils/incidentSummary';
import { downloadTextFile } from '../../utils/download';
import type { Incident } from '../../backend';
import { toast } from 'sonner';

interface IncidentsSummaryPanelProps {
  incidents: Incident[];
  open: boolean;
  onClose: () => void;
}

export default function IncidentsSummaryPanel({ incidents, open, onClose }: IncidentsSummaryPanelProps) {
  const summary = generateIncidentSummary(incidents);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard');
  };

  const handleDownload = () => {
    downloadTextFile(summary, 'incident-summary.txt');
    toast.success('Summary downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Incident Summary
          </DialogTitle>
          <DialogDescription>
            A comprehensive timeline of all documented incidents
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
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
