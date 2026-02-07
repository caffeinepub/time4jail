import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, FileText, Clock, Search } from 'lucide-react';
import { useGetCallerIncidents, useReportIncident } from '../../hooks/useQueries';
import { formatTimestamp, formatDateForInput } from '../../utils/datetime';
import IncidentDetailDrawer from './IncidentDetailDrawer';
import IncidentsSummaryPanel from './IncidentsSummaryPanel';
import type { Incident } from '../../backend';

export default function IncidentsPage() {
  const { data: incidents = [], isLoading } = useGetCallerIncidents();
  const reportIncident = useReportIncident();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await reportIncident.mutateAsync({ title, description });
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to report incident:', error);
    }
  };

  const sortedIncidents = [...incidents].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

  const filteredIncidents = sortedIncidents.filter(incident =>
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.criminalActivityReportNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-3xl font-black">Incident Reports</h2>
          <p className="text-muted-foreground mt-1">
            Document every incident with detailed notes and timestamps
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSummary(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Summarize All
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Report New Incident</CardTitle>
            <CardDescription>
              Document what happened with as much detail as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Incident Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of what happened"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident in detail: what happened, when, where, who was involved, any witnesses, etc."
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  A unique Criminal Activity Report Number will be automatically generated
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={reportIncident.isPending}>
                  {reportIncident.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Incident'
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

      {incidents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4">
            {filteredIncidents.map((incident) => (
              <Card
                key={incident.id.toString()}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedIncident(incident)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{incident.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {formatTimestamp(incident.timestamp)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {incident.criminalActivityReportNumber}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {incident.description}
                  </p>
                  {incident.evidenceIds.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary font-medium">
                        {incident.evidenceIds.length} evidence file{incident.evidenceIds.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {incidents.length === 0 && !showForm && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">No incidents reported yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start documenting incidents to build your case
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Report First Incident
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedIncident && (
        <IncidentDetailDrawer
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {showSummary && (
        <IncidentsSummaryPanel
          incidents={incidents}
          open={showSummary}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
