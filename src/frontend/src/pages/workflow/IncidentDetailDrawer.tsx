import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Clock } from 'lucide-react';
import { formatTimestamp } from '../../utils/datetime';
import type { Incident } from '../../backend';
import { toast } from 'sonner';

interface IncidentDetailDrawerProps {
  incident: Incident;
  open: boolean;
  onClose: () => void;
}

export default function IncidentDetailDrawer({ incident, open, onClose }: IncidentDetailDrawerProps) {
  const copyReportNumber = () => {
    navigator.clipboard.writeText(incident.criminalActivityReportNumber);
    toast.success('Report number copied to clipboard');
  };

  const getStatusLabel = (status: string): string => {
    return status;
  };

  const statusValue = incident.status as string;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{incident.title}</SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4" />
              {formatTimestamp(incident.timestamp)}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Criminal Activity Report Number</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                {incident.criminalActivityReportNumber}
              </Badge>
              <Button size="sm" variant="ghost" onClick={copyReportNumber}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
            <Badge variant={statusValue === 'open' ? 'default' : 'secondary'}>
              {getStatusLabel(statusValue)}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
            </div>
          </div>

          {incident.evidenceIds.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Evidence Files</h3>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {incident.evidenceIds.length} file{incident.evidenceIds.length !== 1 ? 's' : ''} attached
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
