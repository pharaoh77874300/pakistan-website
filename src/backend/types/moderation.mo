import Common "common";

module {
  public type BlockRecord = {
    blockerId : Common.UserId;
    blockedId : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type MuteRecord = {
    muterId : Common.UserId;
    mutedId : Common.UserId;
    createdAt : Common.Timestamp;
  };
};
