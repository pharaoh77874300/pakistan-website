import { NotificationType } from "@/backend";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-backend";
import {
  useClearAllNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
  useUnreadCount,
} from "@/hooks/use-notifications";
import type { NotificationView, PostId, UserId } from "@/types";
import { useRouter } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  AtSign,
  Bell,
  Check,
  Heart,
  MessageCircle,
  Repeat2,
  Trash2,
  UserPlus,
} from "lucide-react";

function notifTypeText(type: NotificationType): string {
  switch (type) {
    case NotificationType.like:
      return "liked your post";
    case NotificationType.comment:
      return "commented on your post";
    case NotificationType.follow:
      return "followed you";
    case NotificationType.mention:
      return "mentioned you in a post";
    case NotificationType.retweet:
      return "retweeted your post";
    default:
      return "interacted with you";
  }
}

function notifTypeIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.like:
      return <Heart className="w-4 h-4 text-primary" />;
    case NotificationType.comment:
      return <MessageCircle className="w-4 h-4 text-primary" />;
    case NotificationType.follow:
      return <UserPlus className="w-4 h-4 text-primary" />;
    case NotificationType.mention:
      return <AtSign className="w-4 h-4 text-primary" />;
    case NotificationType.retweet:
      return <Repeat2 className="w-4 h-4 text-primary" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

function isPostNotif(type: NotificationType): boolean {
  return [
    NotificationType.like,
    NotificationType.comment,
    NotificationType.mention,
    NotificationType.retweet,
  ].includes(type);
}

function NotifActorName({ actorId }: { actorId: UserId }) {
  const { data: profile } = useProfile(actorId);
  return (
    <span className="font-semibold text-foreground">
      {profile?.username ?? "Someone"}
    </span>
  );
}

function NotifRow({
  notif,
  onNavigate,
}: {
  notif: NotificationView;
  onNavigate: (notif: NotificationView) => void;
}) {
  const { data: profile } = useProfile(notif.actorId);
  const markRead = useMarkNotificationRead();

  function handleClick() {
    if (!notif.isRead) {
      markRead.mutate(notif.id);
    }
    onNavigate(notif);
  }

  const timeAgo = formatDistanceToNow(
    new Date(Number(notif.createdAt / 1_000_000n)),
    { addSuffix: true },
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 border-b border-border last:border-0 ${
        !notif.isRead ? "bg-primary/5" : ""
      }`}
      data-ocid={`notifications.item.${notif.id}`}
    >
      {/* Unread dot */}
      <div className="flex-shrink-0 mt-1.5">
        {!notif.isRead ? (
          <div className="w-2 h-2 rounded-full bg-primary" />
        ) : (
          <div className="w-2 h-2" />
        )}
      </div>

      {/* Avatar */}
      <Avatar blob={profile?.avatarBlob} name={profile?.username} size="sm" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <NotifActorName actorId={notif.actorId} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            {notifTypeIcon(notif.notifType)}
            {notifTypeText(notif.notifType)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
      </div>

      {/* Bold indicator */}
      {!notif.isRead && (
        <div className="flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
        </div>
      )}
    </button>
  );
}

export default function NotificationsPage() {
  const { data: page, isLoading } = useMyNotifications(0n, 50n);
  const { data: unreadCount = 0n } = useUnreadCount();
  const markAll = useMarkAllNotificationsRead();
  const clearAll = useClearAllNotifications();
  const router = useRouter();

  const notifications = page?.items ?? [];

  function handleNavigate(notif: NotificationView) {
    if (isPostNotif(notif.notifType) && notif.targetPostId != null) {
      router.navigate({
        to: "/post/$postId",
        params: { postId: (notif.targetPostId as PostId).toString() },
      });
    } else if (notif.notifType === NotificationType.follow) {
      router.navigate({
        to: "/profile/$userId",
        params: { userId: notif.actorId.toString() },
      });
    }
  }

  return (
    <Layout>
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-lg text-foreground">
            Notifications
          </h1>
          {unreadCount > 0n && (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground text-xs px-1.5 py-0 h-5 min-w-5 flex items-center justify-center"
              data-ocid="notifications.unread_badge"
            >
              {unreadCount > 99n ? "99+" : unreadCount.toString()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={unreadCount === 0n || markAll.isPending}
            className="text-xs gap-1"
            data-ocid="notifications.mark_all_read_button"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAll.mutate()}
            disabled={notifications.length === 0 || clearAll.isPending}
            className="text-xs gap-1 text-destructive hover:text-destructive"
            data-ocid="notifications.clear_all_button"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : notifications.length === 0 ? (
        <div data-ocid="notifications.empty_state">
          <EmptyState
            icon="🔔"
            title="No notifications yet"
            description="When someone likes, comments, follows, or mentions you, it will show up here."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notif) => (
            <NotifRow
              key={notif.id.toString()}
              notif={notif}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
