import Common "common";
import Map "mo:core/Map";

module {
  public type OtpRecord = {
    code      : Text;
    createdAt : Common.Timestamp;
    expiresAt : Common.Timestamp;
  };

  public type TfaAttempt = {
    var failedCount   : Nat;
    var lastFailedAt  : ?Common.Timestamp;
    var lockedUntil   : ?Common.Timestamp;
    var lastResendAt  : ?Common.Timestamp;
  };

  public type TfaState = {
    var botToken      : ?Text;
    chatIds           : Map.Map<Common.UserId, Text>;   // principal -> telegram chat id
    otpCodes          : Map.Map<Common.UserId, OtpRecord>;
    attempts          : Map.Map<Common.UserId, TfaAttempt>;
  };

  public type LockoutStatus = {
    locked      : Bool;
    failedCount : Nat;
    lockedUntil : ?Common.Timestamp;
  };
};
