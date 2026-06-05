import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import {
  useBlockedUsers,
  useMutedUsers,
  useMyProfile,
  useUnblockUser,
  useUnmuteUser,
} from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-backend";
import { useTheme } from "@/hooks/use-theme";
import type { UserId } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Moon, Settings, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

// ─── UserRow for blocked/muted lists ──────────────────────────────────────────

function ModeratedUserRow({
  userId,
  actionLabel,
  onAction,
  isPending,
  index,
  ocidPrefix,
}: {
  userId: UserId;
  actionLabel: string;
  onAction: (userId: UserId) => void;
  isPending: boolean;
  index: number;
  ocidPrefix: string;
}) {
  const { data: profile } = useProfile(userId);
  const pid = userId.toString();

  return (
    <div
      className="flex items-center gap-3 py-3"
      data-ocid={`${ocidPrefix}.item.${index}`}
    >
      <Avatar
        blob={profile?.avatarBlob}
        name={profile?.username ?? pid.slice(0, 5)}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {profile?.username ?? `${pid.slice(0, 8)}…`}
        </p>
        {profile?.bio && (
          <p className="text-xs text-muted-foreground truncate">
            {profile.bio}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAction(userId)}
        disabled={isPending}
        className="flex-shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        data-ocid={`${ocidPrefix}.action_button.${index}`}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

// ─── BlockListSection ─────────────────────────────────────────────────────────

function BlockListSection() {
  const { data: blockedIds, isLoading } = useBlockedUsers();
  const { mutate: unblockUser, isPending } = useUnblockUser();

  const handleUnblock = (userId: UserId) => {
    unblockUser(userId, {
      onSuccess: () => toast.success("User unblocked"),
      onError: () => toast.error("Could not unblock user"),
    });
  };

  return (
    <section data-ocid="settings.blocked_section">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-display font-semibold text-foreground">
          Blocked Users
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Blocked users cannot see your posts or interact with you.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          ))}
        </div>
      ) : !blockedIds || blockedIds.length === 0 ? (
        <div
          className="py-8 text-center text-muted-foreground text-sm"
          data-ocid="settings.blocked.empty_state"
        >
          You haven't blocked anyone.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {blockedIds.map((userId, i) => (
            <ModeratedUserRow
              key={userId.toString()}
              userId={userId}
              actionLabel="Unblock"
              onAction={handleUnblock}
              isPending={isPending}
              index={i + 1}
              ocidPrefix="settings.blocked"
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── MuteListSection ──────────────────────────────────────────────────────────

function MuteListSection() {
  const { data: mutedIds, isLoading } = useMutedUsers();
  const { mutate: unmuteUser, isPending } = useUnmuteUser();

  const handleUnmute = (userId: UserId) => {
    unmuteUser(userId, {
      onSuccess: () => toast.success("User unmuted"),
      onError: () => toast.error("Could not unmute user"),
    });
  };

  return (
    <section data-ocid="settings.muted_section">
      <div className="flex items-center gap-2 mb-1">
        <VolumeX className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-display font-semibold text-foreground">
          Muted Users
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Posts from muted users are hidden from your feed.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          ))}
        </div>
      ) : !mutedIds || mutedIds.length === 0 ? (
        <div
          className="py-8 text-center text-muted-foreground text-sm"
          data-ocid="settings.muted.empty_state"
        >
          You haven't muted anyone.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {mutedIds.map((userId, i) => (
            <ModeratedUserRow
              key={userId.toString()}
              userId={userId}
              actionLabel="Unmute"
              onAction={handleUnmute}
              isPending={isPending}
              index={i + 1}
              ocidPrefix="settings.muted"
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── AccountSection ───────────────────────────────────────────────────────────

function AccountSection() {
  const { data: profile } = useMyProfile();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section data-ocid="settings.account_section">
      <div className="flex items-center gap-2 mb-1">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-display font-semibold text-foreground">Account</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Manage your account preferences.
      </p>

      <div className="space-y-4">
        {/* Username display */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
          <Avatar
            blob={profile?.avatarBlob}
            name={profile?.username}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {profile?.username ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">Username</p>
          </div>
        </div>

        {/* Dark / Light mode toggle */}
        <div
          className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
          data-ocid="settings.theme_toggle"
        >
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDark ? "Dark mode" : "Light mode"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDark ? "Switch to light theme" : "Switch to dark theme"}
              </p>
            </div>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle dark mode"
            data-ocid="settings.dark_mode_switch"
          />
        </div>
      </div>
    </section>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) return <PageLoader />;
  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div
        className="max-w-xl mx-auto px-4 py-6 space-y-8"
        data-ocid="settings.page"
      >
        {/* Page header */}
        <div className="pb-2 border-b border-border">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your privacy and account preferences.
          </p>
        </div>

        <AccountSection />

        <Separator />

        <BlockListSection />

        <Separator />

        <MuteListSection />
      </div>
    </Layout>
  );
}
