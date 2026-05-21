import Common "common";

module {
  // Follow edge: (followerId, followeeId)
  public type FollowEdge = {
    followerId : Common.UserId;
    followeeId : Common.UserId;
    createdAt : Common.Timestamp;
  };
};
