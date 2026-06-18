import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import ProfileLib "lib/profiles";
import PostLib "lib/posts";
import EngagementLib "lib/engagement";
import SocialLib "lib/social";
import NotifLib "lib/notifications";
import ModerationLib "lib/moderation";
import PinnedLib "lib/pinned";
import MentionsLib "lib/mentions";
import ProfilesMixin "mixins/profiles-api";
import PostsMixin "mixins/posts-api";
import EngagementMixin "mixins/engagement-api";
import SocialMixin "mixins/social-api";
import NotificationsMixin "mixins/notifications-api";
import ModerationMixin "mixins/moderation-api";
import PinnedMixin "mixins/pinned-api";
import MentionsMixin "mixins/mentions-api";
import TfaLib "lib/tfa";
import TfaMixin "mixins/tfa-api";
import AdminLib "lib/admin";
import AdminMixin "mixins/admin-api";


actor {
  include MixinObjectStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let profileState = ProfileLib.initState();
  let postState = PostLib.initState();
  let engagementState = EngagementLib.initState();
  let socialState = SocialLib.initState();
  let notifState = NotifLib.initState();
  let moderationState = ModerationLib.initState();
  let pinnedState = PinnedLib.initState();
  let mentionsState = MentionsLib.initState();

  let adminState = AdminLib.initState();
  let tfaState = TfaLib.initState();

  include AdminMixin(accessControlState, adminState);
  include TfaMixin(accessControlState, adminState, tfaState);
  include ProfilesMixin(accessControlState, profileState);
  include PostsMixin(accessControlState, postState, socialState, profileState);
  include EngagementMixin(accessControlState, engagementState, postState);
  include SocialMixin(accessControlState, socialState, profileState);
  include NotificationsMixin(accessControlState, notifState);
  include ModerationMixin(accessControlState, moderationState);
  include PinnedMixin(accessControlState, pinnedState);
  include MentionsMixin(accessControlState, mentionsState);
};
