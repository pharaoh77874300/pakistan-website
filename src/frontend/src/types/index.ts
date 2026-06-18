import type {
  Comment,
  CommentId,
  CreatePostInput,
  CreateProfileInput,
  ExternalBlob,
  InviteView,
  NotificationView,
  Page,
  Page_1,
  Page_2,
  PostId,
  PostView,
  ProfileView,
  UpdateProfileInput,
  UserId,
} from "@/backend";
import { InviteStatus, NotificationType, PostPrivacy } from "@/backend";
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
  Page_2,
  NotificationView,
  Principal,
  InviteView,
};

export { NotificationType, PostPrivacy, InviteStatus };

export interface AuthUser {
  principal: Principal;
  profile: ProfileView | null;
}

export type Theme = "dark" | "light";
