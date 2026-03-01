import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Memory = {
    id : Nat;
    photoUrl : Text;
    voiceNoteUrl : Text;
    storyText : Text;
    subtitle : Text;
    location : Text;
    year : Nat;
    specialMemory : Bool;
    sceneType : Text;
    isSecret : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let memories = Map.empty<Nat, Memory>();
  let viewedMemoriesIds = Set.empty<Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ── User Profile Functions (required by instructions) ──────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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

  // ── Memory CRUD Functions ──────────────────────────────────────────────────

  /// Create a new memory. Admin only.
  public shared ({ caller }) func createMemory(memory : Memory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create memories");
    };
    memories.add(memory.id, memory);
  };

  /// Get a memory by ID.
  /// Secret memories are only visible to authenticated users (role: user or admin).
  /// Guests may only view non-secret memories.
  public query ({ caller }) func getMemoryById(id : Nat) : async ?Memory {
    switch (memories.get(id)) {
      case (null) { null };
      case (?memory) {
        if (memory.isSecret and not AccessControl.hasPermission(accessControlState, caller, #user)) {
          Runtime.trap("Unauthorized: Secret memories are only accessible to authenticated members");
        };
        ?memory;
      };
    };
  };

  /// Get all memories.
  /// Authenticated users (role: user or admin) see all memories including secret ones.
  /// Guests only see non-secret memories.
  public query ({ caller }) func getAllMemories() : async [Memory] {
    let isAuthenticatedUser = AccessControl.hasPermission(accessControlState, caller, #user);
    memories.values().filter(func(m : Memory) : Bool {
      if (m.isSecret) { isAuthenticatedUser } else { true };
    }).toArray();
  };

  /// Update an existing memory. Admin only.
  public shared ({ caller }) func updateMemory(id : Nat, memory : Memory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update memories");
    };
    switch (memories.get(id)) {
      case (null) {
        Runtime.trap("Memory not found");
      };
      case (?_existing) {
        memories.add(id, memory);
      };
    };
  };

  /// Delete a memory. Admin only.
  public shared ({ caller }) func deleteMemory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete memories");
    };
    if (not (memories.containsKey(id))) {
      Runtime.trap("Memory not found");
    };
    memories.remove(id);
  };

  /// Mark a memory as viewed. Requires authenticated user (member or admin).
  /// Guests cannot track viewed memories since the unlock logic is per-user session.
  public shared ({ caller }) func markMemoryViewed(memoryId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated members can mark memories as viewed");
    };
    viewedMemoriesIds.add(memoryId);
  };

  /// Get the count of viewed memories. Requires authenticated user.
  public query ({ caller }) func getViewedMemoriesCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated members can view this information");
    };
    viewedMemoriesIds.size();
  };

  /// Get all viewed memory IDs. Requires authenticated user.
  public query ({ caller }) func getViewedMemoryIds() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated members can view this information");
    };
    viewedMemoriesIds.toArray();
  };
};
