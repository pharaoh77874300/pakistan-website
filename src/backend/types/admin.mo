import Common "common";

module {
  // Roles
  public type AdminRole = {
    #owner;
    #moderator;
  };

  public type RoleEntry = {
    userId : Common.UserId;
    role   : AdminRole;
    grantedAt : Common.Timestamp;
    grantedBy : Common.UserId;
  };

  // Content flagging
  public type FlagTargetKind = {
    #post;      // flagging a post
    #comment;   // flagging a comment
    #user;      // flagging a user account
  };

  public type FlagRecord = {
    id          : Nat;
    targetKind  : FlagTargetKind;
    targetId    : Nat;             // PostId | CommentId | encoded Principal
    targetPrincipal : ?Common.UserId; // set when targetKind = #user
    reportedBy  : Common.UserId;
    reason      : Text;
    createdAt   : Common.Timestamp;
    var status  : FlagStatus;
    var resolvedAt : ?Common.Timestamp;
    var resolvedBy : ?Common.UserId;
    var resolution : ?Text;
  };

  public type FlagStatus = {
    #pending;
    #resolved;
    #dismissed;
  };

  public type FlagView = {
    id          : Nat;
    targetKind  : FlagTargetKind;
    targetId    : Nat;
    targetPrincipal : ?Common.UserId;
    reportedBy  : Common.UserId;
    reason      : Text;
    createdAt   : Common.Timestamp;
    status      : FlagStatus;
    resolvedAt  : ?Common.Timestamp;
    resolvedBy  : ?Common.UserId;
    resolution  : ?Text;
  };

  // Moderation actions
  public type ActionKind = {
    #removePost;         // hide/delete a post
    #removeComment;      // remove a comment
    #suspendUser;        // suspend a user account
    #unsuspendUser;      // lift a suspension
    #dismissFlag;        // dismiss a flag without action
    #resolveFlag;        // resolve a flag after taking action
    #addModerator;       // owner grants moderator role
    #removeModerator;    // owner revokes moderator role
  };

  public type ActivityLogEntry = {
    id        : Nat;
    performedBy : Common.UserId;
    action    : ActionKind;
    targetId  : ?Nat;             // optional content target
    targetPrincipal : ?Common.UserId; // optional user target
    note      : ?Text;
    timestamp : Common.Timestamp;
  };

  public type ActivityLogView = ActivityLogEntry;

};
