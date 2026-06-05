import type { backendInterface } from "../backend";
import { NotificationType, PostPrivacy, UserRole } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const makePrincipal = (id: string): Principal =>
  ({ toText: () => id, _isPrincipal: true } as unknown as Principal);

const NOW = BigInt(Date.now()) * BigInt(1_000_000);

const mockUserProfile = {
  id: makePrincipal("user-1"),
  bio: "Pakistan's first social platform 🇵🇰",
  postCount: BigInt(12),
  username: "ali_hassan",
  avatarBlob: undefined,
  createdAt: NOW - BigInt(86400_000_000_000),
  isVerified: true,
  followerCount: BigInt(840),
  followingCount: BigInt(120),
  coverBlob: undefined,
};

const mockUserProfile2 = {
  id: makePrincipal("user-2"),
  bio: "Tech journalist & digital nomad",
  postCount: BigInt(7),
  username: "sara_khan",
  avatarBlob: undefined,
  createdAt: NOW - BigInt(172800_000_000_000),
  isVerified: false,
  followerCount: BigInt(320),
  followingCount: BigInt(58),
  coverBlob: undefined,
};

const mockPost1 = {
  id: BigInt(1),
  likeCount: BigInt(47),
  content:
    "Welcome to Pakistan — your home for authentic Pakistani voices and stories! 🇵🇰 #PakistanFirst",
  imageBlob: undefined,
  authorId: makePrincipal("user-1"),
  createdAt: NOW - BigInt(3600_000_000_000),
  retweetCount: BigInt(12),
  privacy: PostPrivacy.public_,
  commentCount: BigInt(5),
  likedByMe: false,
};

const mockPost2 = {
  id: BigInt(2),
  likeCount: BigInt(23),
  content:
    "Just launched my new photography series capturing street life in Lahore. Check it out! 📸",
  imageBlob: undefined,
  authorId: makePrincipal("user-2"),
  createdAt: NOW - BigInt(7200_000_000_000),
  retweetCount: BigInt(4),
  privacy: PostPrivacy.public_,
  commentCount: BigInt(2),
  likedByMe: true,
};

const mockNotification1 = {
  id: BigInt(1),
  notifType: NotificationType.like,
  createdAt: NOW - BigInt(1800_000_000_000),
  isRead: false,
  actorId: makePrincipal("user-2"),
  targetPostId: BigInt(1),
  recipientId: makePrincipal("user-1"),
  targetUserId: undefined,
};

const mockNotification2 = {
  id: BigInt(2),
  notifType: NotificationType.follow,
  createdAt: NOW - BigInt(3600_000_000_000),
  isRead: true,
  actorId: makePrincipal("user-2"),
  targetPostId: undefined,
  recipientId: makePrincipal("user-1"),
  targetUserId: makePrincipal("user-1"),
};

const mockNotification3 = {
  id: BigInt(3),
  notifType: NotificationType.comment,
  createdAt: NOW - BigInt(5400_000_000_000),
  isRead: false,
  actorId: makePrincipal("user-2"),
  targetPostId: BigInt(2),
  recipientId: makePrincipal("user-1"),
  targetUserId: undefined,
};

export const mockBackend: backendInterface = {
  addComment: async (_postId, content) => ({
    id: BigInt(100),
    content,
    authorId: makePrincipal("user-1"),
    createdAt: NOW,
    postId: _postId,
  }),
  addNotification: async () => undefined,
  adminSetVerified: async () => undefined,
  assignCallerUserRole: async () => undefined,
  blockUser: async () => undefined,
  clearAllNotifications: async () => undefined,
  createPost: async (input) => ({
    ...mockPost1,
    id: BigInt(99),
    content: input.content,
    privacy: input.privacy ?? PostPrivacy.public_,
    likeCount: BigInt(0),
    retweetCount: BigInt(0),
    commentCount: BigInt(0),
    likedByMe: false,
    createdAt: NOW,
  }),
  createProfile: async (input) => ({
    id: makePrincipal("user-new"),
    bio: input.bio,
    postCount: BigInt(0),
    username: input.username,
    avatarBlob: input.avatarBlob,
    createdAt: NOW,
    isVerified: false,
    followerCount: BigInt(0),
    followingCount: BigInt(0),
    coverBlob: input.coverBlob,
  }),
  deleteComment: async () => undefined,
  deletePost: async () => undefined,
  followUser: async () => undefined,
  getBlockedUsers: async () => [],
  getCallerUserProfile: async () => mockUserProfile,
  getCallerUserRole: async () => UserRole.user,
  getFeed: async () => ({
    total: BigInt(2),
    items: [mockPost1, mockPost2],
    nextOffset: undefined,
  }),
  getFollowers: async () => [makePrincipal("user-2")],
  getFollowing: async () => [makePrincipal("user-2")],
  getFollowingIds: async () => [makePrincipal("user-2")],
  getMentionsForUser: async () => ({
    total: BigInt(0),
    items: [],
    nextOffset: undefined,
  }),
  getMutedUsers: async () => [],
  getMyNotifications: async () => ({
    total: BigInt(3),
    items: [mockNotification1, mockNotification2, mockNotification3],
    nextOffset: undefined,
  }),
  getMyProfile: async () => mockUserProfile,
  getPinnedPosts: async () => [BigInt(1)],
  getPost: async (postId) =>
    postId === BigInt(1) ? mockPost1 : postId === BigInt(2) ? mockPost2 : null,
  getProfile: async () => mockUserProfile2,
  getProfileByUsername: async (username) =>
    username === "ali_hassan" ? mockUserProfile : mockUserProfile2,
  getUnreadCount: async () => BigInt(2),
  getUserProfile: async () => mockUserProfile2,
  isBlocked: async () => false,
  isCallerAdmin: async () => false,
  isFollowing: async () => true,
  isMuted: async () => false,
  listAllPosts: async () => ({
    total: BigInt(2),
    items: [mockPost1, mockPost2],
    nextOffset: undefined,
  }),
  listComments: async () => [
    {
      id: BigInt(1),
      content: "Great post! Love to see Pakistan represented.",
      authorId: makePrincipal("user-2"),
      createdAt: NOW - BigInt(600_000_000_000),
      postId: BigInt(1),
    },
  ],
  listPostsByUser: async () => ({
    total: BigInt(2),
    items: [mockPost1, mockPost2],
    nextOffset: undefined,
  }),
  listProfiles: async () => ({
    total: BigInt(2),
    items: [mockUserProfile, mockUserProfile2],
    nextOffset: undefined,
  }),
  markAllNotificationsRead: async () => undefined,
  markNotificationRead: async () => undefined,
  muteUser: async () => undefined,
  pinPost: async () => undefined,
  saveCallerUserProfile: async () => undefined,
  searchPosts: async () => [mockPost1, mockPost2],
  searchUsers: async () => [mockUserProfile, mockUserProfile2],
  toggleLike: async () => [BigInt(48), true],
  unblockUser: async () => undefined,
  unfollowUser: async () => undefined,
  unmuteUser: async () => undefined,
  unpinPost: async () => undefined,
  _immutableObjectStorageBlobsAreLive: async (_hashes: Array<Uint8Array | number[]>) => [] as Array<boolean>,
  _immutableObjectStorageBlobsToDelete: async () => [] as Array<Uint8Array>,
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs: Array<Uint8Array | number[]>) => {},
  _immutableObjectStorageCreateCertificate: async (_blobHash: string) => ({ ok: new Uint8Array() } as never),
  _immutableObjectStorageRefillCashier: async (_info: never) => ({ ok: null } as never),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => {},
  _initializeAccessControl: async () => {},
  addModerator: async () => undefined,
  removeModerator: async () => undefined,
  listModerators: async () => [],
  getMyAdminRole: async () => null,
  getOwner: async () => null,
  claimOwnerRole: async () => undefined,
  flagPost: async () => BigInt(1),
  flagComment: async () => BigInt(1),
  flagUser: async () => BigInt(1),
  listFlags: async () => [],
  getFlag: async () => null,
  adminRemovePost: async () => undefined,
  adminRemoveComment: async () => undefined,
  adminSuspendUser: async () => undefined,
  adminUnsuspendUser: async () => undefined,
  isUserSuspended: async () => false,
  resolveFlag: async () => undefined,
  dismissFlag: async () => undefined,
  listActivityLog: async () => [],
  updateProfile: async (input) => ({
    ...mockUserProfile,
    bio: input.bio ?? mockUserProfile.bio,
    username: input.username ?? mockUserProfile.username,
  }),
};
