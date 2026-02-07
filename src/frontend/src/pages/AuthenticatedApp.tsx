import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentsPage from './workflow/IncidentsPage';
import EvidenceRecordPage from './workflow/EvidenceRecordPage';
import StalkerProfilesPage from './workflow/StalkerProfilesPage';
import MessageGeneratorPage from './workflow/MessageGeneratorPage';
import PoliceDepartmentsPage from './workflow/PoliceDepartmentsPage';
import VictimSurvivorInfoPage from './workflow/VictimSurvivorInfoPage';
import ResourcesPage from './workflow/ResourcesPage';
import InstallGuidePage from './workflow/InstallGuidePage';
import { useGetCallerUserSettings } from '../hooks/useQueries';

export default function AuthenticatedApp() {
  const { data: userSettings } = useGetCallerUserSettings();
  const [activeTab, setActiveTab] = useState('incidents');

  // Apply theme on load and when settings change
  useEffect(() => {
    if (userSettings?.visualTheme) {
      const theme = userSettings.visualTheme as string || 'default_';
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.setAttribute('data-theme', 'default_');
    }
  }, [userSettings]);

  // Sync tab with URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="police">Police</TabsTrigger>
          <TabsTrigger value="info">My Info</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <IncidentsPage />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceRecordPage />
        </TabsContent>

        <TabsContent value="profiles">
          <StalkerProfilesPage />
        </TabsContent>

        <TabsContent value="messages">
          <MessageGeneratorPage defaultTone={userSettings?.toneStyle} />
        </TabsContent>

        <TabsContent value="police">
          <PoliceDepartmentsPage />
        </TabsContent>

        <TabsContent value="info">
          <VictimSurvivorInfoPage />
        </TabsContent>

        <TabsContent value="resources">
          <ResourcesPage />
        </TabsContent>

        <TabsContent value="install">
          <InstallGuidePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
