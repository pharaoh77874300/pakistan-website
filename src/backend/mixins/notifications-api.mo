import AccessControl "mo:caffeineai-authorization/access-control";
import NotifLib "../lib/notifications";
import NotifTypes "../types/notifications";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifState : NotifLib.State,
) {
  public shared ({ caller }) func addNotification(
    recipientId : Common.UserId,
    actorId : Common.UserId,
    notifType : NotifTypes.NotificationType,
    targetPostId : ?Common.PostId,
    targetUserId : ?Common.UserId,
  ) : async () {
    ignore caller;
    NotifLib.addNotification(notifState, recipientId, actorId, notifType, targetPostId, targetUserId);
  };

  public shared ({ caller }) func getMyNotifications(
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<NotifTypes.NotificationView> {
    NotifLib.getNotifications(notifState, caller, offset, limit);
  };

  public shared ({ caller }) func markNotificationRead(
    notifId : Nat,
  ) : async () {
    NotifLib.markNotificationRead(notifState, caller, notifId);
  };

  public shared ({ caller }) func markAllNotificationsRead() : async () {
    NotifLib.markAllNotificationsRead(notifState, caller);
  };

  public shared ({ caller }) func clearAllNotifications() : async () {
    NotifLib.clearAllNotifications(notifState, caller);
  };

  public shared query ({ caller }) func getUnreadCount() : async Nat {
    NotifLib.getUnreadCount(notifState, caller);
  };
};
