import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type PostPrivacy = { #public_; #followersOnly };

  public type Post = {
    id : Common.PostId;
    authorId : Common.UserId;
    content : Text;
    var imageBlob : ?Storage.ExternalBlob;
    var likeCount : Nat;
    var commentCount : Nat;
    var privacy : PostPrivacy;
    var retweetCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type PostView = {
    id : Common.PostId;
    authorId : Common.UserId;
    content : Text;
    imageBlob : ?Storage.ExternalBlob;
    likeCount : Nat;
    commentCount : Nat;
    retweetCount : Nat;
    privacy : PostPrivacy;
    createdAt : Common.Timestamp;
    likedByMe : Bool;
  };

  public type CreatePostInput = {
    content : Text;
    imageBlob : ?Storage.ExternalBlob;
    privacy : ?PostPrivacy;
  };
};
