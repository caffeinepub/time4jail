import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, Save, Trash2 } from 'lucide-react';
import { useGetCallerVictimSurvivorInfo, useSaveVictimSurvivorInfo } from '../../hooks/useQueries';
import type { VictimSurvivorInfo } from '../../backend';

export default function VictimSurvivorInfoPage() {
  const { data: info, isLoading } = useGetCallerVictimSurvivorInfo();
  const saveInfo = useSaveVictimSurvivorInfo();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    if (info) {
      setName(info.name || '');
      setAge(info.age ? info.age.toString() : '');
      setGender(info.gender || '');
      setContactInfo(info.contactInfo || '');
      setEmergencyContact(info.emergencyContact || '');
      setAdditionalNotes(info.additionalNotes || '');
    }
  }, [info]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: VictimSurvivorInfo = {
      name: name.trim() || undefined,
      age: age.trim() ? BigInt(age) : undefined,
      gender: gender.trim() || undefined,
      contactInfo: contactInfo.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    try {
      await saveInfo.mutateAsync(payload);
    } catch (error) {
      console.error('Failed to save victim/survivor info:', error);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all your personal information?')) return;

    const emptyPayload: VictimSurvivorInfo = {};

    try {
      await saveInfo.mutateAsync(emptyPayload);
      setName('');
      setAge('');
      setGender('');
      setContactInfo('');
      setEmergencyContact('');
      setAdditionalNotes('');
    } catch (error) {
      console.error('Failed to clear victim/survivor info:', error);
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-black">Victim/Survivor Information</h2>
        <p className="text-muted-foreground mt-1">
          Optional personal details for your records
        </p>
      </div>

      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> All information you enter here is private to your account and stored securely on the blockchain. 
          No one else can access this data without your permission. All fields are optional.
        </AlertDescription>
      </Alert>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            All fields are optional. Only fill in what you're comfortable sharing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Your gender (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone, email, etc. (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name and contact info (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any other relevant information (optional)"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saveInfo.isPending}>
                {saveInfo.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Information
                  </>
                )}
              </Button>
              <Button type="button" variant="destructive" onClick={handleClear} disabled={saveInfo.isPending}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
