import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import SocialLib "../lib/social";
import ProfileLib "../lib/profiles";

mixin (
  accessControlState : AccessControl.AccessControlState,
  socialState : SocialLib.State,
  profileState : ProfileLib.State,
) {
  public shared ({ caller }) func followUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let alreadyFollowing = SocialLib.isFollowing(socialState, caller, target);
    SocialLib.follow(socialState, caller, target);
    if (not alreadyFollowing) {
      ProfileLib.incrementFollowingCount(profileState, caller);
      ProfileLib.incrementFollowerCount(profileState, target);
    };
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let wasFollowing = SocialLib.isFollowing(socialState, caller, target);
    SocialLib.unfollow(socialState, caller, target);
    if (wasFollowing) {
      ProfileLib.decrementFollowingCount(profileState, caller);
      ProfileLib.decrementFollowerCount(profileState, target);
    };
  };

  public query func getFollowers(userId : Common.UserId) : async [Common.UserId] {
    SocialLib.getFollowers(socialState, userId);
  };

  public query func getFollowing(userId : Common.UserId) : async [Common.UserId] {
    SocialLib.getFollowing(socialState, userId);
  };

  public query ({ caller }) func isFollowing(target : Common.UserId) : async Bool {
    SocialLib.isFollowing(socialState, caller, target);
  };

  public query ({ caller }) func getFollowingIds() : async [Common.UserId] {
    SocialLib.getFollowingIds(socialState, caller);
  };
};
