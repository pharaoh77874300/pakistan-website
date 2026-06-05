import Common "common";

module {
  public type Mention = {
    postId : Common.PostId;
    mentionedUserId : Common.UserId;
    authorId : Common.UserId;
    createdAt : Common.Timestamp;
  };
};
