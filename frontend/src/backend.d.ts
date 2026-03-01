import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Memory {
    id: bigint;
    storyText: string;
    specialMemory: boolean;
    voiceNoteUrl: string;
    year: bigint;
    photoUrl: string;
    sceneType: string;
    isSecret: boolean;
    location: string;
    subtitle: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Create a new memory. Admin only.
     */
    createMemory(memory: Memory): Promise<void>;
    /**
     * / Delete a memory. Admin only.
     */
    deleteMemory(id: bigint): Promise<void>;
    /**
     * / Get all memories.
     * / Authenticated users (role: user or admin) see all memories including secret ones.
     * / Guests only see non-secret memories.
     */
    getAllMemories(): Promise<Array<Memory>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get a memory by ID.
     * / Secret memories are only visible to authenticated users (role: user or admin).
     * / Guests may only view non-secret memories.
     */
    getMemoryById(id: bigint): Promise<Memory | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / Get the count of viewed memories. Requires authenticated user.
     */
    getViewedMemoriesCount(): Promise<bigint>;
    /**
     * / Get all viewed memory IDs. Requires authenticated user.
     */
    getViewedMemoryIds(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Mark a memory as viewed. Requires authenticated user (member or admin).
     * / Guests cannot track viewed memories since the unlock logic is per-user session.
     */
    markMemoryViewed(memoryId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Update an existing memory. Admin only.
     */
    updateMemory(id: bigint, memory: Memory): Promise<void>;
}
