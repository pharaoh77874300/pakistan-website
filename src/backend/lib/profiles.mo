import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "../types/common";
import ProfileTypes "../types/profiles";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

module {
  public type State = {
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>;
    usernameIndex : Map.Map<Text, Common.UserId>;
    counters : { var nextId : Nat };
  };

  public func initState() : State {
    {
      profiles = Map.empty<Common.UserId, ProfileTypes.UserProfile>();
      usernameIndex = Map.empty<Text, Common.UserId>();
      counters = { var nextId = 0 };
    };
  };

  public func toView(profile : ProfileTypes.UserProfile) : ProfileTypes.ProfileView {
    {
      id = profile.id;
      username = profile.username;
      bio = profile.bio;
      avatarBlob = profile.avatarBlob;
      coverBlob = profile.coverBlob;
      followerCount = profile.followerCount;
      followingCount = profile.followingCount;
      postCount = profile.postCount;
      isVerified = profile.isVerified;
      createdAt = profile.createdAt;
    };
  };

  public func createProfile(
    state : State,
    caller : Common.UserId,
    input : ProfileTypes.CreateProfileInput,
  ) : ProfileTypes.ProfileView {
    // Check username not taken
    switch (state.usernameIndex.get(input.username)) {
      case (?existing) {
        if (not Principal.equal(existing, caller)) {
          Runtime.trap("Username already taken");
        };
      };
      case null {};
    };
    let now = Time.now();
    let profile : ProfileTypes.UserProfile = {
      id = caller;
      var username = input.username;
      var bio = input.bio;
      var avatarBlob = input.avatarBlob;
      var coverBlob = input.coverBlob;
      var followerCount = 0;
      var followingCount = 0;
      var postCount = 0;
      var isVerified = false;
      createdAt = now;
    };
    state.profiles.add(caller, profile);
    state.usernameIndex.add(input.username, caller);
    toView(profile);
  };

  public func updateProfile(
    state : State,
    caller : Common.UserId,
    input : ProfileTypes.UpdateProfileInput,
  ) : ProfileTypes.ProfileView {
    let profile = switch (state.profiles.get(caller)) {
      case (?p) p;
      case null { Runtime.trap("Profile not found") };
    };
    // If username is changing, update the index
    switch (input.username) {
      case (?newName) {
        if (newName != profile.username) {
          switch (state.usernameIndex.get(newName)) {
            case (?existing) {
              if (not Principal.equal(existing, caller)) {
                Runtime.trap("Username already taken");
              };
            };
            case null {};
          };
          state.usernameIndex.remove(profile.username);
          state.usernameIndex.add(newName, caller);
          profile.username := newName;
        };
      };
      case null {};
    };
    switch (input.bio) {
      case (?b) { profile.bio := b };
      case null {};
    };
    switch (input.avatarBlob) {
      case (?a) { profile.avatarBlob := ?a };
      case null {};
    };
    switch (input.coverBlob) {
      case (?c) { profile.coverBlob := ?c };
      case null {};
    };
    toView(profile);
  };

  public func getProfileById(
    state : State,
    userId : Common.UserId,
  ) : ?ProfileTypes.ProfileView {
    switch (state.profiles.get(userId)) {
      case (?p) ?toView(p);
      case null null;
    };
  };

  public func getProfileByUsername(
    state : State,
    username : Text,
  ) : ?ProfileTypes.ProfileView {
    switch (state.usernameIndex.get(username)) {
      case (?userId) getProfileById(state, userId);
      case null null;
    };
  };

  public func listProfiles(
    state : State,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<ProfileTypes.ProfileView> {
    let all = state.profiles.values()
      |> _.map(func(p : ProfileTypes.UserProfile) : ProfileTypes.ProfileView { toView(p) })
      |> _.toArray();
    let total = all.size();
    let start = if (offset > total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = all.sliceToArray(start, end_);
    let nextOffset = if (end_ < total) ?(end_) else null;
    { items; total; nextOffset };
  };

  public func searchByUsername(
    state : State,
    keyword : Text,
  ) : [ProfileTypes.ProfileView] {
    let lower = keyword.toLower();
    state.profiles.values()
      |> _.filter(func(p : ProfileTypes.UserProfile) : Bool {
           p.username.toLower().contains(#text lower);
         })
      |> _.map(func(p : ProfileTypes.UserProfile) : ProfileTypes.ProfileView { toView(p) })
      |> _.toArray();
  };

  public func incrementFollowerCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { p.followerCount := p.followerCount + 1 };
      case null {};
    };
  };
  public func decrementFollowerCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { if (p.followerCount > 0) { p.followerCount := p.followerCount - 1 } };
      case null {};
    };
  };
  public func incrementFollowingCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { p.followingCount := p.followingCount + 1 };
      case null {};
    };
  };
  public func decrementFollowingCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { if (p.followingCount > 0) { p.followingCount := p.followingCount - 1 } };
      case null {};
    };
  };
  public func incrementPostCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { p.postCount := p.postCount + 1 };
      case null {};
    };
  };
  
  public func setVerified(
    state : State,
    userId : Common.UserId,
    verified : Bool,
  ) : () {
    switch (state.profiles.get(userId)) {
      case (?p) { p.isVerified := verified };
      case null { Runtime.trap("Profile not found") };
    };
  };
public func decrementPostCount(state : State, userId : Common.UserId) {
    switch (state.profiles.get(userId)) {
      case (?p) { if (p.postCount > 0) { p.postCount := p.postCount - 1 } };
      case null {};
    };
  };
};
