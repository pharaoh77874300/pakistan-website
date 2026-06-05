import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import NotifTypes "../types/notifications";
import Time "mo:core/Time";

module {
  public type State = {
    // recipientId -> List of Notifications
    notifications : Map.Map<Common.UserId, List.List<NotifTypes.Notification>>;
    counters : { var nextNotifId : Nat };
  };

  public func initState() : State {
    {
      notifications = Map.empty<Common.UserId, List.List<NotifTypes.Notification>>();
      counters = { var nextNotifId = 0 };
    };
  };

  public func addNotification(
    state : State,
    recipientId : Common.UserId,
    actorId : Common.UserId,
    notifType : NotifTypes.NotificationType,
    targetPostId : ?Common.PostId,
    targetUserId : ?Common.UserId,
  ) : () {
    let id = state.counters.nextNotifId;
    state.counters.nextNotifId += 1;
    let notif : NotifTypes.Notification = {
      id;
      recipientId;
      actorId;
      notifType;
      targetPostId;
      targetUserId;
      var isRead = false;
      createdAt = Time.now();
    };
    switch (state.notifications.get(recipientId)) {
      case (?list) { list.add(notif) };
      case null {
        let list = List.empty<NotifTypes.Notification>();
        list.add(notif);
        state.notifications.add(recipientId, list);
      };
    };
  };

  public func getNotifications(
    state : State,
    recipientId : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<NotifTypes.NotificationView> {
    let list = switch (state.notifications.get(recipientId)) {
      case (?l) l;
      case null { return { items = []; total = 0; nextOffset = null } };
    };
    let total = list.size();
    var i = 0;
    let result = List.empty<NotifTypes.NotificationView>();
    for (n in list.values()) {
      if (i >= offset and i < offset + limit) {
        result.add(toView(n));
      };
      i += 1;
    };
    let next = if (offset + limit < total) ?( offset + limit) else null;
    { items = result.toArray(); total; nextOffset = next };
  };

  public func markNotificationRead(
    state : State,
    recipientId : Common.UserId,
    notifId : Nat,
  ) : () {
    switch (state.notifications.get(recipientId)) {
      case (?list) {
        list.mapInPlace(func(n) {
          if (n.id == notifId) { n.isRead := true };
          n;
        });
      };
      case null {};
    };
  };

  public func markAllNotificationsRead(
    state : State,
    recipientId : Common.UserId,
  ) : () {
    switch (state.notifications.get(recipientId)) {
      case (?list) {
        list.mapInPlace(func(n) {
          n.isRead := true;
          n;
        });
      };
      case null {};
    };
  };

  public func clearAllNotifications(
    state : State,
    recipientId : Common.UserId,
  ) : () {
    state.notifications.remove(recipientId);
  };

  public func getUnreadCount(
    state : State,
    recipientId : Common.UserId,
  ) : Nat {
    switch (state.notifications.get(recipientId)) {
      case (?list) {
        list.foldLeft(0, func(acc : Nat, n : NotifTypes.Notification) : Nat {
          if (not n.isRead) acc + 1 else acc;
        });
      };
      case null 0;
    };
  };

  public func toView(n : NotifTypes.Notification) : NotifTypes.NotificationView {
    {
      id = n.id;
      recipientId = n.recipientId;
      actorId = n.actorId;
      notifType = n.notifType;
      targetPostId = n.targetPostId;
      targetUserId = n.targetUserId;
      isRead = n.isRead;
      createdAt = n.createdAt;
    };
  };
};
