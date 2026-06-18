import AccessControl "mo:caffeineai-authorization/access-control";
import AdminLib "../lib/admin";
import TfaLib "../lib/tfa";
import TfaTypes "../types/tfa";
import AdminTypes "../types/admin";
import Common "../types/common";
import Runtime "mo:core/Runtime";
import Outcall "mo:caffeineai-http-outcalls/outcall";

mixin (
  accessControlState : AccessControl.AccessControlState,
  adminState         : AdminLib.State,
  tfaState           : TfaLib.State,
) {
  // ── Bot token management (super admin only) ────────────────────────────────

  public shared ({ caller }) func adminSetTelegramBotToken(token : Text) : async () {
    ignore accessControlState;
    if (not AdminLib.isSuperAdmin(adminState, caller)) Runtime.trap("Access denied: super admin only");
    TfaLib.setTelegramBotToken(tfaState, caller, token);
  };

  public shared ({ caller }) func adminGetTelegramBotToken() : async ?Text {
    ignore accessControlState;
    if (not AdminLib.isSuperAdmin(adminState, caller)) Runtime.trap("Access denied: super admin only");
    TfaLib.getTelegramBotToken(tfaState, caller);
  };

  // ── Chat ID registration (each admin/moderator) ───────────────────────────

  public shared ({ caller }) func adminRegisterTelegramChatId(chatId : Text) : async () {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    TfaLib.registerTelegramChatId(tfaState, caller, chatId);
  };

  public shared ({ caller }) func adminGetMyTelegramChatId() : async ?Text {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    TfaLib.getMyTelegramChatId(tfaState, caller);
  };

  // ── OTP generation & verification ─────────────────────────────────────────

  public shared ({ caller }) func adminRequestTfaCode() : async Text {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    let isAdminFn = func(userId : Common.UserId) : Bool {
      AdminLib.isAdminOrOwner(adminState, userId);
    };
    let logActionFn = func(
      action : AdminTypes.ActionKind,
      targetId : ?Nat,
      targetPrincipal : ?Common.UserId,
      note : ?Text,
    ) : () {
      AdminLib.appendLog(adminState, caller, action, targetId, targetPrincipal, note);
    };
    let result = await TfaLib.generateAndSendCode(tfaState, caller, isAdminFn, logActionFn);

    // If code was generated successfully, send it via Telegram
    if (result == "Verification code generated. Call sendTelegramMessage to deliver it.") {
      switch (TfaLib.getTelegramBotToken(tfaState, caller)) {
        case (?token) {
          switch (TfaLib.getMyTelegramChatId(tfaState, caller)) {
            case (?chatId) {
              switch (TfaLib.getOtpCode(tfaState, caller)) {
                case (?otpRecord) {
                  let (url, headers, bodyText) = TfaLib.buildTelegramMessage(token, chatId, otpRecord.code);
                  ignore await Outcall.httpPostRequest(url, headers, bodyText, transformWrapper);
                  logActionFn(#tfaResend, null, ?caller, ?("Code sent to " # chatId));
                  return "Verification code sent to your Telegram.";
                };
                case null {};
              };
            };
            case null {};
          };
        };
        case null {};
      };
    };
    result;
  };

  public shared query func transformWrapper(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  public shared ({ caller }) func adminVerifyTfaCode(code : Text) : async Bool {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    let logActionFn = func(
      action : AdminTypes.ActionKind,
      targetId : ?Nat,
      targetPrincipal : ?Common.UserId,
      note : ?Text,
    ) : () {
      AdminLib.appendLog(adminState, caller, action, targetId, targetPrincipal, note);
    };
    await TfaLib.verifyCode(tfaState, caller, code, logActionFn);
  };

  // ── Lockout status ────────────────────────────────────────────────────────

  public shared ({ caller }) func adminGetTfaLockoutStatus() : async TfaTypes.LockoutStatus {
    ignore accessControlState;
    if (not AdminLib.isAdminOrOwner(adminState, caller)) Runtime.trap("Not authorized");
    TfaLib.getLockoutStatus(tfaState, caller);
  };
};
