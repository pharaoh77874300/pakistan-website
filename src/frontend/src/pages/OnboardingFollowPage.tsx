import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  useFollowUser,
  useIsFollowing,
  useListProfiles,
  useUnfollowUser,
} from "@/hooks/use-backend";
import type { ProfileView, UserId } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, UserPlus, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OnboardingFollowPage() {
  const { isAuthenticated, isInitializing, identity } = useAuth();
  const navigate = useNavigate();
  const myPrincipal = identity?.getPrincipal().toString();

  const { data: profilesResult, isLoading } = useListProfiles(0n, 30n);

  // Filter out self
  const suggestions = (profilesResult?.items ?? []).filter(
    (p) => p.id.toString() !== myPrincipal,
  );

  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const handleDone = () => navigate({ to: "/" });

  const followCount = followedIds.size;

  if (isInitializing) return null;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="onboarding_follow.page"
    >
      {/* Minimal header with progress */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-semibold text-foreground text-sm">
              Pakistan
            </span>
          </div>
          <StepIndicator current={3} total={3} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-8">
          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 text-accent mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
              Find people to follow
            </h1>
            <p className="text-muted-foreground">
              Follow a few people to make your feed come alive!
            </p>
          </div>

          {/* Counter */}
          <div
            className="flex items-center justify-center gap-2"
            data-ocid="onboarding_follow.counter"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-smooth ${
                followCount > 0
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-muted border-border text-muted-foreground"
              }`}
            >
              {followCount > 0 && <Sparkles className="w-4 h-4" />}
              {followCount > 0
                ? `Following ${followCount} ${followCount === 1 ? "person" : "people"}`
                : "Follow a few people to make your feed come alive!"}
            </div>
          </div>

          {/* Grid of suggested users */}
          {isLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              data-ocid="onboarding_follow.loading_state"
            >
              {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((skId) => (
                <div
                  key={skId}
                  className="bg-card border border-border rounded-2xl p-5 animate-pulse"
                >
                  <div className="w-14 h-14 rounded-full bg-muted mx-auto mb-3" />
                  <div className="h-3 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-2.5 bg-muted rounded w-1/2 mx-auto mb-4" />
                  <div className="h-8 bg-muted rounded-lg w-full" />
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="onboarding_follow.empty_state"
            >
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-semibold">No suggestions yet</p>
              <p className="text-sm mt-1">
                Be one of the first! Your friends will show up here soon.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              data-ocid="onboarding_follow.list"
            >
              {suggestions.map((profile, i) => (
                <SuggestedUserCard
                  key={profile.id.toString()}
                  profile={profile}
                  index={i + 1}
                  onFollowChange={(id, followed) => {
                    setFollowedIds((prev) => {
                      const next = new Set(prev);
                      if (followed) next.add(id);
                      else next.delete(id);
                      return next;
                    });
                  }}
                />
              ))}
            </div>
          )}

          {/* Done button */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              size="lg"
              onClick={handleDone}
              className="px-10 gap-2"
              data-ocid="onboarding_follow.done_button"
            >
              Done — take me to my feed →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SuggestedUserCard({
  profile,
  index,
  onFollowChange,
}: {
  profile: ProfileView;
  index: number;
  onFollowChange: (id: string, followed: boolean) => void;
}) {
  const { data: isFollowing } = useIsFollowing(profile.id as UserId);
  const { mutate: follow, isPending: followPending } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowPending } = useUnfollowUser();
  const isPending = followPending || unfollowPending;

  const handleToggle = () => {
    if (isFollowing) {
      unfollow(profile.id as UserId, {
        onSuccess: () => onFollowChange(profile.id.toString(), false),
        onError: () => toast.error("Could not unfollow"),
      });
    } else {
      follow(profile.id as UserId, {
        onSuccess: () => onFollowChange(profile.id.toString(), true),
        onError: () => toast.error("Could not follow"),
      });
    }
  };

  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center transition-smooth hover:shadow-subtle"
      data-ocid={`onboarding_follow.item.${index}`}
    >
      <Avatar blob={profile.avatarBlob} name={profile.username} size="lg" />
      <p className="font-display font-semibold text-foreground text-sm mt-3 truncate w-full">
        {profile.username}
      </p>
      <p className="text-muted-foreground text-xs line-clamp-2 mt-1 mb-4 min-h-[2.5rem]">
        {profile.bio || "No bio yet"}
      </p>
      <Button
        type="button"
        size="sm"
        variant={isFollowing ? "outline" : "default"}
        onClick={handleToggle}
        disabled={isPending}
        className="w-full gap-1.5 text-xs"
        data-ocid={`onboarding_follow.follow_button.${index}`}
      >
        {isFollowing ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5" />
            Follow
          </>
        )}
      </Button>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-1.5">
          {step < current ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                step === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {step}
            </div>
          )}
          {step < total && (
            <div
              className={`h-0.5 w-6 rounded-full ${
                step < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        Step {current} of {total}
      </span>
    </div>
  );
}
