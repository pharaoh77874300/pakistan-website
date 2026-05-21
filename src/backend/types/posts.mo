import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Post = {
    id : Common.PostId;
    authorId : Common.UserId;
    content : Text;
    var imageBlob : ?Storage.ExternalBlob;
    var likeCount : Nat;
    var commentCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type PostView = {
    id : Common.PostId;
    authorId : Common.UserId;
    content : Text;
    imageBlob : ?Storage.ExternalBlob;
    likeCount : Nat;
    commentCount : Nat;
    createdAt : Common.Timestamp;
    likedByMe : Bool;
  };

  public type CreatePostInput = {
    content : Text;
    imageBlob : ?Storage.ExternalBlob;
  };
};
