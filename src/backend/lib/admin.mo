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
    var ownerId       : ?Common.UserId;
    roles             : Map.Map<Common.UserId, AdminTypes.RoleEntry>;
    flags             : List.List<AdminTypes.FlagRecord>;
    activityLog       : List.List<AdminTypes.ActivityLogEntry>;
    suspendedUsers    : Map.Map<Common.UserId, Common.Timestamp>;
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
    };
  };

  // ── Owner bootstrap ────────────────────────────────────────────────────────

  /// Claim the owner role (only allowed once, by the deployer/initializer).
  public func claimOwner(state : State, caller : Common.UserId) : () {
    switch (state.ownerId) {
      case (?_) Runtime.trap("Owner already set");
      case null {
        state.ownerId := ?caller;
      };
    };
  };

  public func getOwner(state : State) : ?Common.UserId {
    state.ownerId;
  };

  // ── Role management ────────────────────────────────────────────────────────

  public func isOwner(state : State, userId : Common.UserId) : Bool {
    switch (state.ownerId) {
      case (?owner) owner == userId;
      case null false;
    };
  };

  public func isModerator(state : State, userId : Common.UserId) : Bool {
    switch (state.roles.get(userId)) {
      case (?_) true;
      case null false;
    };
  };

  public func isAdminOrOwner(state : State, userId : Common.UserId) : Bool {
    isOwner(state, userId) or isModerator(state, userId);
  };

  /// Owner grants moderator role to another user.
  public func addModerator(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    if (not isOwner(state, caller)) Runtime.trap("Only owner can add moderators");
    let entry : AdminTypes.RoleEntry = {
      userId    = target;
      role      = #moderator;
      grantedAt = Time.now();
      grantedBy = caller;
    };
    state.roles.add(target, entry);
    appendLog(state, caller, #addModerator, null, ?target, null);
  };

  /// Owner revokes moderator role.
  public func removeModerator(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    if (not isOwner(state, caller)) Runtime.trap("Only owner can remove moderators");
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

  /// Remove (hide) a post — logs the action.
  public func removePost(
    state  : State,
    caller : Common.UserId,
    postId : Common.PostId,
    note   : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
    appendLog(state, caller, #removePost, ?postId, null, note);
  };

  /// Remove a comment — logs the action.
  public func removeComment(
    state     : State,
    caller    : Common.UserId,
    commentId : Common.CommentId,
    note      : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
    appendLog(state, caller, #removeComment, ?commentId, null, note);
  };

  /// Suspend a user account.
  public func suspendUser(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
    note   : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
    state.suspendedUsers.add(target, Time.now());
    appendLog(state, caller, #suspendUser, null, ?target, note);
  };

  /// Unsuspend a user account.
  public func unsuspendUser(
    state  : State,
    caller : Common.UserId,
    target : Common.UserId,
    note   : ?Text,
  ) : () {
    if (not isAdminOrOwner(state, caller)) Runtime.trap("Not authorized");
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

  func appendLog(
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
