import {
  type ActivityLogView,
  type AdminRole,
  type FlagStatus,
  type FlagView,
  type InviteView,
  type RoleEntry,
  createActor,
} from "@/backend";
import type { LockoutStatus } from "@/backend";
import type {
  Comment,
  CommentId,
  CreatePostInput,
  CreateProfileInput,
  PostId,
  PostView,
  ProfileView,
  UpdateProfileInput,
  UserId,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBackendActor() {
  return useActor(createActor);
}

// ─── Profile Queries ──────────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ProfileView | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useProfile(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  const id = userId?.toString();
  return useQuery<ProfileView | null>({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 60_000,
  });
}

export function useProfileByUsername(username: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ProfileView | null>({
    queryKey: ["profileByUsername", username],
    queryFn: async () => {
      if (!actor || !username) return null;
      return actor.getProfileByUsername(username);
    },
    enabled: !!actor && !isFetching && !!username,
    staleTime: 60_000,
  });
}

export function useSearchUsers(keyword: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ProfileView[]>({
    queryKey: ["searchUsers", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      return actor.searchUsers(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
    staleTime: 10_000,
  });
}

export function useListProfiles(offset = 0n, limit = 20n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["listProfiles", offset.toString(), limit.toString()],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, nextOffset: undefined };
      return actor.listProfiles(offset, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateProfile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProfileInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProfile(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProfile(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Post Queries ─────────────────────────────────────────────────────────────

export function useFeedPosts(offset = 0n, limit = 20n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["feedPosts", offset.toString()],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, nextOffset: undefined };
      return actor.getFeed(offset, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAllPosts(offset = 0n, limit = 20n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allPosts", offset.toString()],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, nextOffset: undefined };
      return actor.listAllPosts(offset, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUserPosts(
  userId: UserId | null | undefined,
  offset = 0n,
  limit = 20n,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["userPosts", userId?.toString(), offset.toString()],
    queryFn: async () => {
      if (!actor || !userId)
        return { items: [], total: 0n, nextOffset: undefined };
      return actor.listPostsByUser(userId, offset, limit);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function usePost(postId: PostId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PostView | null>({
    queryKey: ["post", postId?.toString()],
    queryFn: async () => {
      if (!actor || !postId) return null;
      return actor.getPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
    staleTime: 60_000,
  });
}

export function useSearchPosts(keyword: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PostView[]>({
    queryKey: ["searchPosts", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      return actor.searchPosts(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
    staleTime: 10_000,
  });
}

export function useCreatePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedPosts"] });
      qc.invalidateQueries({ queryKey: ["allPosts"] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedPosts"] });
      qc.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
}

export function useToggleLike() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleLike(postId);
    },
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["post", postId.toString()] });
      qc.invalidateQueries({ queryKey: ["feedPosts"] });
      qc.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
}

// ─── Comment Queries ──────────────────────────────────────────────────────────

export function useComments(postId: PostId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Comment[]>({
    queryKey: ["comments", postId?.toString()],
    queryFn: async () => {
      if (!actor || !postId) return [];
      return actor.listComments(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
    staleTime: 30_000,
  });
}

export function useAddComment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: { postId: PostId; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(postId, content);
    },
    onSuccess: (_, { postId }) => {
      qc.invalidateQueries({ queryKey: ["comments", postId.toString()] });
      qc.invalidateQueries({ queryKey: ["post", postId.toString()] });
    },
  });
}

export function useDeleteComment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: CommentId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteComment(commentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

// ─── Pinned Post Queries ──────────────────────────────────────────────────────

export function usePinnedPosts(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PostId[]>({
    queryKey: ["pinnedPosts", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPinnedPosts(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 60_000,
  });
}

// ─── Follow Queries ───────────────────────────────────────────────────────────

export function useIsFollowing(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isFollowing", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return false;
      return actor.isFollowing(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function useFollowers(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserId[]>({
    queryKey: ["followers", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getFollowers(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function useFollowing(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserId[]>({
    queryKey: ["following", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getFollowing(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function useFollowUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.followUser(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["isFollowing", userId.toString()] });
      qc.invalidateQueries({ queryKey: ["followers"] });
      qc.invalidateQueries({ queryKey: ["following"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowUser(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["isFollowing", userId.toString()] });
      qc.invalidateQueries({ queryKey: ["followers"] });
      qc.invalidateQueries({ queryKey: ["following"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ─── Moderation Queries ───────────────────────────────────────────────────────

export function useBlockedUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserId[]>({
    queryKey: ["blockedUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockedUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMutedUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserId[]>({
    queryKey: ["mutedUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMutedUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useBlockUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.blockUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unblockUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
  });
}

export function useMuteUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.muteUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mutedUsers"] });
    },
  });
}

export function useUnmuteUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unmuteUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mutedUsers"] });
    },
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useGetMyAdminRole() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AdminRole | null>({
    queryKey: ["myAdminRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyAdminRole();
    },
    enabled: !!actor && !isFetching,
    // No staleTime — always refetch so we never serve a stale null as real data.
    staleTime: 0,
    gcTime: 0,
  });
}

export function useGetOwner() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserId | null>({
    queryKey: ["owner"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getOwner();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useClaimOwner() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const success = await actor.claimOwner();
      if (!success) throw new Error("Owner already claimed");
      return success;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["owner"] });
      qc.invalidateQueries({ queryKey: ["myAdminRole"] });
      qc.invalidateQueries({ queryKey: ["moderators"] });
    },
  });
}

export function useListModerators() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RoleEntry[]>({
    queryKey: ["moderators"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listModerators();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useListFlags(status: FlagStatus | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FlagView[]>({
    queryKey: ["flags", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFlags(status);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useListActivityLog(offset = 0n, limit = 50n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ActivityLogView[]>({
    queryKey: ["activityLog", offset.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivityLog(offset, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useIsUserSuspended(userId: UserId | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isUserSuspended", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return false;
      return actor.isUserSuspended(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function useAddModerator() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (target: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.addModerator(target);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderators"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useRemoveModerator() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (target: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeModerator(target);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderators"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useAdminRemovePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, note }: { postId: PostId; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminRemovePost(postId, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
      qc.invalidateQueries({ queryKey: ["allPosts"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useAdminRemoveComment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      note,
    }: { commentId: CommentId; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminRemoveComment(commentId, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useAdminSuspendUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ target, note }: { target: UserId; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminSuspendUser(target, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
      qc.invalidateQueries({ queryKey: ["isUserSuspended"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useAdminUnsuspendUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ target, note }: { target: UserId; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUnsuspendUser(target, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isUserSuspended"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
      qc.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}

export function useResolveFlag() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ flagId, note }: { flagId: bigint; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.resolveFlag(flagId, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useDismissFlag() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ flagId, note }: { flagId: bigint; note?: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.dismissFlag(flagId, note ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useCreateModeratorInvite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.createModeratorInvite(code);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderatorInvites"] });
    },
  });
}

export function useClaimModeratorInvite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.claimModeratorInvite(code);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myAdminRole"] });
      qc.invalidateQueries({ queryKey: ["moderators"] });
      qc.invalidateQueries({ queryKey: ["moderatorInvites"] });
    },
  });
}

export function useRevokeModeratorInvite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.revokeModeratorInvite(code);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderatorInvites"] });
      qc.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useListModeratorInvites(pendingOnly = false) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InviteView[]>({
    queryKey: ["moderatorInvites", pendingOnly],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listModeratorInvites(pendingOnly);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useGetModeratorInvite(code: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InviteView | null>({
    queryKey: ["moderatorInvite", code],
    queryFn: async () => {
      if (!actor || !code) return null;
      return actor.getModeratorInvite(code);
    },
    enabled: !!actor && !isFetching && !!code,
    staleTime: 10_000,
  });
}

export function useFlagPost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      reason,
    }: { postId: PostId; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.flagPost(postId, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}

export function useFlagComment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      reason,
    }: { commentId: CommentId; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.flagComment(commentId, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}

export function useFlagUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      target,
      reason,
    }: { target: UserId; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.flagUser(target, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}

export function useAdminRequestTfaCode() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.adminRequestTfaCode();
    },
  });
}

export function useAdminVerifyTfaCode() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminVerifyTfaCode(code);
    },
  });
}

export function useAdminRegisterTelegramChatId() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminRegisterTelegramChatId(chatId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-telegram-chat-id"] });
    },
  });
}

export function useAdminGetMyTelegramChatId() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string | null>({
    queryKey: ["admin-telegram-chat-id"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetMyTelegramChatId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminSetTelegramBotToken() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminSetTelegramBotToken(token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-telegram-bot-token"] });
    },
  });
}

export function useAdminGetTelegramBotToken() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string | null>({
    queryKey: ["admin-telegram-bot-token"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetTelegramBotToken();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetTfaLockoutStatus() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LockoutStatus | null>({
    queryKey: ["admin-tfa-lockout"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetTfaLockoutStatus();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}
