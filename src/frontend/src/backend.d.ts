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
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    postId: PostId;
}
export type PostId = bigint;
export interface PostView {
    id: PostId;
    likeCount: bigint;
    content: string;
    imageBlob?: ExternalBlob;
    authorId: UserId;
    createdAt: Timestamp;
    commentCount: bigint;
    likedByMe: boolean;
}
export interface Page_1 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<PostView>;
}
export interface CreatePostInput {
    content: string;
    imageBlob?: ExternalBlob;
}
export interface ProfileView {
    id: UserId;
    bio: string;
    postCount: bigint;
    username: string;
    avatarBlob?: ExternalBlob;
    createdAt: Timestamp;
    followerCount: bigint;
    followingCount: bigint;
    coverBlob?: ExternalBlob;
}
export type UserId = Principal;
export interface CreateProfileInput {
    bio: string;
    username: string;
    avatarBlob?: ExternalBlob;
    coverBlob?: ExternalBlob;
}
export interface UpdateProfileInput {
    bio?: string;
    username?: string;
    avatarBlob?: ExternalBlob;
    coverBlob?: ExternalBlob;
}
export interface Page {
    total: bigint;
    nextOffset?: bigint;
    items: Array<ProfileView>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: PostId, content: string): Promise<Comment>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(input: CreatePostInput): Promise<PostView>;
    createProfile(input: CreateProfileInput): Promise<ProfileView>;
    deleteComment(commentId: CommentId): Promise<void>;
    deletePost(postId: PostId): Promise<void>;
    followUser(target: UserId): Promise<void>;
    getCallerUserProfile(): Promise<ProfileView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(offset: bigint, limit: bigint): Promise<Page_1>;
    getFollowers(userId: UserId): Promise<Array<UserId>>;
    getFollowing(userId: UserId): Promise<Array<UserId>>;
    getFollowingIds(): Promise<Array<UserId>>;
    getMyProfile(): Promise<ProfileView | null>;
    getPost(postId: PostId): Promise<PostView | null>;
    getProfile(userId: UserId): Promise<ProfileView | null>;
    getProfileByUsername(username: string): Promise<ProfileView | null>;
    getUserProfile(user: UserId): Promise<ProfileView | null>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(target: UserId): Promise<boolean>;
    listAllPosts(offset: bigint, limit: bigint): Promise<Page_1>;
    listComments(postId: PostId): Promise<Array<Comment>>;
    listPostsByUser(userId: UserId, offset: bigint, limit: bigint): Promise<Page_1>;
    listProfiles(offset: bigint, limit: bigint): Promise<Page>;
    saveCallerUserProfile(input: CreateProfileInput): Promise<void>;
    searchPosts(keyword: string): Promise<Array<PostView>>;
    searchUsers(keyword: string): Promise<Array<ProfileView>>;
    toggleLike(postId: PostId): Promise<[bigint, boolean]>;
    unfollowUser(target: UserId): Promise<void>;
    updateProfile(input: UpdateProfileInput): Promise<ProfileView>;
}
