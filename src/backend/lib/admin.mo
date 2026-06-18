import Common "../types/common";
import AdminTypes "../types/admin";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  public type State = {
    var nextFlagId    : Nat;
    var nextLogId     : Nat;
    var ownerId       : ?Common.UserId;  // null until first claimOwner() call
    roles             : Map.Map<Common.UserId, AdminTypes.RoleEntry>;
    flags             : List.List<AdminTypes.FlagRecord>;
    activityLog       : List.List<AdminTypes.ActivityLogEntry>;
    suspendedUsers    : Map.Map<Common.UserId, Common.Timestamp>;
    invites           : Map.Map<Text, AdminTypes.ModeratorInvite>;
  };

  public func initState() : State {
    {
      var nextFlagId    = 0;
      var nextLogId     = 0;
      var ownerId       = null;
      roles             = Map.empty<Common.UserId, AdminTypes.RoleEntry>();
      flags             = List.empty<AdminTypes.FlagRecord>();
      activityLog       = List.empty<AdminTypes.ActivityLogEntry>();
      suspendedUsers    = Map.empty<Common.UserId, Common.Timestamp>();
      invites           = Map.empty<Text, AdminTypes.ModeratorInvite>();
    };
  };

  // ── Owner / super admin checks ─────────────────────────────────────────────

  /// Returns the current owner principal, or null if unclaimed.
  public func getOwner(state : State) : ?Common.UserId {
    state.ownerId;
  };

  /// True only for the stored owner principal.
  /// True only for the stored owner principal.
  public func isSuperAdmin(state : State, userId : Common.UserId) : Bool {
    switch (state.ownerId) {
      case (?owner) { owner == userId };
      case null false;
    };
  };

  /// Claim the owner role. Succeeds only if no owner is set yet.
  /// Returns true on success, false if already claimed.
  /// Claim the owner role. Succeeds only if no owner is set yet.
  /// Idempotent: calling again by the same principal returns true;
  /// calling when a different owner is already stored returns false.
  public func claimOwner(state : State, caller : Common.UserId) : Bool {
    switch (state.ownerId) {
      case (?existing) {
        // Already claimed — idempotent return true for same caller, false for others
        existing == caller;
      };
      case null {
        state.ownerId := ?caller;
        appendLog(state, caller, #claimOwner, null, ?caller, ?"Owner claimed");
        true;
      };
    };
  };

  // ── Role management ────────────────────────────────────────────────────────

  public func isOwner(state : State, userId : Common.UserId) : Bool {
    isSuperAdmin(state, userId);
  };

  public func isModerator(state : State, userId : Common.UserId) : Bool {
    switch (state.roles.get(userId)) {
      case (?_) true;
      case null false;
    };
  };

  public func isAdminOrOwner(state : State, userId : Common.UserId) : Bool {
    isSuperAdmin(state, userId) or isModerator(state, userId);
  };

  /// Super-admin-only: grant moderator role to another user.
  /// Super-admin-only: grant moderator role to another user.
  public func addModerator(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    let entry : AdminTypes.RoleEntry = {
      userId    = target;
      role      = #moderator;
      grantedAt = Time.now();
      grantedBy = caller;
    };
    state.roles.add(target, entry);
    appendLog(state, caller, #addModerator, null, ?target, null);
  };

  /// Super-admin-only: revoke moderator role.
  /// Super-admin-only: revoke moderator role.
  public func removeModerator(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    state.roles.remove(target);
    appendLog(state, caller, #removeModerator, null, ?target, null);
  };

  public func listModerators(state : State) : [AdminTypes.RoleEntry] {
    let entries = state.roles.entries();
    let result = List.empty<AdminTypes.RoleEntry>();
    for ((_, entry) in entries) {
      result.add(entry);
    };
    result.toArray();
  };


  // ── Moderator invite links ────────────────────────────────────────────────



  func toInviteView(inv : AdminTypes.ModeratorInvite) : AdminTypes.InviteView {
    {
      code      = inv.code;
      createdBy = inv.createdBy;
      createdAt = inv.createdAt;
      expiresAt = inv.expiresAt;
      status    = inv.status;
      claimedBy = inv.claimedBy;
      claimedAt = inv.claimedAt;
    };
  };

  /// Owner-only: create a new single-use moderator invite link.
  /// Returns the unique code that becomes part of the invite URL.
  public func createInvite(
    state  : State,
    caller : Common.UserId,
    code   : Text,
  ) : AdminTypes.InviteView {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    let sevenDaysNs : Int = 7 * 24 * 60 * 60 * 1_000_000_000;
    let invite : AdminTypes.ModeratorInvite = {
      code;
      createdBy  = caller;
      createdAt  = Time.now();
      expiresAt  = Time.now() + sevenDaysNs;
      var status    = #pending;
      var claimedBy = null;
      var claimedAt = null;
    };
    state.invites.add(code, invite);
    toInviteView(invite);
  };

  /// Any II-authenticated user: claim a moderator invite by code.
  /// Returns true on success, false if code is invalid/expired/already used.
  public func claimInvite(
    state  : State,
    caller : Common.UserId,
    code   : Text,
  ) : Bool {
    switch (state.invites.get(code)) {
      case null false;
      case (?invite) {
        if (invite.status != #pending) return false;
        if (Time.now() > invite.expiresAt) {
          invite.status := #expired;
          return false;
        };
        // Grant the moderator role
        let entry : AdminTypes.RoleEntry = {
          userId    = caller;
          role      = #moderator;
          grantedAt = Time.now();
          grantedBy = invite.createdBy;
        };
        state.roles.add(caller, entry);
        invite.status    := #claimed;
        invite.claimedBy := ?caller;
        invite.claimedAt := ?Time.now();
        appendLog(state, caller, #inviteClaimed, null, ?caller, ?code);
        true;
      };
    };
  };

  /// Owner-only: revoke a pending invite before it is claimed.
  /// Returns true on success, false if code not found or already claimed.
  public func revokeInvite(
    state  : State,
    caller : Common.UserId,
    code   : Text,
  ) : Bool {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    switch (state.invites.get(code)) {
      case null false;
      case (?invite) {
        if (invite.status != #pending) return false;
        invite.status := #revoked;
        appendLog(state, caller, #inviteRevoked, null, null, ?code);
        true;
      };
    };
  };

  /// List invite links, optionally filtered to pending-only.
  public func listInvites(
    state       : State,
    caller      : Common.UserId,
    pendingOnly : Bool,
  ) : [AdminTypes.InviteView] {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    let result = List.empty<AdminTypes.InviteView>();
    for ((_, invite) in state.invites.entries()) {
      if (not pendingOnly or invite.status == #pending) {
        result.add(toInviteView(invite));
      };
    };
    result.toArray();
  };

  /// Look up a single invite by code (public — used to validate claim page).
  public func getInviteByCode(
    state : State,
    code  : Text,
  ) : ?AdminTypes.InviteView {
    switch (state.invites.get(code)) {
      case null null;
      case (?invite) ?toInviteView(invite);
    };
  };

  // ── Content flagging ───────────────────────────────────────────────────────

  public func flagContent(
    state           : State,
    reporter        : Common.UserId,
    targetKind      : AdminTypes.FlagTargetKind,
    targetId        : Nat,
    targetPrincipal : ?Common.UserId,
    reason          : Text,
  ) : Nat {
    let id = state.nextFlagId;
    state.nextFlagId += 1;
    let record : AdminTypes.FlagRecord = {
      id;
      targetKind;
      targetId;
      targetPrincipal;
      reportedBy      = reporter;
      reason;
      createdAt       = Time.now();
      var status      = #pending;
      var resolvedAt  = null;
      var resolvedBy  = null;
      var resolution  = null;
    };
    state.flags.add(record);
    id;
  };

  // ── Moderation queue ──────────────────────────────────────────────────────

  func toFlagView(f : AdminTypes.FlagRecord) : AdminTypes.FlagView {
    {
      id              = f.id;
      targetKind      = f.targetKind;
      targetId        = f.targetId;
      targetPrincipal = f.targetPrincipal;
      reportedBy      = f.reportedBy;
      reason          = f.reason;
      createdAt       = f.createdAt;
      status          = f.status;
      resolvedAt      = f.resolvedAt;
      resolvedBy      = f.resolvedBy;
      resolution      = f.resolution;
    };
  };

  public func listFlags(
    state  : State,
    status : ?AdminTypes.FlagStatus,
  ) : [AdminTypes.FlagView] {
    let result = List.empty<AdminTypes.FlagView>();
    for (f in state.flags.values()) {
      switch (status) {
        case null result.add(toFlagView(f));
        case (?s) if (f.status == s) result.add(toFlagView(f));
      };
    };
    result.toArray();
  };

  public func getFlag(state : State, flagId : Nat) : ?AdminTypes.FlagView {
    for (f in state.flags.values()) {
      if (f.id == flagId) return ?toFlagView(f);
    };
    null;
  };

  // ── Moderation actions ────────────────────────────────────────────────────

  /// Super-admin-only: remove (hide) a post — logs the action.
  /// Super-admin-only: remove (hide) a post — logs the action.
  public func removePost(
    state  : State,
    caller : Common.UserId,
    postId : Common.PostId,
    note   : ?Text,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    appendLog(state, caller, #removePost, ?postId, null, note);
  };

  /// Super-admin-only: remove a comment — logs the action.
  /// Super-admin-only: remove a comment — logs the action.
  public func removeComment(
    state     : State,
    caller    : Common.UserId,
    commentId : Common.CommentId,
    note      : ?Text,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    appendLog(state, caller, #removeComment, ?commentId, null, note);
  };

  /// Super-admin-only: suspend a user account.
  /// Super-admin-only: suspend a user account.
  public func suspendUser(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
    note   : ?Text,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    state.suspendedUsers.add(target, Time.now());
    appendLog(state, caller, #suspendUser, null, ?target, note);
  };

  /// Super-admin-only: unsuspend a user account.
  /// Super-admin-only: unsuspend a user account.
  public func unsuspendUser(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
    note   : ?Text,
  ) : () {
    if (not isSuperAdmin(state, caller)) Runtime.trap("Access denied: super admin only");
    state.suspendedUsers.remove(target);
    appendLog(state, caller, #unsuspendUser, null, ?target, note);
  };

  public func isUserSuspended(state : State, userId : Common.UserId) : Bool {
    switch (state.suspendedUsers.get(userId)) {
      case (?_) true;
      case null false;
    };
  };

  /// Resolve a flag (mark as resolved after taking action).
  public func resolveFlag(
    state  : State,
    caller : Common.UserId,
    flagId : Nat,
    note   : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
    for (f in state.flags.values()) {
      if (f.id == flagId) {
        f.status     := #resolved;
        f.resolvedAt := ?Time.now();
        f.resolvedBy := ?caller;
        f.resolution := note;
      };
    };
    appendLog(state, caller, #resolveFlag, ?flagId, null, note);
  };

  /// Dismiss a flag (mark as dismissed without action).
  public func dismissFlag(
    state  : State,
    caller : Common.UserId,
    flagId : Nat,
    note   : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
    for (f in state.flags.values()) {
      if (f.id == flagId) {
        f.status     := #dismissed;
        f.resolvedAt := ?Time.now();
        f.resolvedBy := ?caller;
        f.resolution := note;
      };
    };
    appendLog(state, caller, #dismissFlag, ?flagId, null, note);
  };

  // ── Activity log ──────────────────────────────────────────────────────────

  public func listActivityLog(
    state  : State,
    offset : Nat,
    limit  : Nat,
  ) : [AdminTypes.ActivityLogView] {
    let total = state.activityLog.size();
    if (offset >= total) return [];
    let end = if (offset + limit > total) total else offset + limit;
    state.activityLog.sliceToArray(offset, end);
  };

  // ── Internal helpers ──────────────────────────────────────────────────────

  public func appendLog(
    state           : State,
    caller          : Common.UserId,
    action          : AdminTypes.ActionKind,
    targetId        : ?Nat,
    targetPrincipal : ?Common.UserId,
    note            : ?Text,
  ) : () {
    let entry : AdminTypes.ActivityLogEntry = {
      id              = state.nextLogId;
      performedBy     = caller;
      action;
      targetId;
      targetPrincipal;
      note;
      timestamp       = Time.now();
    };
    state.nextLogId += 1;
    state.activityLog.add(entry);
  };
};
