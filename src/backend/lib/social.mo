import Map "mo:core/Map";
import Set "mo:core/Set";
import Common "../types/common";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type State = {
    // followerId -> Set<followeeId>
    following : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    // followeeId -> Set<followerId>
    followers : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
  };

  public func initState() : State {
    {
      following = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      followers = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
    };
  };

  public func follow(
    state : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) {
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };
    // Add to following set
    let followingSet = switch (state.following.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.following.add(caller, s);
        s;
      };
    };
    if (followingSet.contains(target)) {
      return; // Already following
    };
    followingSet.add(target);
    // Add to followers set of target
    let followerSet = switch (state.followers.get(target)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.followers.add(target, s);
        s;
      };
    };
    followerSet.add(caller);
  };

  public func unfollow(
    state : State,
    caller : Common.UserId,
    target : Common.UserId,
  ) {
    switch (state.following.get(caller)) {
      case (?s) { s.remove(target) };
      case null {};
    };
    switch (state.followers.get(target)) {
      case (?s) { s.remove(caller) };
      case null {};
    };
  };

  public func getFollowers(
    state : State,
    userId : Common.UserId,
  ) : [Common.UserId] {
    switch (state.followers.get(userId)) {
      case (?s) s.toArray();
      case null [];
    };
  };

  public func getFollowing(
    state : State,
    userId : Common.UserId,
  ) : [Common.UserId] {
    switch (state.following.get(userId)) {
      case (?s) s.toArray();
      case null [];
    };
  };

  public func isFollowing(
    state : State,
    followerId : Common.UserId,
    followeeId : Common.UserId,
  ) : Bool {
    switch (state.following.get(followerId)) {
      case (?s) s.contains(followeeId);
      case null false;
    };
  };

  public func getFollowingIds(
    state : State,
    userId : Common.UserId,
  ) : [Common.UserId] {
    switch (state.following.get(userId)) {
      case (?s) s.toArray();
      case null [];
    };
  };
};
