import Map "mo:core/Map";
import Set "mo:core/Set";
import Common "../types/common";

module {
  public type State = {
    // blockerId -> Set of blockedId
    blocks : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    // muterId -> Set of mutedId
    mutes : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
  };

  public func initState() : State {
    {
      blocks = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      mutes = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
    };
  };

  public func blockUser(
    state : State,
    callerId : Common.UserId,
    targetId : Common.UserId,
  ) : () {
    switch (state.blocks.get(callerId)) {
      case (?set) { set.add(targetId) };
      case null {
        let set = Set.empty<Common.UserId>();
        set.add(targetId);
        state.blocks.add(callerId, set);
      };
    };
  };

  public func unblockUser(
    state : State,
    callerId : Common.UserId,
    targetId : Common.UserId,
  ) : () {
    switch (state.blocks.get(callerId)) {
      case (?set) { set.remove(targetId) };
      case null {};
    };
  };

  public func muteUser(
    state : State,
    callerId : Common.UserId,
    targetId : Common.UserId,
  ) : () {
    switch (state.mutes.get(callerId)) {
      case (?set) { set.add(targetId) };
      case null {
        let set = Set.empty<Common.UserId>();
        set.add(targetId);
        state.mutes.add(callerId, set);
      };
    };
  };

  public func unmuteUser(
    state : State,
    callerId : Common.UserId,
    targetId : Common.UserId,
  ) : () {
    switch (state.mutes.get(callerId)) {
      case (?set) { set.remove(targetId) };
      case null {};
    };
  };

  public func isBlocked(
    state : State,
    blockerId : Common.UserId,
    targetId : Common.UserId,
  ) : Bool {
    switch (state.blocks.get(blockerId)) {
      case (?set) set.contains(targetId);
      case null false;
    };
  };

  public func isMuted(
    state : State,
    muterId : Common.UserId,
    targetId : Common.UserId,
  ) : Bool {
    switch (state.mutes.get(muterId)) {
      case (?set) set.contains(targetId);
      case null false;
    };
  };

  public func getBlockedUsers(
    state : State,
    callerId : Common.UserId,
  ) : [Common.UserId] {
    switch (state.blocks.get(callerId)) {
      case (?set) set.toArray();
      case null [];
    };
  };

  public func getMutedUsers(
    state : State,
    callerId : Common.UserId,
  ) : [Common.UserId] {
    switch (state.mutes.get(callerId)) {
      case (?set) set.toArray();
      case null [];
    };
  };
};
