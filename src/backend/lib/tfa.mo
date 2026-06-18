import Common "../types/common";
import TfaTypes "../types/tfa";
import AdminTypes "../types/admin";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Debug "mo:core/Debug";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";

module {
  public type State = TfaTypes.TfaState;

  public func initState() : State {
    {
      var botToken = null;
      chatIds      = Map.empty<Common.UserId, Text>();
      otpCodes     = Map.empty<Common.UserId, TfaTypes.OtpRecord>();
      attempts     = Map.empty<Common.UserId, TfaTypes.TfaAttempt>();
    };
  };

  // ── Bot token (super admin only) ───────────────────────────────────────────

  public func setTelegramBotToken(
    state  : State,
    _caller : Common.UserId,
    token  : Text,
  ) : () {
    state.botToken := ?token;
  };

  public func getTelegramBotToken(
    state  : State,
    _caller : Common.UserId,
  ) : ?Text {
    state.botToken;
  };

  // ── Chat ID registration (each admin/moderator) ───────────────────────────

  public func registerTelegramChatId(
    state   : State,
    caller  : Common.UserId,
    chatId  : Text,
  ) : () {
    state.chatIds.add(caller, chatId);
  };

  public func getMyTelegramChatId(
    state  : State,
    _caller : Common.UserId,
  ) : ?Text {
    state.chatIds.get(_caller);
  };

  // ── OTP generation & verification ─────────────────────────────────────────

  public func generateAndSendCode(
    state       : State,
    caller      : Common.UserId,
    _isAdminFn   : (Common.UserId) -> Bool,
    logActionFn : (AdminTypes.ActionKind, ?Nat, ?Common.UserId, ?Text) -> (),
  ) : async Text {
    let now = Time.now();

    // ── Check lockout ─────────────────────────────────────────────────────────
    switch (state.attempts.get(caller)) {
      case (?attempt) {
        switch (attempt.lockedUntil) {
          case (?until) {
            if (now < until) {
              let remainingSecs = (until - now) / 1_000_000_000;
              return "Account locked. Try again in " # remainingSecs.toText() # " seconds.";
            };
          };
          case null {};
        };
      };
      case null {};
    };

    // ── Check resend rate limit (60 seconds) ────────────────────────────────
    switch (state.attempts.get(caller)) {
      case (?attempt) {
        switch (attempt.lastResendAt) {
          case (?lastResend) {
            if (now - lastResend < 60_000_000_000) {
              let waitSecs = (60_000_000_000 - (now - lastResend)) / 1_000_000_000;
              return "Please wait " # waitSecs.toText() # " seconds before requesting a new code.";
            };
          };
          case null {};
        };
      };
      case null {};
    };

    // ── Check bot token ───────────────────────────────────────────────────────
    let _token = switch (state.botToken) {
      case (?t) t;
      case null return "Telegram bot token not configured.";
    };

    // ── Check chat ID ─────────────────────────────────────────────────────────
    let chatId = switch (state.chatIds.get(caller)) {
      case (?id) id;
      case null return "Telegram chat ID not registered.";
    };

    // ── Generate 6-digit code ─────────────────────────────────────────────────
    let code = generateSixDigitCode(now, caller);

    // ── Store OTP record ────────────────────────────────────────────────────
    let otpRecord : TfaTypes.OtpRecord = {
      code = code;
      createdAt = now;
      expiresAt = now + 300_000_000_000; // 5 minutes
    };
    state.otpCodes.add(caller, otpRecord);

    // ── Update last send time ───────────────────────────────────────────────
    switch (state.attempts.get(caller)) {
      case (?attempt) {
        attempt.lastResendAt := ?now;
      };
      case null {
        let newAttempt : TfaTypes.TfaAttempt = {
          var failedCount = 0;
          var lastFailedAt = null;
          var lockedUntil = null;
          var lastResendAt = ?now;
        };
        state.attempts.add(caller, newAttempt);
      };
    };

    logActionFn(#tfaResend, null, ?caller, ?("Code generated for " # chatId));
    "Verification code generated. Call sendTelegramMessage to deliver it.";
  };

  public func verifyCode(
    state       : State,
    caller      : Common.UserId,
    code        : Text,
    logActionFn : (AdminTypes.ActionKind, ?Nat, ?Common.UserId, ?Text) -> (),
  ) : async Bool {
    let now = Time.now();

    // ── Check lockout ─────────────────────────────────────────────────────────
    switch (state.attempts.get(caller)) {
      case (?attempt) {
        switch (attempt.lockedUntil) {
          case (?until) {
            if (now < until) {
              return false;
            };
          };
          case null {};
        };
      };
      case null {};
    };

    // ── Get OTP ───────────────────────────────────────────────────────────────
    let otpRecord = switch (state.otpCodes.get(caller)) {
      case (?r) r;
      case null {
        logActionFn(#tfaFailure, null, ?caller, ?"No active OTP found");
        return false;
      };
    };

    // ── Check expiry ──────────────────────────────────────────────────────────
    if (now > otpRecord.expiresAt) {
      state.otpCodes.remove(caller);
      logActionFn(#tfaFailure, null, ?caller, ?"OTP expired");
      return false;
    };

    // ── Compare code ──────────────────────────────────────────────────────────
    if (code == otpRecord.code) {
      // Success: clear OTP, reset attempts
      state.otpCodes.remove(caller);
      switch (state.attempts.get(caller)) {
        case (?attempt) {
          attempt.failedCount := 0;
          attempt.lastFailedAt := null;
          attempt.lockedUntil := null;
        };
        case null {};
      };
      logActionFn(#tfaSuccess, null, ?caller, null);
      return true;
    };

    // ── Failure: increment fail count ─────────────────────────────────────────
    let attempt = switch (state.attempts.get(caller)) {
      case (?a) a;
      case null {
        let newAttempt : TfaTypes.TfaAttempt = {
          var failedCount = 0;
          var lastFailedAt = null;
          var lockedUntil = null;
          var lastResendAt = null;
        };
        state.attempts.add(caller, newAttempt);
        newAttempt;
      };
    };

    attempt.failedCount += 1;
    attempt.lastFailedAt := ?now;

    if (attempt.failedCount >= 5) {
      let lockoutDuration = 15 * 60 * 1_000_000_000; // 15 minutes
      attempt.lockedUntil := ?(now + lockoutDuration);
      logActionFn(#tfaLockout, null, ?caller, ?("Locked for 15 min after " # attempt.failedCount.toText() # " failures"));
    } else {
      logActionFn(#tfaFailure, null, ?caller, ?("Attempt " # attempt.failedCount.toText() # "/5"));
    };

    false;
  };

  // ── Lockout status ────────────────────────────────────────────────────────

  public func getLockoutStatus(
    state  : State,
    caller : Common.UserId,
  ) : TfaTypes.LockoutStatus {
    switch (state.attempts.get(caller)) {
      case (?attempt) {
        let now = Time.now();
        let isLocked = switch (attempt.lockedUntil) {
          case (?until) now < until;
          case null false;
        };
        {
          locked = isLocked;
          failedCount = attempt.failedCount;
          lockedUntil = attempt.lockedUntil;
        };
      };
      case null {
        {
          locked = false;
          failedCount = 0;
          lockedUntil = null;
        };
      };
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  public func getOtpCode(state : State, caller : Common.UserId) : ?TfaTypes.OtpRecord {
    state.otpCodes.get(caller);
  };

  public func buildTelegramMessage(token : Text, chatId : Text, code : Text) : (Text, [Outcall.Header], Text) {
    let url = "https://api.telegram.org/bot" # token # "/sendMessage";
    let headers = [{ name = "Content-Type"; value = "application/json" }];
    let bodyText = "{\"chat_id\":\"" # chatId # "\",\"text\":\"Your Pakistan admin verification code is: " # code # "\"}";
    (url, headers, bodyText);
  };

  func generateSixDigitCode(now : Int, caller : Common.UserId) : Text {
    let seed = now + Int.fromNat(caller.hash().toNat());
    let rawCode = Int.abs(seed) % 900_000 + 100_000;
    rawCode.toText();
  };
};
