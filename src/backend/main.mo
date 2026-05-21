import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import ProfileLib "lib/profiles";
import PostLib "lib/posts";
import EngagementLib "lib/engagement";
import SocialLib "lib/social";
import ProfilesMixin "mixins/profiles-api";
import PostsMixin "mixins/posts-api";
import EngagementMixin "mixins/engagement-api";
import SocialMixin "mixins/social-api";

actor {
  include MixinObjectStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let profileState = ProfileLib.initState();
  let postState = PostLib.initState();
  let engagementState = EngagementLib.initState();
  let socialState = SocialLib.initState();

  include ProfilesMixin(accessControlState, profileState);
  include PostsMixin(accessControlState, postState, socialState, profileState);
  include EngagementMixin(accessControlState, engagementState, postState);
  include SocialMixin(accessControlState, socialState, profileState);
};
