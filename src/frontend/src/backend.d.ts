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
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type PostId = bigint;
export interface PostView {
    id: PostId;
    likeCount: bigint;
    content: string;
    imageBlob?: ExternalBlob;
    authorId: UserId;
    createdAt: Timestamp;
    retweetCount: bigint;
    privacy: PostPrivacy;
    commentCount: bigint;
    likedByMe: boolean;
}
export interface CreatePostInput {
    content: string;
    imageBlob?: ExternalBlob;
    privacy?: PostPrivacy;
}
export interface Page_1 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<PostView>;
}
export interface ActivityLogView {
    id: bigint;
    action: ActionKind;
    note?: string;
    targetPrincipal?: UserId;
    performedBy: UserId;
    timestamp: Timestamp;
    targetId?: bigint;
}
export interface NotificationView {
    id: bigint;
    notifType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    actorId: UserId;
    targetPostId?: PostId;
    recipientId: UserId;
    targetUserId?: UserId;
}
export interface Mention {
    mentionedUserId: UserId;
    authorId: UserId;
    createdAt: Timestamp;
    postId: PostId;
}
export interface CreateProfileInput {
    bio: string;
    username: string;
    avatarBlob?: ExternalBlob;
    avatarType?: string;
    avatar3dConfig?: string;
    coverBlob?: ExternalBlob;
}
export interface Page_3 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Mention>;
}
export interface Page {
    total: bigint;
    nextOffset?: bigint;
    items: Array<ProfileView>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    postId: PostId;
}
export interface Page_2 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<NotificationView>;
}
export interface LockoutStatus {
    failedCount: bigint;
    locked: boolean;
    lockedUntil?: Timestamp;
}
export interface RoleEntry {
    grantedAt: Timestamp;
    grantedBy: UserId;
    userId: UserId;
    role: AdminRole;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ProfileView {
    id: UserId;
    bio: string;
    postCount: bigint;
    username: string;
    avatarBlob?: ExternalBlob;
    avatarType: string;
    createdAt: Timestamp;
    isVerified: boolean;
    avatar3dConfig?: string;
    followerCount: bigint;
    followingCount: bigint;
    coverBlob?: ExternalBlob;
}
export type UserId = Principal;
export interface UpdateProfileInput {
    bio?: string;
    username?: string;
    avatarBlob?: ExternalBlob;
    avatarType?: string;
    avatar3dConfig?: string;
    coverBlob?: ExternalBlob;
}
export interface FlagView {
    id: bigint;
    status: FlagStatus;
    createdAt: Timestamp;
    resolution?: string;
    targetPrincipal?: UserId;
    reportedBy: UserId;
    targetKind: FlagTargetKind;
    targetId: bigint;
    resolvedAt?: Timestamp;
    resolvedBy?: UserId;
    reason: string;
}
export interface InviteView {
    status: InviteStatus;
    expiresAt: Timestamp;
    code: string;
    createdAt: Timestamp;
    createdBy: UserId;
    claimedAt?: Timestamp;
    claimedBy?: UserId;
}
export enum ActionKind {
    addModerator = "addModerator",
    inviteRevoked = "inviteRevoked",
    removeComment = "removeComment",
    tfaResend = "tfaResend",
    tfaSuccess = "tfaSuccess",
    removeModerator = "removeModerator",
    claimOwner = "claimOwner",
    inviteClaimed = "inviteClaimed",
    suspendUser = "suspendUser",
    tfaFailure = "tfaFailure",
    dismissFlag = "dismissFlag",
    removePost = "removePost",
    tfaLockout = "tfaLockout",
    resolveFlag = "resolveFlag",
    unsuspendUser = "unsuspendUser"
}
export enum AdminRole {
    moderator = "moderator",
    owner = "owner"
}
export enum FlagStatus {
    resolved = "resolved",
    pending = "pending",
    dismissed = "dismissed"
}
export enum FlagTargetKind {
    post = "post",
    user = "user",
    comment = "comment"
}
export enum InviteStatus {
    revoked = "revoked",
    expired = "expired",
    pending = "pending",
    claimed = "claimed"
}
export enum NotificationType {
    retweet = "retweet",
    like = "like",
    comment = "comment",
    mention = "mention",
    follow = "follow"
}
export enum PostPrivacy {
    followersOnly = "followersOnly",
    public_ = "public"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: PostId, content: string): Promise<Comment>;
    addModerator(target: UserId): Promise<void>;
    addNotification(recipientId: UserId, actorId: UserId, notifType: NotificationType, targetPostId: PostId | null, targetUserId: UserId | null): Promise<void>;
    adminGetMyTelegramChatId(): Promise<string | null>;
    adminGetTelegramBotToken(): Promise<string | null>;
    adminGetTfaLockoutStatus(): Promise<LockoutStatus>;
    adminRegisterTelegramChatId(chatId: string): Promise<void>;
    adminRemoveComment(commentId: CommentId, note: string | null): Promise<void>;
    adminRemovePost(postId: PostId, note: string | null): Promise<void>;
    adminRequestTfaCode(): Promise<string>;
    adminSetTelegramBotToken(token: string): Promise<void>;
    adminSetVerified(userId: UserId, verified: boolean): Promise<void>;
    adminSuspendUser(target: UserId, note: string | null): Promise<void>;
    adminUnsuspendUser(target: UserId, note: string | null): Promise<void>;
    adminVerifyTfaCode(code: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockUser(targetId: UserId): Promise<void>;
    claimModeratorInvite(code: string): Promise<boolean>;
    claimOwner(): Promise<boolean>;
    clearAllNotifications(): Promise<void>;
    createModeratorInvite(code: string): Promise<InviteView>;
    createPost(input: CreatePostInput): Promise<PostView>;
    createProfile(input: CreateProfileInput): Promise<ProfileView>;
    deleteComment(commentId: CommentId): Promise<void>;
    deletePost(postId: PostId): Promise<void>;
    dismissFlag(flagId: bigint, note: string | null): Promise<void>;
    flagComment(commentId: CommentId, reason: string): Promise<bigint>;
    flagPost(postId: PostId, reason: string): Promise<bigint>;
    flagUser(target: UserId, reason: string): Promise<bigint>;
    followUser(target: UserId): Promise<void>;
    getBlockedUsers(): Promise<Array<UserId>>;
    getCallerUserProfile(): Promise<ProfileView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(offset: bigint, limit: bigint): Promise<Page_1>;
    getFlag(flagId: bigint): Promise<FlagView | null>;
    getFollowers(userId: UserId): Promise<Array<UserId>>;
    getFollowing(userId: UserId): Promise<Array<UserId>>;
    getFollowingIds(): Promise<Array<UserId>>;
    getMentionsForUser(userId: UserId, offset: bigint, limit: bigint): Promise<Page_3>;
    getModeratorInvite(code: string): Promise<InviteView | null>;
    getMutedUsers(): Promise<Array<UserId>>;
    getMyAdminRole(): Promise<AdminRole | null>;
    getMyNotifications(offset: bigint, limit: bigint): Promise<Page_2>;
    getMyProfile(): Promise<ProfileView | null>;
    getOwner(): Promise<UserId | null>;
    getPinnedPosts(userId: UserId): Promise<Array<PostId>>;
    getPost(postId: PostId): Promise<PostView | null>;
    getProfile(userId: UserId): Promise<ProfileView | null>;
    getProfileByUsername(username: string): Promise<ProfileView | null>;
    getUnreadCount(): Promise<bigint>;
    getUserProfile(user: UserId): Promise<ProfileView | null>;
    isBlocked(targetId: UserId): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(target: UserId): Promise<boolean>;
    isMuted(targetId: UserId): Promise<boolean>;
    isUserSuspended(userId: UserId): Promise<boolean>;
    listActivityLog(offset: bigint, limit: bigint): Promise<Array<ActivityLogView>>;
    listAllPosts(offset: bigint, limit: bigint): Promise<Page_1>;
    listComments(postId: PostId): Promise<Array<Comment>>;
    listFlags(status: FlagStatus | null): Promise<Array<FlagView>>;
    listModeratorInvites(pendingOnly: boolean): Promise<Array<InviteView>>;
    listModerators(): Promise<Array<RoleEntry>>;
    listPostsByUser(userId: UserId, offset: bigint, limit: bigint): Promise<Page_1>;
    listProfiles(offset: bigint, limit: bigint): Promise<Page>;
    markAllNotificationsRead(): Promise<void>;
    markNotificationRead(notifId: bigint): Promise<void>;
    muteUser(targetId: UserId): Promise<void>;
    pinPost(postId: PostId): Promise<void>;
    removeModerator(target: UserId): Promise<void>;
    resolveFlag(flagId: bigint, note: string | null): Promise<void>;
    revokeModeratorInvite(code: string): Promise<boolean>;
    saveCallerUserProfile(input: CreateProfileInput): Promise<void>;
    searchPosts(keyword: string): Promise<Array<PostView>>;
    searchUsers(keyword: string): Promise<Array<ProfileView>>;
    toggleLike(postId: PostId): Promise<[bigint, boolean]>;
    transformWrapper(input: TransformationInput): Promise<TransformationOutput>;
    unblockUser(targetId: UserId): Promise<void>;
    unfollowUser(target: UserId): Promise<void>;
    unmuteUser(targetId: UserId): Promise<void>;
    unpinPost(postId: PostId): Promise<void>;
    updateProfile(input: UpdateProfileInput): Promise<ProfileView>;
}
