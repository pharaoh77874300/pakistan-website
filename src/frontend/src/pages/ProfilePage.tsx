import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PostCard } from "@/components/shared/PostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useFollowUser,
  useFollowers,
  useFollowing,
  useIsFollowing,
  useProfile,
  useUnfollowUser,
  useUserPosts,
} from "@/hooks/use-backend";
import type { UserId } from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Edit2, Grid3X3, UserCheck, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Sub-components ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div>
      <Skeleton className="h-40 md:h-56 w-full rounded-none" />
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Skeleton className="w-24 h-24 rounded-full ring-4 ring-card flex-shrink-0" />
          <Skeleton className="w-24 h-9 rounded-full" />
        </div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-3" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

function StatButton({
  count,
  label,
  ocid,
  onClick,
}: {
  count: bigint;
  label: string;
  ocid?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group cursor-pointer hover:opacity-80 transition-smooth disabled:cursor-default"
      disabled={!onClick}
      data-ocid={ocid}
    >
      <span className="font-display font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
        {count.toString()}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}

function UserRow({
  userId,
  onClose,
}: {
  userId: UserId;
  onClose: () => void;
}) {
  const { data: profile } = useProfile(userId);
  const pid = userId.toString();

  return (
    <Link
      to="/profile/$userId"
      params={{ userId: pid }}
      onClick={onClose}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-smooth"
      data-ocid="profile.user_list.item"
    >
      <Avatar
        blob={profile?.avatarBlob}
        name={profile?.username ?? pid.slice(0, 5)}
        size="md"
      />
      <div className="min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {profile?.username ?? `${pid.slice(0, 8)}…`}
        </p>
        {profile?.bio && (
          <p className="text-xs text-muted-foreground truncate">
            {profile.bio}
          </p>
        )}
      </div>
    </Link>
  );
}

function UserListSheet({
  open,
  onOpenChange,
  title,
  userId,
  type,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  userId: UserId | null;
  type: "followers" | "following";
}) {
  const { data: followers } = useFollowers(
    type === "followers" && open ? userId : null,
  );
  const { data: following } = useFollowing(
    type === "following" && open ? userId : null,
  );
  const items = type === "followers" ? followers : following;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[70vh]">
        <SheetHeader className="pb-3 border-b border-border">
          <SheetTitle className="font-display">{title}</SheetTitle>
        </SheetHeader>
        <div
          className="overflow-y-auto mt-4 space-y-1 pr-1"
          style={{ maxHeight: "calc(70vh - 80px)" }}
        >
          {!items ? (
            Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable ID
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No {type} yet
            </p>
          ) : (
            items.map((uid: UserId) => (
              <UserRow
                key={uid.toString()}
                userId={uid}
                onClose={() => onOpenChange(false)}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { userId } = useParams({ from: "/profile/$userId" });
  const { identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sheetType, setSheetType] = useState<"followers" | "following" | null>(
    null,
  );

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(userId);
  } catch {
    // invalid principal
  }

  const isMe = identity?.getPrincipal().toString() === userId;
  const { data: profile, isLoading: profileLoading } = useProfile(principal);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(principal);
  const { data: isFollowing } = useIsFollowing(isMe ? null : principal);
  const { mutate: follow, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollow, isPending: isUnfollowPending } = useUnfollowUser();

  const posts = postsData?.items ?? [];
  const isBusy = isFollowPending || isUnfollowPending;

  const handleFollow = () => {
    if (!principal) return;
    if (isFollowing) {
      unfollow(principal, { onError: () => toast.error("Could not unfollow") });
    } else {
      follow(principal, { onError: () => toast.error("Could not follow") });
    }
  };

  if (profileLoading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <EmptyState
            icon="👤"
            title="User not found"
            description="This profile doesn't exist or may have been removed."
            action={{ label: "Go home", onClick: () => navigate({ to: "/" }) }}
            data-ocid="profile.empty_state"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-ocid="profile.page">
        {/* ── Cover Photo ─── */}
        <div className="relative h-40 md:h-56 bg-muted overflow-hidden">
          {profile.coverBlob ? (
            <img
              src={profile.coverBlob.getDirectURL()}
              alt="Cover banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full gradient-accent opacity-25" />
          )}
          {/* subtle gradient overlay for readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/60 to-transparent" />
        </div>

        {/* ── Profile Header ─── */}
        <div className="bg-card border-b border-border">
          <div className="px-4 pt-0 pb-4">
            {/* Avatar + Actions row */}
            <div className="flex items-end justify-between -mt-12 md:-mt-14 mb-3">
              {/* Avatar with ring border to separate from cover */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: "backOut" }}
                className="flex-shrink-0"
              >
                <Avatar
                  blob={profile.avatarBlob}
                  name={profile.username}
                  size="xl"
                  className="w-24 h-24 md:w-28 md:h-28 ring-4 ring-card shadow-elevated text-2xl"
                />
              </motion.div>

              {/* Action buttons */}
              <div className="flex gap-2 pb-1">
                {isMe ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full font-semibold px-5 transition-smooth"
                    onClick={() => navigate({ to: "/profile/edit" })}
                    data-ocid="profile.edit_button"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit profile
                  </Button>
                ) : isAuthenticated ? (
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    className="rounded-full font-semibold px-5 transition-smooth"
                    onClick={handleFollow}
                    disabled={isBusy}
                    data-ocid="profile.follow_button"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                        Follow
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Name + bio */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-display font-bold text-xl text-foreground leading-tight">
                  {profile.username}
                </h1>
                {isMe && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 font-medium"
                  >
                    You
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-md">
                  {profile.bio}
                </p>
              )}
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-6 mt-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
            >
              <StatButton
                count={profile.postCount}
                label="Posts"
                ocid="profile.stats.posts"
              />
              <StatButton
                count={profile.followerCount}
                label="Followers"
                onClick={() => setSheetType("followers")}
                ocid="profile.stats.followers"
              />
              <StatButton
                count={profile.followingCount}
                label="Following"
                onClick={() => setSheetType("following")}
                ocid="profile.stats.following"
              />
            </motion.div>
          </div>

          {/* Posts Tab header */}
          <div className="flex border-t border-border">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-primary border-b-2 border-primary transition-smooth"
              data-ocid="profile.posts_tab"
            >
              <Grid3X3 className="w-4 h-4" />
              Posts
            </button>
          </div>
        </div>

        {/* ── Posts Grid ─── */}
        <div className="bg-background min-h-[40vh]">
          {postsLoading ? (
            <div className="divide-y divide-border/40">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable ID
                <div key={i} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon="✨"
                title={isMe ? "Share your first post" : "No posts yet"}
                description={
                  isMe
                    ? "Express yourself — your posts will appear here."
                    : `${profile.username} hasn't posted anything yet.`
                }
                action={
                  isMe
                    ? {
                        label: "Create post",
                        onClick: () => navigate({ to: "/" }),
                      }
                    : undefined
                }
                data-ocid="profile.posts.empty_state"
              />
            </div>
          ) : (
            <motion.div
              className="divide-y divide-border/40"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {posts.map((post, i) => (
                <motion.div
                  key={post.id.toString()}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="px-4 py-3"
                  data-ocid={`profile.post.item.${i + 1}`}
                >
                  <PostCard post={post} index={i + 1} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Follower/Following Sheets ─── */}
      <UserListSheet
        open={sheetType === "followers"}
        onOpenChange={(v) => !v && setSheetType(null)}
        title={`Followers · ${profile.followerCount.toString()}`}
        userId={principal}
        type="followers"
      />
      <UserListSheet
        open={sheetType === "following"}
        onOpenChange={(v) => !v && setSheetType(null)}
        title={`Following · ${profile.followingCount.toString()}`}
        userId={principal}
        type="following"
      />
    </Layout>
  );
}
