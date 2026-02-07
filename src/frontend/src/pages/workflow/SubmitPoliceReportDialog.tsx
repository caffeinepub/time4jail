import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Phone, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { PoliceDepartment, Incident, EvidenceFile } from '../../backend';
import { useGetCallerIncidents, useGetCallerEvidence } from '../../hooks/useQueries';
import { generatePoliceReport } from '../../utils/policeReport';
import { downloadTextFile } from '../../utils/download';
import type { EvidenceSummaryTone } from '../../utils/generateEvidenceSummary';

interface SubmitPoliceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalDepartments: PoliceDepartment[];
  verifiedDepartments: PoliceDepartment[];
}

export default function SubmitPoliceReportDialog({
  open,
  onOpenChange,
  personalDepartments,
  verifiedDepartments,
}: SubmitPoliceReportDialogProps) {
  const { data: incidents = [], isLoading: incidentsLoading } = useGetCallerIncidents();
  const { data: evidence = [], isLoading: evidenceLoading } = useGetCallerEvidence();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [evidenceTone, setEvidenceTone] = useState<EvidenceSummaryTone>('formal');

  // Combine all departments for selection
  const allDepartments = useMemo(() => {
    return [...personalDepartments, ...verifiedDepartments];
  }, [personalDepartments, verifiedDepartments]);

  const selectedDepartment = useMemo(() => {
    return allDepartments.find((d) => d.id.toString() === selectedDeptId);
  }, [allDepartments, selectedDeptId]);

  // Generate the report
  const reportText = useMemo(() => {
    return generatePoliceReport(incidents, evidence, evidenceTone, selectedDepartment);
  }, [incidents, evidence, evidenceTone, selectedDepartment]);

  const isLoading = incidentsLoading || evidenceLoading;
  const canSubmit = !!selectedDepartment;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      toast.success('Report copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy report. Please try again.');
    }
  };

  const handleDownload = () => {
    try {
      const filename = `police-report-${new Date().toISOString().split('T')[0]}.txt`;
      downloadTextFile(reportText, filename);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Failed to download:', error);
      toast.error('Failed to download report. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Submit Police Report</DialogTitle>
          <DialogDescription>
            Generate a comprehensive report combining your incidents and evidence for submission to a police department.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden flex flex-col">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department-select">Select Police Department *</Label>
            <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
              <SelectTrigger id="department-select">
                <SelectValue placeholder="Choose a department..." />
              </SelectTrigger>
              <SelectContent>
                {personalDepartments.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      My Saved
                    </div>
                    {personalDepartments.map((dept) => (
                      <SelectItem key={dept.id.toString()} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </>
                )}
                {verifiedDepartments.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Verified
                    </div>
                    {verifiedDepartments.map((dept) => (
                      <SelectItem key={dept.id.toString()} value={dept.id.toString()}>
                        {dept.name} (Verified)
                      </SelectItem>
                    ))}
                  </>
                )}
                {allDepartments.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No departments available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Tone Selection */}
          <div className="space-y-2">
            <Label htmlFor="evidence-tone">Evidence Summary Tone</Label>
            <Select value={evidenceTone} onValueChange={(v) => setEvidenceTone(v as EvidenceSummaryTone)}>
              <SelectTrigger id="evidence-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain">Plain - Straightforward facts</SelectItem>
                <SelectItem value="formal">Formal - Professional documentation</SelectItem>
                <SelectItem value="urgent">Urgent - Emphasizes safety concerns</SelectItem>
                <SelectItem value="urgent-feminine">Urgent Feminine - Safety-focused, supportive tone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert when no department selected */}
          {!selectedDepartment && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a police department to enable report actions.
              </AlertDescription>
            </Alert>
          )}

          {/* Report Preview */}
          <div className="flex-1 space-y-2 overflow-hidden flex flex-col">
            <Label>Report Preview</Label>
            <ScrollArea className="flex-1 border rounded-md">
              <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                {isLoading ? 'Loading report data...' : reportText}
              </pre>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Department-specific shortcuts */}
          {selectedDepartment && (
            <div className="flex gap-2 mr-auto">
              {selectedDepartment.phone && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${selectedDepartment.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
              {selectedDepartment.website && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={selectedDepartment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Website
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Main actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!canSubmit || isLoading}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!canSubmit || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
