import AccessControl "mo:caffeineai-authorization/access-control";
import ModerationLib "../lib/moderation";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  moderationState : ModerationLib.State,
) {
  public shared ({ caller }) func blockUser(
    targetId : Common.UserId,
  ) : async () {
    ModerationLib.blockUser(moderationState, caller, targetId);
  };

  public shared ({ caller }) func unblockUser(
    targetId : Common.UserId,
  ) : async () {
    ModerationLib.unblockUser(moderationState, caller, targetId);
  };

  public shared ({ caller }) func muteUser(
    targetId : Common.UserId,
  ) : async () {
    ModerationLib.muteUser(moderationState, caller, targetId);
  };

  public shared ({ caller }) func unmuteUser(
    targetId : Common.UserId,
  ) : async () {
    ModerationLib.unmuteUser(moderationState, caller, targetId);
  };

  public shared query ({ caller }) func isBlocked(
    targetId : Common.UserId,
  ) : async Bool {
    ModerationLib.isBlocked(moderationState, caller, targetId);
  };

  public shared query ({ caller }) func isMuted(
    targetId : Common.UserId,
  ) : async Bool {
    ModerationLib.isMuted(moderationState, caller, targetId);
  };

  public shared query ({ caller }) func getBlockedUsers() : async [Common.UserId] {
    ModerationLib.getBlockedUsers(moderationState, caller);
  };

  public shared query ({ caller }) func getMutedUsers() : async [Common.UserId] {
    ModerationLib.getMutedUsers(moderationState, caller);
  };
};
