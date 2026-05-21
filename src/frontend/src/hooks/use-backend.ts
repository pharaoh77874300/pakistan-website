import { createActor } from "@/backend";
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
