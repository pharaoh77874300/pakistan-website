import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useFollowUser,
  useIsFollowing,
  useMyProfile,
  useSearchUsers,
  useUnfollowUser,
} from "@/hooks/use-backend";
import { useThemeStore } from "@/store/theme-store";
import type { ProfileView, UserId } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bell, Search, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

function HeaderSearchBar() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [debouncedValue, setDebouncedValue] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), 280);
    return () => clearTimeout(t);
  }, [value]);

  const { data: suggestions, isLoading } = useSearchUsers(
    debouncedValue.trim().length >= 1 ? debouncedValue.trim() : "",
  );

  const topSuggestions = useMemo(
    () => ((suggestions as ProfileView[] | undefined) ?? []).slice(0, 5),
    [suggestions],
  );

  const showDropdown =
    open &&
    value.trim().length >= 1 &&
    (isLoading || topSuggestions.length > 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (q?: string) => {
    const trimmed = (q ?? value).trim();
    if (!trimmed) return;
    setOpen(false);
    navigate({ to: "/explore", search: { q: trimmed } });
    setValue("");
  };

  const handleSelectUser = (profile: ProfileView) => {
    setOpen(false);
    navigate({
      to: "/profile/$userId",
      params: { userId: profile.id.toString() },
    });
    setValue("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setValue("");
            }
          }}
          placeholder="Search Pakistan..."
          className="pl-9 pr-8 h-9 bg-muted/50 border-border/50 focus:bg-card"
          data-ocid="header.search_input"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
            data-ocid="header.search_dropdown"
          >
            {isLoading && topSuggestions.length === 0 ? (
              <div className="divide-y divide-border/50">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {topSuggestions.map((profile, i) => (
                  <HeaderSuggestionItem
                    key={profile.id.toString()}
                    profile={profile}
                    index={i + 1}
                    onSelect={handleSelectUser}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full px-4 py-2.5 text-xs text-primary hover:bg-muted/40 transition-colors font-medium flex items-center gap-2"
                  data-ocid="header.search_see_all_button"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search all results for &ldquo;{value}&rdquo;
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface HeaderSuggestionItemProps {
  profile: ProfileView;
  index: number;
  onSelect: (profile: ProfileView) => void;
}

function HeaderSuggestionItem({
  profile,
  index,
  onSelect,
}: HeaderSuggestionItemProps) {
  const { identity, isAuthenticated } = useAuth();
  const isMe = identity?.getPrincipal().toString() === profile.id.toString();
  const { data: isFollowing } = useIsFollowing(
    isMe ? null : (profile.id as UserId),
  );
  const { mutate: follow, isPending: followPending } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowPending } = useUnfollowUser();

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      unfollow(profile.id as UserId, {
        onError: () => toast.error("Could not unfollow"),
      });
    } else {
      follow(profile.id as UserId, {
        onError: () => toast.error("Could not follow"),
      });
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
      data-ocid={`header.suggestion_item.${index}`}
    >
      <Avatar blob={profile.avatarBlob} name={profile.username} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground truncate">
            {profile.username}
          </span>
          {profile.isVerified && (
            <BadgeCheck
              className="w-3.5 h-3.5 text-primary flex-shrink-0"
              aria-label="Verified"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {Number(profile.followerCount).toLocaleString()} followers
        </p>
      </div>
      {isAuthenticated && !isMe && (
        <Button
          size="sm"
          variant={isFollowing ? "outline" : "default"}
          onClick={handleFollow}
          disabled={followPending || unfollowPending}
          className="flex-shrink-0 text-xs px-2.5 h-6 min-w-0"
          data-ocid={`header.suggestion_follow_button.${index}`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </button>
  );
}

export function Header() {
  const { isAuthenticated, identity, login } = useAuth();
  const { data: profile } = useMyProfile();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-3 shadow-subtle">
      {/* Mobile brand */}
      <Link
        to="/"
        className="lg:hidden flex items-center gap-2 flex-shrink-0"
        data-ocid="header.brand_link"
      >
        <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-base text-foreground">
          Pakistan
        </span>
      </Link>

      {/* Search with typeahead */}
      <div className="flex-1 max-w-md">
        <HeaderSearchBar />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications placeholder */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/explore", search: { q: undefined } })
            }
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            aria-label="Explore (notifications coming soon)"
            title="Notifications coming soon"
            data-ocid="header.notifications_button"
          >
            <Bell className="w-4 h-4" />
          </button>
        )}

        {/* Auth */}
        {isAuthenticated && identity ? (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/profile/$userId",
                params: { userId: identity.getPrincipal().toString() },
              })
            }
            className="flex items-center gap-2 ml-1 hover:opacity-80 transition-smooth"
            aria-label="View your profile"
            data-ocid="header.user_button"
          >
            <Avatar
              blob={profile?.avatarBlob}
              name={profile?.username}
              size="sm"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={login}
            className="ml-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-smooth"
            data-ocid="header.login_button"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
