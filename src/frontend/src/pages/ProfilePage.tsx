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
  usePinnedPosts,
  usePost,
  useProfile,
  useUnfollowUser,
  useUserPosts,
} from "@/hooks/use-backend";
import type { PostId, PostView, UserId } from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Grid3X3,
  Images,
  MessageCircle,
  Pin,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Sub-components ─────────────────────────────────────────────────────────

// ─── Lightbox ───────────────────────────────────────────────────────────────

function LightboxModal({
  images,
  initialIndex,
  onClose,
}: {
  images: PostView[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const post = images[idx];
  const timeAgo = (ts: bigint) => {
    const diff = Date.now() - Number(ts) / 1_000_000;
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(Number(ts) / 1_000_000).toLocaleDateString();
  };

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  if (!post?.imageBlob) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-ocid="profile.lightbox"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-card rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-elevated"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-foreground/20 hover:bg-foreground/40 text-white flex items-center justify-center transition-smooth"
            data-ocid="profile.lightbox.close_button"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          <div className="relative flex-1 overflow-hidden bg-muted min-h-0">
            <img
              src={post.imageBlob.getDirectURL()}
              alt="Post content"
              className="w-full object-contain max-h-[60vh]"
            />
            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/30 hover:bg-foreground/50 text-white flex items-center justify-center transition-smooth"
                  data-ocid="profile.lightbox.prev_button"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/30 hover:bg-foreground/50 text-white flex items-center justify-center transition-smooth"
                  data-ocid="profile.lightbox.next_button"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Post meta */}
          <div className="p-4 space-y-2 border-t border-border">
            {post.content && (
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                {post.content}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {post.likeCount.toString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.commentCount.toString()}
              </span>
              <span className="ml-auto">{timeAgo(post.createdAt)}</span>
            </div>
            {images.length > 1 && (
              <p className="text-xs text-muted-foreground text-center">
                {idx + 1} / {images.length}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Pinned Post Item ────────────────────────────────────────────────────────

function PinnedPostItem({ postId, index }: { postId: PostId; index: number }) {
  const { data: post } = usePost(postId);
  if (!post) return null;
  return (
    <div className="relative" data-ocid={`profile.pinned.item.${index}`}>
      <div className="absolute -top-1 -left-1 z-10 bg-primary rounded-full p-0.5">
        <Pin className="w-2.5 h-2.5 text-primary-foreground fill-current" />
      </div>
      <PostCard post={post} index={index} />
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(userId);
  } catch {
    // invalid principal
  }

  const isMe = identity?.getPrincipal().toString() === userId;
  const { data: profile, isLoading: profileLoading } = useProfile(principal);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(principal);
  const { data: pinnedPostIds } = usePinnedPosts(principal);
  const { data: isFollowing } = useIsFollowing(isMe ? null : principal);
  const { mutate: follow, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollow, isPending: isUnfollowPending } = useUnfollowUser();

  const posts = postsData?.items ?? [];
  const mediaPosts = posts.filter((p) => !!p.imageBlob);
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
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h1 className="font-display font-bold text-xl text-foreground leading-tight">
                  {profile.username}
                </h1>
                {profile.isVerified && (
                  <BadgeCheck
                    className="w-5 h-5 text-primary flex-shrink-0"
                    aria-label="Verified"
                    data-ocid="profile.verified_badge"
                  />
                )}
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

          {/* Tab headers */}
          <div className="flex border-t border-border">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-smooth ${
                activeTab === "posts"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
              data-ocid="profile.posts_tab"
            >
              <Grid3X3 className="w-4 h-4" />
              Posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-smooth ${
                activeTab === "media"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
              data-ocid="profile.media_tab"
            >
              <Images className="w-4 h-4" />
              Photos
            </button>
          </div>
        </div>

        {/* ── Tab Content ─── */}
        <div className="bg-background min-h-[40vh]">
          {activeTab === "posts" && (
            <>
              {/* Pinned Posts */}
              {pinnedPostIds && pinnedPostIds.length > 0 && (
                <div
                  className="px-4 pt-4 pb-2"
                  data-ocid="profile.pinned_section"
                >
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Pin className="w-3 h-3" />
                    Pinned Posts
                  </div>
                  <div className="space-y-3">
                    {pinnedPostIds.map((pid, i) => (
                      <PinnedPostItem
                        key={pid.toString()}
                        postId={pid}
                        index={i + 1}
                      />
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border/40" />
                </div>
              )}

              {/* Regular Posts */}
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
            </>
          )}

          {activeTab === "media" && (
            <div className="p-3">
              {postsLoading ? (
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton grid
                      key={i}
                      className="aspect-square w-full rounded-lg"
                    />
                  ))}
                </div>
              ) : mediaPosts.length === 0 ? (
                <div className="py-16">
                  <EmptyState
                    icon="🖼️"
                    title="No photos yet"
                    description={
                      isMe
                        ? "Your photo posts will appear here."
                        : `${profile.username} hasn't shared any photos.`
                    }
                    data-ocid="profile.media.empty_state"
                  />
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-3 gap-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {mediaPosts.map((post, i) => (
                    <motion.button
                      key={post.id.toString()}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      variants={{
                        hidden: { opacity: 0, scale: 0.92 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="relative aspect-square w-full rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      data-ocid={`profile.media.item.${i + 1}`}
                      aria-label={`Open photo ${i + 1}`}
                    >
                      <img
                        src={post.imageBlob!.getDirectURL()}
                        alt={`Post ${i + 1}`}
                        className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-smooth" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ── Lightbox ─── */}
        {lightboxIndex !== null && (
          <LightboxModal
            images={mediaPosts}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
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
