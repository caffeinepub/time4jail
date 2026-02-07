import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export type IncidentId = bigint;
export interface Incident {
    id: IncidentId;
    status: IncidentStatus;
    title: string;
    criminalActivityReportNumber: string;
    description: string;
    author: UserId;
    timestamp: Timestamp;
    evidenceIds: Array<FileId>;
}
export type EvidenceType = {
    __kind__: "audio";
    audio: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "video";
    video: null;
} | {
    __kind__: "document";
    document: null;
} | {
    __kind__: "photo";
    photo: null;
} | {
    __kind__: "screenshot";
    screenshot: null;
};
export type UserId = Principal;
export interface VictimSurvivorInfo {
    age?: bigint;
    contactInfo?: string;
    additionalNotes?: string;
    name?: string;
    emergencyContact?: string;
    gender?: string;
}
export interface UserSettings {
    language: string;
    toneStyle: Variant_assertiveWomen_directSafety_balanced;
    visualTheme: Variant_redFeminineBold_default_womenSafety;
}
export interface StalkerProfile {
    id: bigint;
    name: string;
    description: string;
    notes: string;
}
export type FileId = bigint;
export interface EvidenceFile {
    id: FileId;
    title: string;
    file: ExternalBlob;
    description: string;
    author: UserId;
    timestamp: Timestamp;
    evidenceType: EvidenceType;
}
export interface PoliceDepartment {
    id: bigint;
    name: string;
    website: string;
    isVerified: boolean;
    addedBy: UserId;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum IncidentStatus {
    closed = "closed",
    open = "open",
    closureRequested = "closureRequested"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_assertiveWomen_directSafety_balanced {
    assertiveWomen = "assertiveWomen",
    directSafety = "directSafety",
    balanced = "balanced"
}
export enum Variant_redFeminineBold_default_womenSafety {
    redFeminineBold = "redFeminineBold",
    default_ = "default",
    womenSafety = "womenSafety"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllEvidence(): Promise<Array<EvidenceFile>>;
    getAllIncidents(): Promise<Array<Incident>>;
    getAllPoliceDepartments(): Promise<Array<PoliceDepartment>>;
    getCallerEvidence(): Promise<Array<EvidenceFile>>;
    getCallerIncidents(): Promise<Array<Incident>>;
    getCallerPoliceDepartments(): Promise<Array<PoliceDepartment>>;
    getCallerStalkerProfiles(): Promise<Array<StalkerProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerUserSettings(): Promise<UserSettings | null>;
    getCallerVictimSurvivorInfo(): Promise<VictimSurvivorInfo | null>;
    getEvidenceById(id: FileId): Promise<EvidenceFile | null>;
    getIncidentById(id: IncidentId): Promise<Incident | null>;
    getUserIncidents(user: Principal): Promise<Array<Incident>>;
    getUserPoliceDepartments(user: Principal): Promise<Array<PoliceDepartment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedPoliceDepartments(): Promise<Array<PoliceDepartment>>;
    isCallerAdmin(): Promise<boolean>;
    reportIncident(title: string, description: string): Promise<Incident>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePoliceDepartment(name: string, address: string, phone: string, website: string): Promise<PoliceDepartment>;
    saveStalkerProfile(name: string, description: string, notes: string): Promise<StalkerProfile>;
    saveUserSettings(settings: UserSettings): Promise<void>;
    saveVictimSurvivorInfo(info: VictimSurvivorInfo): Promise<void>;
    uploadEvidence(title: string, description: string, evidenceType: EvidenceType, file: ExternalBlob, incidentId: IncidentId): Promise<EvidenceFile>;
    verifyPoliceDepartment(deptId: bigint): Promise<void>;
}
