import AccessControl "mo:caffeineai-authorization/access-control";
import MentionsLib "../lib/mentions";
import MentionTypes "../types/mentions";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  mentionsState : MentionsLib.State,
) {
  public shared query ({ caller }) func getMentionsForUser(
    userId : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<MentionTypes.Mention> {
    ignore caller;
    MentionsLib.getMentionsForUser(mentionsState, userId, offset, limit);
  };
};
