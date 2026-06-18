import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type UserProfile = {
    id : Common.UserId;
    var username : Text;
    var bio : Text;
    var avatarBlob : ?Storage.ExternalBlob;
    var coverBlob : ?Storage.ExternalBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    var postCount : Nat;
    var isVerified : Bool;
    var avatarType : Text;
    var avatar3dConfig : ?Text;
    createdAt : Common.Timestamp;
  };

  // Shared (immutable) version for the API boundary
  public type ProfileView = {
    id : Common.UserId;
    username : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    coverBlob : ?Storage.ExternalBlob;
    followerCount : Nat;
    followingCount : Nat;
    postCount : Nat;
    isVerified : Bool;
    avatarType : Text;
    avatar3dConfig : ?Text;
    createdAt : Common.Timestamp;
  };

  public type CreateProfileInput = {
    username : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    coverBlob : ?Storage.ExternalBlob;
    avatarType : ?Text;
    avatar3dConfig : ?Text;
  };

  public type UpdateProfileInput = {
    username : ?Text;
    bio : ?Text;
    avatarBlob : ?Storage.ExternalBlob;
    coverBlob : ?Storage.ExternalBlob;
    avatarType : ?Text;
    avatar3dConfig : ?Text;
  };
};
