import Common "common";

module {
  public type Comment = {
    id : Common.CommentId;
    postId : Common.PostId;
    authorId : Common.UserId;
    content : Text;
    createdAt : Common.Timestamp;
  };

  public type LikeKey = {
    postId : Common.PostId;
    userId : Common.UserId;
  };
};
