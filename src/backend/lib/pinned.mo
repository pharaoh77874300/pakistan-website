import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";

module {
  public type State = {
    // userId -> ordered List of pinned postIds (max 3, oldest auto-removed)
    pinnedPosts : Map.Map<Common.UserId, List.List<Common.PostId>>;
  };

  public func initState() : State {
    {
      pinnedPosts = Map.empty<Common.UserId, List.List<Common.PostId>>();
    };
  };

  public func pinPost(
    state : State,
    callerId : Common.UserId,
    postId : Common.PostId,
  ) : () {
    switch (state.pinnedPosts.get(callerId)) {
      case (?list) {
        // Remove if already pinned, then add to front
        let filtered = list.filter(func(id) { id != postId });
        // Evict oldest (last) if already at max 3
        while (filtered.size() >= 3) {
          ignore filtered.removeLast();
        };
        // Add new pin at front by rebuilding
        let newList = List.empty<Common.PostId>();
        newList.add(postId);
        for (id in filtered.values()) { newList.add(id) };
        state.pinnedPosts.add(callerId, newList);
      };
      case null {
        let list = List.empty<Common.PostId>();
        list.add(postId);
        state.pinnedPosts.add(callerId, list);
      };
    };
  };

  public func unpinPost(
    state : State,
    callerId : Common.UserId,
    postId : Common.PostId,
  ) : () {
    switch (state.pinnedPosts.get(callerId)) {
      case (?list) {
        let filtered = list.filter(func(id) { id != postId });
        state.pinnedPosts.add(callerId, filtered);
      };
      case null {};
    };
  };

  public func getPinnedPosts(
    state : State,
    userId : Common.UserId,
  ) : [Common.PostId] {
    switch (state.pinnedPosts.get(userId)) {
      case (?list) list.toArray();
      case null [];
    };
  };
};
