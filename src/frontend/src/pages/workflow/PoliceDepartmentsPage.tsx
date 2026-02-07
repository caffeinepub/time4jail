import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search as SearchIcon, Shield, Clock, ExternalLink, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useGetCallerPoliceDepartments, useGetVerifiedPoliceDepartments, useSavePoliceDepartment } from '../../hooks/useQueries';
import { openGoogleSearch } from '../../utils/googleSearch';
import SubmitPoliceReportDialog from './SubmitPoliceReportDialog';

export default function PoliceDepartmentsPage() {
  const { data: personalDepts = [], isLoading: personalLoading } = useGetCallerPoliceDepartments();
  const { data: verifiedDepts = [], isLoading: verifiedLoading } = useGetVerifiedPoliceDepartments();
  const savePoliceDepartment = useSavePoliceDepartment();

  const [showForm, setShowForm] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaveError(null);
    setSaveSuccess(false);

    try {
      await savePoliceDepartment.mutateAsync({ name, address, phone, website });
      
      // Show success feedback
      setSaveSuccess(true);
      
      // Reset form and close after brief delay
      setTimeout(() => {
        setName('');
        setAddress('');
        setPhone('');
        setWebsite('');
        setShowForm(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to save police department:', error);
      
      // Parse error message for user-friendly display
      let errorMessage = 'Failed to save police department. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'You must be logged in to save police departments.';
        } else if (error.message.includes('Actor not available')) {
          errorMessage = 'Connection error. Please refresh the page and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setSaveError(errorMessage);
    }
  };

  const handleGoogleSearch = () => {
    openGoogleSearch(searchCity, searchState, 'police department');
  };

  const isLoading = personalLoading || verifiedLoading;

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
          <h2 className="text-3xl font-black">Police Departments</h2>
          <p className="text-muted-foreground mt-1">
            Find and save police department contact information
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSubmitDialog(true)} size="lg">
            <FileText className="w-4 h-4 mr-2" />
            Submit report
          </Button>
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="w-5 h-5" />
            Search Police Departments
          </CardTitle>
          <CardDescription>
            Use Google to find local police departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-city">City</Label>
              <Input
                id="search-city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-state">State</Label>
              <Input
                id="search-state"
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                placeholder="Enter state"
              />
            </div>
          </div>
          <Button onClick={handleGoogleSearch} variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            Search on Google
          </Button>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Add Police Department</CardTitle>
            <CardDescription>
              Manually add a police department to your saved list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {saveError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}

              {saveSuccess && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Police department saved successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="dept-name">Department Name *</Label>
                <Input
                  id="dept-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Los Angeles Police Department"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept-address">Address</Label>
                <Input
                  id="dept-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city, state, zip"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept-phone">Phone Number</Label>
                <Input
                  id="dept-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept-website">Website</Label>
                <Input
                  id="dept-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={savePoliceDepartment.isPending || saveSuccess}>
                  {savePoliceDepartment.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    'Save Department'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
                  disabled={savePoliceDepartment.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">My Saved ({personalDepts.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedDepts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          {personalDepts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {personalDepts.map((dept) => (
                <Card key={dept.id.toString()} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {dept.address && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Address: </span>
                        {dept.address}
                      </div>
                    )}
                    {dept.phone && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Phone: </span>
                        <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                          {dept.phone}
                        </a>
                      </div>
                    )}
                    {dept.website && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Website: </span>
                        <a
                          href={dept.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-2">No saved departments yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add police departments to your personal list
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          {verifiedDepts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {verifiedDepts.map((dept) => (
                <Card key={dept.id.toString()} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {dept.address && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Address: </span>
                        {dept.address}
                      </div>
                    )}
                    {dept.phone && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Phone: </span>
                        <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                          {dept.phone}
                        </a>
                      </div>
                    )}
                    {dept.website && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Website: </span>
                        <a
                          href={dept.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-2">No verified departments yet</h3>
                <p className="text-sm text-muted-foreground">
                  Verified departments will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <SubmitPoliceReportDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        personalDepartments={personalDepts}
        verifiedDepartments={verifiedDepts}
      />
    </div>
  );
}
