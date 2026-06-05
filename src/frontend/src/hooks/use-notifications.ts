import { createActor } from "@/backend";
import type { NotificationView, Page_2 } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMyNotifications(offset = 0n, limit = 50n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Page_2>({
    queryKey: ["myNotifications", offset.toString()],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, nextOffset: undefined };
      return actor.getMyNotifications(offset, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notifId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationRead(notifId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myNotifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.markAllNotificationsRead();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myNotifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}

export function useClearAllNotifications() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.clearAllNotifications();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myNotifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}

export type { NotificationView };
