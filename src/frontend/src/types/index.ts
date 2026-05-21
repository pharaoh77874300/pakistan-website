import type {
  Comment,
  CommentId,
  CreatePostInput,
  CreateProfileInput,
  ExternalBlob,
  Page,
  Page_1,
  PostId,
  PostView,
  ProfileView,
  UpdateProfileInput,
  UserId,
} from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type {
  ProfileView,
  PostView,
  Comment,
  ExternalBlob,
  UserId,
  PostId,
  CommentId,
  CreatePostInput,
  CreateProfileInput,
  UpdateProfileInput,
  Page,
  Page_1,
  Principal,
};

export interface AuthUser {
  principal: Principal;
  profile: ProfileView | null;
}

export type Theme = "dark" | "light";
