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

  // Moderator invite links
  public type InviteStatus = {
    #pending;
    #claimed;
    #revoked;
    #expired;
  };

  public type ModeratorInvite = {
    code       : Text;             // unique opaque code
    createdBy  : Common.UserId;
    createdAt  : Common.Timestamp;
    expiresAt  : Common.Timestamp; // createdAt + 7 days in ns
    var status : InviteStatus;
    var claimedBy  : ?Common.UserId;
    var claimedAt  : ?Common.Timestamp;
  };

  public type InviteView = {
    code       : Text;
    createdBy  : Common.UserId;
    createdAt  : Common.Timestamp;
    expiresAt  : Common.Timestamp;
    status     : InviteStatus;
    claimedBy  : ?Common.UserId;
    claimedAt  : ?Common.Timestamp;
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
    #claimOwner;         // first user claims the owner role
    #inviteClaimed;      // a moderator invite was claimed
    #inviteRevoked;      // owner revoked an unclaimed invite
    #tfaSuccess;         // TFA verification succeeded
    #tfaFailure;         // TFA verification failed
    #tfaLockout;         // TFA account locked
    #tfaResend;          // TFA code resent
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
