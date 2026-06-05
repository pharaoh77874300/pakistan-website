import AccessControl "mo:caffeineai-authorization/access-control";
import AdminLib "../lib/admin";
import AdminTypes "../types/admin";
import Common "../types/common";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  adminState         : AdminLib.State,
) {
  // ── Owner bootstrap ────────────────────────────────────────────────────────

  /// Claim the owner role. Must be called once by the deployer after deploy.
  public shared ({ caller }) func claimOwnerRole() : async () {
    ignore accessControlState;
    AdminLib.claimOwner(adminState, caller);
  };

  public query func getOwner() : async ?Common.UserId {
    ignore accessControlState;
    AdminLib.getOwner(adminState);
  };

  // ── Role management ────────────────────────────────────────────────────────

  /// Owner-only: grant moderator role to another user.
  public shared ({ caller }) func addModerator(target : Common.UserId) : async () {
    ignore accessControlState;
    AdminLib.addModerator(adminState, caller, target);
  };

  /// Owner-only: revoke moderator role.
  public shared ({ caller }) func removeModerator(target : Common.UserId) : async () {
    ignore accessControlState;
    AdminLib.removeModerator(adminState, caller, target);
  };

  public query func listModerators() : async [AdminTypes.RoleEntry] {
    ignore accessControlState;
    AdminLib.listModerators(adminState);
  };

  public query ({ caller }) func getMyAdminRole() : async ?AdminTypes.AdminRole {
    ignore accessControlState;
    if (AdminLib.isOwner(adminState, caller)) {
      ?#owner;
    } else if (AdminLib.isModerator(adminState, caller)) {
      ?#moderator;
    } else {
      null;
    };
  };

  // ── Content flagging ───────────────────────────────────────────────────────

  /// Any authenticated user can flag a post.
  public shared ({ caller }) func flagPost(
    postId : Common.PostId,
    reason : Text,
  ) : async Nat {
    ignore accessControlState;
    AdminLib.flagContent(adminState, caller, #post, postId, null, reason);
  };

  /// Any authenticated user can flag a comment.
  public shared ({ caller }) func flagComment(
    commentId : Common.CommentId,
    reason    : Text,
  ) : async Nat {
    ignore accessControlState;
    AdminLib.flagContent(adminState, caller, #comment, commentId, null, reason);
  };

  /// Any authenticated user can flag another user.
  public shared ({ caller }) func flagUser(
    target : Common.UserId,
    reason : Text,
  ) : async Nat {
    ignore accessControlState;
    // encode Principal as Nat via hash for targetId; also pass targetPrincipal
    AdminLib.flagContent(adminState, caller, #user, 0, ?target, reason);
  };

  // ── Moderation queue ──────────────────────────────────────────────────────

  /// Owner or moderator: list all flags, optionally filtered by status.
  public query ({ caller }) func listFlags(
    status : ?AdminTypes.FlagStatus,
  ) : async [AdminTypes.FlagView] {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    AdminLib.listFlags(adminState, status);
  };

  public query ({ caller }) func getFlag(flagId : Nat) : async ?AdminTypes.FlagView {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    AdminLib.getFlag(adminState, flagId);
  };

  // ── Moderation actions ────────────────────────────────────────────────────

  /// Owner or moderator: remove (hide) a post.
  public shared ({ caller }) func adminRemovePost(
    postId : Common.PostId,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.removePost(adminState, caller, postId, note);
  };

  /// Owner or moderator: remove a comment.
  public shared ({ caller }) func adminRemoveComment(
    commentId : Common.CommentId,
    note      : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.removeComment(adminState, caller, commentId, note);
  };

  /// Owner or moderator: suspend a user account.
  public shared ({ caller }) func adminSuspendUser(
    target : Common.UserId,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.suspendUser(adminState, caller, target, note);
  };

  /// Owner or moderator: unsuspend a user account.
  public shared ({ caller }) func adminUnsuspendUser(
    target : Common.UserId,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.unsuspendUser(adminState, caller, target, note);
  };

  /// Check if a user is currently suspended.
  public query func isUserSuspended(userId : Common.UserId) : async Bool {
    ignore accessControlState;
    AdminLib.isUserSuspended(adminState, userId);
  };

  /// Owner or moderator: resolve a flag.
  public shared ({ caller }) func resolveFlag(
    flagId : Nat,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.resolveFlag(adminState, caller, flagId, note);
  };

  /// Owner or moderator: dismiss a flag.
  public shared ({ caller }) func dismissFlag(
    flagId : Nat,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.dismissFlag(adminState, caller, flagId, note);
  };

  // ── Activity log ──────────────────────────────────────────────────────────

  /// Owner or moderator: paginated activity log.
  public query ({ caller }) func listActivityLog(
    offset : Nat,
    limit  : Nat,
  ) : async [AdminTypes.ActivityLogView] {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    AdminLib.listActivityLog(adminState, offset, limit);
  };
};
