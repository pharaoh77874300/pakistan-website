import AccessControl "mo:caffeineai-authorization/access-control";
import AdminLib "../lib/admin";
import AdminTypes "../types/admin";
import Common "../types/common";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  adminState         : AdminLib.State,
) {
  // ── Owner info ─────────────────────────────────────────────────────────────

  public query func getOwner() : async ?Common.UserId {
    ignore accessControlState;
    AdminLib.getOwner(adminState);
  };

  /// Claim the owner (super admin) role.
  /// The first authenticated caller to invoke this becomes the permanent owner.
  /// Returns true on success, false if an owner already exists.
  /// Claim the owner (super admin) role.
  /// The first authenticated caller becomes the permanent owner.
  /// Idempotent: calling again as the existing owner returns true.
  /// Returns false if a different owner has already claimed the role.
  public shared ({ caller }) func claimOwner() : async Bool {
    ignore accessControlState;
    if (caller == Principal.fromText("2vxsx-fae")) Runtime.trap("Anonymous principal cannot claim owner");
    AdminLib.claimOwner(adminState, caller);
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
    switch (AdminLib.getOwner(adminState)) {
      case (?owner) {
        if (owner == caller) { return ?#owner };
      };
      case null {};
    };
    if (AdminLib.isModerator(adminState, caller)) {
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

  /// Super-admin-only: remove (hide) a post.
  public shared ({ caller }) func adminRemovePost(
    postId : Common.PostId,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.removePost(adminState, caller, postId, note);
  };

  /// Super-admin-only: remove a comment.
  public shared ({ caller }) func adminRemoveComment(
    commentId : Common.CommentId,
    note      : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.removeComment(adminState, caller, commentId, note);
  };

  /// Super-admin-only: suspend a user account.
  public shared ({ caller }) func adminSuspendUser(
    target : Common.UserId,
    note   : ?Text,
  ) : async () {
    ignore accessControlState;
    AdminLib.suspendUser(adminState, caller, target, note);
  };

  /// Super-admin-only: unsuspend a user account.
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

  // ── Moderator invite links ────────────────────────────────────────────────

  /// Owner-only: generate a new single-use moderator invite link.
  /// The caller must supply a unique opaque code (UUID recommended).
  /// Returns the invite metadata including expiration date.
  public shared ({ caller }) func createModeratorInvite(
    code : Text,
  ) : async AdminTypes.InviteView {
    ignore accessControlState;
    if (caller == Principal.fromText("2vxsx-fae")) Runtime.trap("Anonymous principal cannot create invites");
    AdminLib.createInvite(adminState, caller, code);
  };

  /// Any II-authenticated (non-anonymous) user: claim a moderator invite.
  /// Calling this with a valid, unclaimed, unexpired code grants the
  /// caller the moderator role immediately.
  public shared ({ caller }) func claimModeratorInvite(
    code : Text,
  ) : async Bool {
    ignore accessControlState;
    if (caller == Principal.fromText("2vxsx-fae")) Runtime.trap("Anonymous principal cannot claim invites");
    AdminLib.claimInvite(adminState, caller, code);
  };

  /// Owner-only: revoke a pending invite before it is claimed.
  public shared ({ caller }) func revokeModeratorInvite(
    code : Text,
  ) : async Bool {
    ignore accessControlState;
    AdminLib.revokeInvite(adminState, caller, code);
  };

  /// Owner-only: list invite links.
  /// Pass pendingOnly = true to see only unclaimed, unexpired invites.
  public query ({ caller }) func listModeratorInvites(
    pendingOnly : Bool,
  ) : async [AdminTypes.InviteView] {
    ignore accessControlState;
    AdminLib.listInvites(adminState, caller, pendingOnly);
  };

  /// Public: look up a single invite by code (for the claim page).
  public query func getModeratorInvite(
    code : Text,
  ) : async ?AdminTypes.InviteView {
    ignore accessControlState;
    AdminLib.getInviteByCode(adminState, code);
  };
};
