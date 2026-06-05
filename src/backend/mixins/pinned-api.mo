import AccessControl "mo:caffeineai-authorization/access-control";
import PinnedLib "../lib/pinned";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  pinnedState : PinnedLib.State,
) {
  public shared ({ caller }) func pinPost(
    postId : Common.PostId,
  ) : async () {
    PinnedLib.pinPost(pinnedState, caller, postId);
  };

  public shared ({ caller }) func unpinPost(
    postId : Common.PostId,
  ) : async () {
    PinnedLib.unpinPost(pinnedState, caller, postId);
  };

  public shared query func getPinnedPosts(
    userId : Common.UserId,
  ) : async [Common.PostId] {
    PinnedLib.getPinnedPosts(pinnedState, userId);
  };
};
