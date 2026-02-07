import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  type UserId = Principal;
  type Timestamp = Time.Time;
  type FileId = Nat;
  type IncidentId = Nat;

  type IncidentStatus = { #open; #closureRequested; #closed };

  type Incident = {
    id : IncidentId;
    title : Text;
    description : Text;
    timestamp : Timestamp;
    author : UserId;
    criminalActivityReportNumber : Text;
    status : IncidentStatus;
    evidenceIds : [FileId];
  };

  type StalkerProfile = {
    id : Nat;
    name : Text;
    description : Text;
    notes : Text;
  };

  type EvidenceType = {
    #photo;
    #audio;
    #video;
    #screenshot;
    #document;
    #other : Text;
  };

  type EvidenceFile = {
    id : FileId;
    title : Text;
    description : Text;
    evidenceType : EvidenceType;
    file : Storage.ExternalBlob;
    author : UserId;
    timestamp : Timestamp;
  };

  type VictimSurvivorInfo = {
    name : ?Text;
    age : ?Nat;
    gender : ?Text;
    contactInfo : ?Text;
    emergencyContact : ?Text;
    additionalNotes : ?Text;
  };

  type PoliceDepartment = {
    id : Nat;
    name : Text;
    address : Text;
    phone : Text;
    website : Text;
    isVerified : Bool;
    addedBy : UserId;
  };

  type UserSettings = {
    visualTheme : {
      #default;
      #womenSafety;
      #redFeminineBold;
    };
    language : Text;
    toneStyle : {
      #balanced;
      #assertiveWomen;
      #directSafety;
    };
  };

  public type UserProfile = {
    name : Text;
  };

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let incidents = Map.empty<IncidentId, Incident>();
  let stalkerProfiles = Map.empty<UserId, Map.Map<Nat, StalkerProfile>>();
  let evidenceFiles = Map.empty<FileId, EvidenceFile>();
  let victimSurvivorInfo = Map.empty<UserId, VictimSurvivorInfo>();
  let policeDepartments = Map.empty<Nat, PoliceDepartment>();
  let userSettings = Map.empty<UserId, UserSettings>();

  var nextIncidentId = 1;
  var nextStalkerProfileId = 1;
  var nextFileId = 1;
  var nextPoliceDeptId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Incident Management
  public shared ({ caller }) func reportIncident(title : Text, description : Text) : async Incident {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can report incidents");
    };

    let id = nextIncidentId;
    nextIncidentId += 1;

    let incident : Incident = {
      id;
      title;
      description;
      timestamp = Time.now();
      author = caller;
      criminalActivityReportNumber = "CRN_" # id.toText();
      status = #open;
      evidenceIds = [];
    };

    incidents.add(id, incident);
    incident;
  };

  public shared ({ caller }) func uploadEvidence(title : Text, description : Text, evidenceType : EvidenceType, file : Storage.ExternalBlob, incidentId : IncidentId) : async EvidenceFile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload evidence");
    };

    switch (incidents.get(incidentId)) {
      case (null) { Runtime.trap("Incident not found") };
      case (?incident) {
        // Verify ownership: only the incident author can add evidence
        if (incident.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only upload evidence to your own incidents");
        };

        let id = nextFileId;
        nextFileId += 1;

        let evidence : EvidenceFile = {
          id;
          title;
          description;
          evidenceType;
          file;
          author = caller;
          timestamp = Time.now();
        };

        evidenceFiles.add(id, evidence);

        let updatedEvidenceIds = List.fromArray<FileId>(incident.evidenceIds);
        updatedEvidenceIds.add(id);
        let updatedIncident = {
          incident with
          evidenceIds = updatedEvidenceIds.toArray();
        };
        incidents.add(incidentId, updatedIncident);

        evidence;
      };
    };
  };

  public shared ({ caller }) func saveStalkerProfile(name : Text, description : Text, notes : Text) : async StalkerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save stalker profiles");
    };

    let id = nextStalkerProfileId;
    nextStalkerProfileId += 1;

    let profile : StalkerProfile = {
      id;
      name;
      description;
      notes;
    };

    switch (stalkerProfiles.get(caller)) {
      case (null) {
        let newMap = Map.empty<Nat, StalkerProfile>();
        newMap.add(id, profile);
        stalkerProfiles.add(caller, newMap);
      };
      case (?profileMap) {
        profileMap.add(id, profile);
      };
    };

    profile;
  };

  public shared ({ caller }) func saveVictimSurvivorInfo(info : VictimSurvivorInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save victim/survivor info");
    };
    victimSurvivorInfo.add(caller, info);
  };

  public shared ({ caller }) func savePoliceDepartment(name : Text, address : Text, phone : Text, website : Text) : async PoliceDepartment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save police departments");
    };

    let id = nextPoliceDeptId;
    nextPoliceDeptId += 1;

    let department : PoliceDepartment = {
      id;
      name;
      address;
      phone;
      website;
      isVerified = false;
      addedBy = caller;
    };

    policeDepartments.add(id, department);
    department;
  };

  public shared ({ caller }) func verifyPoliceDepartment(deptId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify police departments");
    };

    switch (policeDepartments.get(deptId)) {
      case (null) { Runtime.trap("Police department not found") };
      case (?dept) {
        let verifiedDept = {
          dept with
          isVerified = true;
        };
        policeDepartments.add(deptId, verifiedDept);
      };
    };
  };

  public shared ({ caller }) func saveUserSettings(settings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save settings");
    };
    userSettings.add(caller, settings);
  };

  // Query functions with proper authorization
  public query ({ caller }) func getCallerIncidents() : async [Incident] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view incidents");
    };

    let userIncidents = List.empty<Incident>();
    for ((_, incident) in incidents.entries()) {
      if (incident.author == caller) {
        userIncidents.add(incident);
      };
    };
    userIncidents.toArray();
  };

  public query ({ caller }) func getAllIncidents() : async [Incident] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all incidents");
    };
    incidents.values().toArray();
  };

  public query ({ caller }) func getCallerEvidence() : async [EvidenceFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view evidence");
    };

    let userEvidence = List.empty<EvidenceFile>();
    for ((_, evidence) in evidenceFiles.entries()) {
      if (evidence.author == caller) {
        userEvidence.add(evidence);
      };
    };
    userEvidence.toArray();
  };

  public query ({ caller }) func getAllEvidence() : async [EvidenceFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all evidence");
    };
    evidenceFiles.values().toArray();
  };

  public query ({ caller }) func getCallerStalkerProfiles() : async [StalkerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view stalker profiles");
    };

    switch (stalkerProfiles.get(caller)) {
      case (null) { [] };
      case (?profileMap) { profileMap.values().toArray() };
    };
  };

  public query ({ caller }) func getCallerVictimSurvivorInfo() : async ?VictimSurvivorInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view victim/survivor info");
    };
    victimSurvivorInfo.get(caller);
  };

  public query ({ caller }) func getVerifiedPoliceDepartments() : async [PoliceDepartment] {
    // Anyone can view verified departments
    let verifiedDepts = List.empty<PoliceDepartment>();
    for ((_, dept) in policeDepartments.entries()) {
      if (dept.isVerified) {
        verifiedDepts.add(dept);
      };
    };
    verifiedDepts.toArray();
  };

  public query ({ caller }) func getCallerPoliceDepartments() : async [PoliceDepartment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their saved police departments");
    };

    let userDepts = List.empty<PoliceDepartment>();
    for ((_, dept) in policeDepartments.entries()) {
      if (dept.addedBy == caller) {
        userDepts.add(dept);
      };
    };
    userDepts.toArray();
  };

  public query ({ caller }) func getAllPoliceDepartments() : async [PoliceDepartment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all police departments");
    };
    policeDepartments.values().toArray();
  };

  public query ({ caller }) func getCallerUserSettings() : async ?UserSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view settings");
    };
    userSettings.get(caller);
  };

  public query ({ caller }) func getIncidentById(id : IncidentId) : async ?Incident {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view incidents");
    };

    switch (incidents.get(id)) {
      case (null) { null };
      case (?incident) {
        // Users can only view their own incidents, admins can view all
        if (incident.author == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?incident;
        } else {
          Runtime.trap("Unauthorized: Can only view your own incidents");
        };
      };
    };
  };

  public query ({ caller }) func getEvidenceById(id : FileId) : async ?EvidenceFile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view evidence");
    };

    switch (evidenceFiles.get(id)) {
      case (null) { null };
      case (?evidence) {
        // Users can only view their own evidence, admins can view all
        if (evidence.author == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?evidence;
        } else {
          Runtime.trap("Unauthorized: Can only view your own evidence");
        };
      };
    };
  };

  public query ({ caller }) func getUserIncidents(user : Principal) : async [Incident] {
    // Only admins or the user themselves can view user incidents
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own incidents");
    };

    let userIncidents = List.empty<Incident>();
    for ((_, incident) in incidents.entries()) {
      if (incident.author == user) {
        userIncidents.add(incident);
      };
    };
    userIncidents.toArray();
  };

  public query ({ caller }) func getUserPoliceDepartments(user : Principal) : async [PoliceDepartment] {
    // Only admins or the user themselves can view user's saved departments
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own saved police departments");
    };

    let userDepts = List.empty<PoliceDepartment>();
    for ((_, dept) in policeDepartments.entries()) {
      if (dept.addedBy == user) {
        userDepts.add(dept);
      };
    };
    userDepts.toArray();
  };
};

