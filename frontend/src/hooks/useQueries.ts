import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Memory, UserProfile } from '../backend';

// ── User Profile ──────────────────────────────────────────────────────────────

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

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ── Memories ──────────────────────────────────────────────────────────────────

export function useGetAllMemories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Memory[]>({
    queryKey: ['memories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memory: Memory) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMemory(memory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useUpdateMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, memory }: { id: bigint; memory: Memory }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMemory(id, memory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMemory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useMarkMemoryViewed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memoryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markMemoryViewed(memoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewedMemoryIds'] });
      queryClient.invalidateQueries({ queryKey: ['viewedMemoriesCount'] });
    },
  });
}

export function useGetViewedMemoryIds() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['viewedMemoryIds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getViewedMemoryIds();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetViewedMemoriesCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['viewedMemoriesCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getViewedMemoriesCount();
    },
    enabled: !!actor && !actorFetching,
  });
}
