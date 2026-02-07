import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Upload, FileText, Image, Video, Mic, FileIcon, Clock, ListChecks } from 'lucide-react';
import { useGetCallerEvidence, useUploadEvidence, useGetCallerIncidents } from '../../hooks/useQueries';
import { formatTimestamp } from '../../utils/datetime';
import { validateFile, fileToUint8Array } from '../../utils/files';
import { ExternalBlob, type EvidenceType } from '../../backend';
import EvidenceRecordDetail from './EvidenceRecordDetail';
import EvidenceSummaryDialog from './EvidenceSummaryDialog';
import type { EvidenceFile } from '../../backend';

export default function EvidenceRecordPage() {
  const { data: evidence = [], isLoading } = useGetCallerEvidence();
  const { data: incidents = [] } = useGetCallerIncidents();
  const uploadEvidence = useUploadEvidence();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState<string>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkedIncidentId, setLinkedIncidentId] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceFile | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile || !linkedIncidentId) return;

    try {
      const fileBytes = await fileToUint8Array(selectedFile);
      // Create a properly typed Uint8Array for ExternalBlob
      const typedArray = new Uint8Array(fileBytes) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(typedArray).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      let typeVariant: EvidenceType;
      switch (evidenceType) {
        case 'photo':
          typeVariant = { __kind__: 'photo', photo: null };
          break;
        case 'video':
          typeVariant = { __kind__: 'video', video: null };
          break;
        case 'audio':
          typeVariant = { __kind__: 'audio', audio: null };
          break;
        case 'screenshot':
          typeVariant = { __kind__: 'screenshot', screenshot: null };
          break;
        case 'document':
          typeVariant = { __kind__: 'document', document: null };
          break;
        default:
          typeVariant = { __kind__: 'other', other: evidenceType };
      }

      await uploadEvidence.mutateAsync({
        title,
        description,
        evidenceType: typeVariant,
        file: blob,
        incidentId: BigInt(linkedIncidentId),
      });

      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setLinkedIncidentId('');
      setUploadProgress(0);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      setUploadProgress(0);
    }
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    const kind = type.__kind__;
    switch (kind) {
      case 'photo':
      case 'screenshot':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };

  const sortedEvidence = [...evidence].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Clock className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Evidence Record</h2>
          <p className="text-muted-foreground mt-1">
            Upload and manage photos, videos, audio, and documents
          </p>
        </div>
        <div className="flex gap-2">
          {evidence.length > 0 && (
            <Button onClick={() => setShowSummary(true)} variant="outline">
              <ListChecks className="w-4 h-4 mr-2" />
              Summarize All
            </Button>
          )}
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Upload Evidence</CardTitle>
            <CardDescription>
              Attach evidence to an incident report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evidence-title">Title *</Label>
                <Input
                  id="evidence-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of this evidence"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-type">Evidence Type *</Label>
                <Select value={evidenceType} onValueChange={setEvidenceType}>
                  <SelectTrigger id="evidence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio Recording</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-file">File *</Label>
                <Input
                  id="evidence-file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-incident">Link to Incident *</Label>
                <Select value={linkedIncidentId} onValueChange={setLinkedIncidentId}>
                  <SelectTrigger id="evidence-incident">
                    <SelectValue placeholder="Select an incident" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidents.map((incident) => (
                      <SelectItem key={incident.id.toString()} value={incident.id.toString()}>
                        {incident.criminalActivityReportNumber} - {incident.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-description">Description (Optional)</Label>
                <Textarea
                  id="evidence-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context about this evidence"
                  rows={3}
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={uploadEvidence.isPending || !selectedFile}>
                  {uploadEvidence.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Evidence
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {evidence.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedEvidence.map((item) => (
            <Card
              key={item.id.toString()}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedEvidence(item)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0">
                    {getEvidenceIcon(item.evidenceType)}
                  </Badge>
                </div>
                <CardDescription>
                  {formatTimestamp(item.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {evidence.length === 0 && !showForm && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">No evidence uploaded yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start uploading photos, videos, and documents
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Evidence
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedEvidence && (
        <EvidenceRecordDetail
          evidence={selectedEvidence}
          open={!!selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}

      {showSummary && (
        <EvidenceSummaryDialog
          evidence={evidence}
          open={showSummary}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
