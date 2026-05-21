import type { backendInterface, ProfileView, PostView, Comment, Page, Page_1 } from "../backend";
import { UserRole } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const mockPrincipal = Principal.fromText("aaaaa-aa");

const mockProfile1: ProfileView = {
  id: mockPrincipal,
  bio: "Passionate about technology, design, and innovation. Building the future one line at a time.",
  postCount: BigInt(42),
  username: "alexmorgan",
  createdAt: BigInt(Date.now() * 1_000_000),
  followerCount: BigInt(1280),
  followingCount: BigInt(340),
};

const mockProfile2: ProfileView = {
  id: mockPrincipal,
  bio: "Designer & creative director. Lover of clean interfaces and beautiful experiences.",
  postCount: BigInt(17),
  username: "sarahjane",
  createdAt: BigInt(Date.now() * 1_000_000),
  followerCount: BigInt(5400),
  followingCount: BigInt(210),
};

const mockPost1: PostView = {
  id: BigInt(1),
  likeCount: BigInt(134),
  content:
    "Just launched my new project! 🚀 So excited to finally share what I've been working on for the past few months. This platform is going to change the way we connect online. What do you think?",
  authorId: mockPrincipal,
  createdAt: BigInt((Date.now() - 3600 * 1000) * 1_000_000),
  commentCount: BigInt(28),
  likedByMe: false,
};

const mockPost2: PostView = {
  id: BigInt(2),
  likeCount: BigInt(87),
  content:
    "The future of decentralized social media is here. No more centralized control, no more data harvesting. Just pure authentic connection. #Web3 #Decentralized #Privacy",
  authorId: mockPrincipal,
  createdAt: BigInt((Date.now() - 7200 * 1000) * 1_000_000),
  commentCount: BigInt(15),
  likedByMe: true,
};

const mockPost3: PostView = {
  id: BigInt(3),
  likeCount: BigInt(256),
  content:
    "Beautiful morning walk in the city. Sometimes you need to step away from the screen and remember what you're building for. 🌅",
  authorId: mockPrincipal,
  createdAt: BigInt((Date.now() - 10800 * 1000) * 1_000_000),
  commentCount: BigInt(42),
  likedByMe: false,
};

const mockComment: Comment = {
  id: BigInt(1),
  content: "This is amazing! Can't wait to try it out.",
  authorId: mockPrincipal,
  createdAt: BigInt(Date.now() * 1_000_000),
  postId: BigInt(1),
};

export const mockBackend: backendInterface = {
  addComment: async (_postId, _content) => mockComment,
  assignCallerUserRole: async (_user, _role) => undefined,
  createPost: async (_input) => mockPost1,
  createProfile: async (_input) => mockProfile1,
  deleteComment: async (_commentId) => undefined,
  deletePost: async (_postId) => undefined,
  followUser: async (_target) => undefined,
  getCallerUserProfile: async () => mockProfile1,
  getCallerUserRole: async () => UserRole.user,
  getFeed: async (_offset, _limit): Promise<Page_1> => ({
    total: BigInt(3),
    items: [mockPost1, mockPost2, mockPost3],
  }),
  getFollowers: async (_userId) => [mockPrincipal],
  getFollowing: async (_userId) => [mockPrincipal],
  getFollowingIds: async () => [mockPrincipal],
  getMyProfile: async () => mockProfile1,
  getPost: async (_postId) => mockPost1,
  getProfile: async (_userId) => mockProfile1,
  getProfileByUsername: async (_username) => mockProfile1,
  getUserProfile: async (_user) => mockProfile1,
  isCallerAdmin: async () => false,
  isFollowing: async (_target) => false,
  listAllPosts: async (_offset, _limit): Promise<Page_1> => ({
    total: BigInt(3),
    items: [mockPost1, mockPost2, mockPost3],
  }),
  listComments: async (_postId) => [mockComment],
  listPostsByUser: async (_userId, _offset, _limit): Promise<Page_1> => ({
    total: BigInt(2),
    items: [mockPost1, mockPost2],
  }),
  listProfiles: async (_offset, _limit): Promise<Page> => ({
    total: BigInt(2),
    items: [mockProfile1, mockProfile2],
  }),
  saveCallerUserProfile: async (_input) => undefined,
  searchPosts: async (_keyword) => [mockPost1, mockPost2],
  searchUsers: async (_keyword) => [mockProfile1, mockProfile2],
  toggleLike: async (_postId) => [BigInt(135), true],
  unfollowUser: async (_target) => undefined,
  updateProfile: async (_input) => mockProfile1,
  _immutableObjectStorageBlobsAreLive: async (_hashes) => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs) => undefined,
  _immutableObjectStorageCreateCertificate: async (_blobHash) => ({ method: "", blob_hash: "" }),
  _immutableObjectStorageRefillCashier: async (_info) => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
};
