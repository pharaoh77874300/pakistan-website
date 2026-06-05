import Common "common";

module {
  public type NotificationType = {
    #like;
    #comment;
    #follow;
    #mention;
    #retweet;
  };

  public type Notification = {
    id : Nat;
    recipientId : Common.UserId;
    actorId : Common.UserId;
    notifType : NotificationType;
    targetPostId : ?Common.PostId;
    targetUserId : ?Common.UserId;
    var isRead : Bool;
    createdAt : Common.Timestamp;
  };

  public type NotificationView = {
    id : Nat;
    recipientId : Common.UserId;
    actorId : Common.UserId;
    notifType : NotificationType;
    targetPostId : ?Common.PostId;
    targetUserId : ?Common.UserId;
    isRead : Bool;
    createdAt : Common.Timestamp;
  };
};
