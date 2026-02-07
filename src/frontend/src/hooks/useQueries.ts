import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  Incident, 
  StalkerProfile, 
  EvidenceFile, 
  EvidenceType,
  VictimSurvivorInfo,
  PoliceDepartment,
  UserSettings,
  IncidentId,
  FileId
} from '../backend';
import { ExternalBlob } from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Incidents
export function useGetCallerIncidents() {
  const { actor, isFetching } = useActor();

  return useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerIncidents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReportIncident() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reportIncident(title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

// Stalker Profiles
export function useGetCallerStalkerProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<StalkerProfile[]>({
    queryKey: ['stalkerProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerStalkerProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveStalkerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, notes }: { name: string; description: string; notes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveStalkerProfile(name, description, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stalkerProfiles'] });
    },
  });
}

// Evidence
export function useGetCallerEvidence() {
  const { actor, isFetching } = useActor();

  return useQuery<EvidenceFile[]>({
    queryKey: ['evidence'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerEvidence();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadEvidence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      evidenceType,
      file,
      incidentId,
    }: {
      title: string;
      description: string;
      evidenceType: EvidenceType;
      file: ExternalBlob;
      incidentId: IncidentId;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadEvidence(title, description, evidenceType, file, incidentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

// Victim/Survivor Info
export function useGetCallerVictimSurvivorInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<VictimSurvivorInfo | null>({
    queryKey: ['victimSurvivorInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerVictimSurvivorInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveVictimSurvivorInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: VictimSurvivorInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveVictimSurvivorInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victimSurvivorInfo'] });
    },
  });
}

// Police Departments
export function useGetCallerPoliceDepartments() {
  const { actor, isFetching } = useActor();

  return useQuery<PoliceDepartment[]>({
    queryKey: ['personalPoliceDepartments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerPoliceDepartments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVerifiedPoliceDepartments() {
  const { actor, isFetching } = useActor();

  return useQuery<PoliceDepartment[]>({
    queryKey: ['verifiedPoliceDepartments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedPoliceDepartments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePoliceDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      address,
      phone,
      website,
    }: {
      name: string;
      address: string;
      phone: string;
      website: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePoliceDepartment(name, address, phone, website);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalPoliceDepartments'] });
    },
  });
}

// User Settings
export function useGetCallerUserSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<UserSettings | null>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveUserSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}
