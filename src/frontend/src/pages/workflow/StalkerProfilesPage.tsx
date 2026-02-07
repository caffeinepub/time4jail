import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UserX, Clock } from 'lucide-react';
import { useGetCallerStalkerProfiles, useSaveStalkerProfile } from '../../hooks/useQueries';

export default function StalkerProfilesPage() {
  const { data: profiles = [], isLoading } = useGetCallerStalkerProfiles();
  const saveStalkerProfile = useSaveStalkerProfile();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveStalkerProfile.mutateAsync({ name, description, notes });
      setName('');
      setDescription('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save stalker profile:', error);
    }
  };

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
          <h2 className="text-3xl font-black">Stalker Profiles</h2>
          <p className="text-muted-foreground mt-1">
            Document information about individuals involved in stalking behavior
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Profile
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Create Stalker Profile</CardTitle>
            <CardDescription>
              Document identifying information and behavior patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name / Identifier *</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name or identifying information"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-description">Physical Description</Label>
                <Textarea
                  id="profile-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Physical appearance, distinguishing features, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-notes">Additional Notes</Label>
                <Textarea
                  id="profile-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Known addresses, vehicles, associates, patterns of behavior, etc."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saveStalkerProfile.isPending}>
                  {saveStalkerProfile.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
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

      {profiles.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <Card key={profile.id.toString()} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-destructive" />
                  {profile.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                    <p className="text-sm">{profile.description}</p>
                  </div>
                )}
                {profile.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{profile.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {profiles.length === 0 && !showForm && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserX className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">No profiles created yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create profiles to document stalker information
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
