import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Image, Video, Mic, FileText, FileIcon, Clock } from 'lucide-react';
import { formatTimestamp } from '../../utils/datetime';
import type { EvidenceFile, EvidenceType } from '../../backend';

interface EvidenceRecordDetailProps {
  evidence: EvidenceFile;
  open: boolean;
  onClose: () => void;
}

export default function EvidenceRecordDetail({ evidence, open, onClose }: EvidenceRecordDetailProps) {
  const fileUrl = evidence.file.getDirectURL();
  const evidenceKind = evidence.evidenceType.__kind__;

  const getEvidenceIcon = (type: EvidenceType) => {
    const kind = type.__kind__;
    switch (kind) {
      case 'photo':
      case 'screenshot':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Mic className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  const renderPreview = () => {
    if (evidenceKind === 'photo' || evidenceKind === 'screenshot') {
      return (
        <div className="rounded-lg overflow-hidden border border-border">
          <img src={fileUrl} alt={evidence.title} className="w-full h-auto" />
        </div>
      );
    }

    if (evidenceKind === 'video') {
      return (
        <div className="rounded-lg overflow-hidden border border-border">
          <video src={fileUrl} controls className="w-full h-auto">
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (evidenceKind === 'audio') {
      return (
        <div className="p-4 rounded-lg border border-border bg-muted/50">
          <audio src={fileUrl} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-lg border border-border bg-muted/50 text-center">
        <FileIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            {getEvidenceIcon(evidence.evidenceType)}
            {evidence.title}
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4" />
              {formatTimestamp(evidence.timestamp)}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Evidence Type</h3>
            <Badge variant="outline">
              {evidenceKind === 'other' && evidence.evidenceType.__kind__ === 'other'
                ? evidence.evidenceType.other
                : evidenceKind}
            </Badge>
          </div>

          {evidence.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm whitespace-pre-wrap">{evidence.description}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Preview</h3>
            {renderPreview()}
          </div>

          <Button asChild className="w-full">
            <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
