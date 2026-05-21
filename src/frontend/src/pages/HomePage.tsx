import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { PostCard } from "@/components/shared/PostCard";
import { UserCard } from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreatePost,
  useFeedPosts,
  useListProfiles,
  useMyProfile,
} from "@/hooks/use-backend";
import type { ExternalBlob, PostView } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Image, UserCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── CreatePostBox ────────────────────────────────────────────────────────────

function CreatePostBox() {
  const { data: profile } = useMyProfile();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<ExternalBlob | undefined>(undefined);
  const [showUpload, setShowUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    // Optimistic UI: inject a fake post at the top of the feed cache
    const tempId = BigInt(Date.now()) * -1n;
    const optimisticPost: PostView = {
      id: tempId,
      authorId: profile?.id ?? ({} as PostView["authorId"]),
      content: content.trim(),
      imageBlob: image ?? undefined,
      likeCount: 0n,
      commentCount: 0n,
      likedByMe: false,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };

    qc.setQueryData<{ items: PostView[]; total: bigint; nextOffset?: bigint }>(
      ["feedPosts", "0"],
      (old) => ({
        items: [optimisticPost, ...(old?.items ?? [])],
        total: (old?.total ?? 0n) + 1n,
        nextOffset: old?.nextOffset,
      }),
    );

    const prevContent = content;
    const prevImage = image;
    setContent("");
    setImage(undefined);
    setShowUpload(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await createPost({ content: prevContent, imageBlob: prevImage });
      toast.success("Post published!");
    } catch {
      // Rollback optimistic update
      qc.setQueryData<{
        items: PostView[];
        total: bigint;
        nextOffset?: bigint;
      }>(["feedPosts", "0"], (old) => ({
        items: (old?.items ?? []).filter((p) => p.id !== tempId),
        total: (old?.total ?? 1n) - 1n,
        nextOffset: old?.nextOffset,
      }));
      setContent(prevContent);
      setImage(prevImage);
      toast.error("Could not publish post");
    }
  };

  const canSubmit = content.trim().length > 0 || !!image;

  return (
    <div className="bg-card border-b border-border px-4 py-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <Avatar
              blob={profile?.avatarBlob}
              name={profile?.username}
              size="md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (canSubmit && !isPending)
                    handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              className="resize-none border-0 bg-muted/30 focus:bg-muted/50 rounded-xl text-sm min-h-[80px] overflow-hidden transition-smooth"
              data-ocid="post.input"
            />

            {showUpload && (
              <div className="mt-3 relative">
                <ImageUpload
                  value={image}
                  onChange={setImage}
                  label="Add photo"
                  aspect="wide"
                  data-ocid="post.image_upload"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(false);
                    setImage(undefined);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Remove image"
                  data-ocid="post.close_upload_button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowUpload(!showUpload)}
                  className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg transition-smooth ${
                    showUpload
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                  aria-label="Add photo"
                  data-ocid="post.add_image_button"
                >
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <span
                    className={`text-xs tabular-nums ${
                      content.length > 260
                        ? "text-destructive"
                        : content.length > 200
                          ? "text-accent"
                          : "text-muted-foreground"
                    }`}
                  >
                    {280 - content.length}
                  </span>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !canSubmit || content.length > 280}
                  className="px-5 gradient-accent text-white border-0 disabled:opacity-50"
                  data-ocid="post.submit_button"
                >
                  {isPending ? "Posting…" : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── CompleteProfileBanner ────────────────────────────────────────────────────

function CompleteProfileBanner() {
  const navigate = useNavigate();
  return (
    <div
      className="mx-4 mt-4 bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-start gap-3"
      data-ocid="home.complete_profile_banner"
    >
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <UserCircle2 className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-foreground text-sm">
          Complete your profile
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">
          Add a username, avatar, and bio so people can find and follow you.
        </p>
        <Button
          size="sm"
          className="mt-3 gradient-accent text-white border-0"
          onClick={() => navigate({ to: "/profile/edit" })}
          data-ocid="home.complete_profile_button"
        >
          Set up profile
        </Button>
      </div>
    </div>
  );
}

// ─── RecommendedUsers ─────────────────────────────────────────────────────────

function RecommendedUsers() {
  const { data: page, isLoading } = useListProfiles(0n, 5n);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-display font-semibold text-foreground mb-3 text-sm">
          Suggested
        </h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const profiles = page?.items ?? [];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="font-display font-semibold text-foreground text-sm">
          Suggested for you
        </h3>
        <button
          type="button"
          className="text-xs text-primary hover:underline transition-smooth"
          onClick={() => navigate({ to: "/explore", search: { q: undefined } })}
          data-ocid="home.see_all_button"
        >
          See all
        </button>
      </div>
      {profiles.length === 0 ? (
        <p className="text-muted-foreground text-xs px-4 pb-4">
          No suggestions yet
        </p>
      ) : (
        <div className="pb-2">
          {profiles.map((p, i) => (
            <UserCard key={p.id.toString()} profile={p} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FeedContent ──────────────────────────────────────────────────────────────

function FeedContent({ hasProfile }: { hasProfile: boolean }) {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0n);
  const PAGE_SIZE = 20n;

  const {
    data: feedData,
    isLoading,
    isFetching,
  } = useFeedPosts(offset, PAGE_SIZE);

  const [allPosts, setAllPosts] = useState<PostView[]>([]);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    if (!feedData?.items) return;
    const newPosts: PostView[] = [];
    for (const p of feedData.items) {
      const key = p.id.toString();
      if (!seenIds.current.has(key)) {
        seenIds.current.add(key);
        newPosts.push(p);
      }
    }
    if (offset === 0n) {
      // Reset on first page (including after optimistic update)
      seenIds.current = new Set(feedData.items.map((p) => p.id.toString()));
      setAllPosts(feedData.items);
    } else if (newPosts.length > 0) {
      setAllPosts((prev) => [...prev, ...newPosts]);
    }
  }, [feedData, offset]);

  const hasMore =
    feedData?.nextOffset !== undefined && feedData.nextOffset !== null;

  const handleLoadMore = () => {
    if (feedData?.nextOffset !== undefined && feedData.nextOffset !== null) {
      setOffset(feedData.nextOffset);
    }
  };

  if (isLoading && offset === 0n) {
    return <PageLoader />;
  }

  if (allPosts.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon="✨"
        title="Your feed is empty"
        description={
          hasProfile
            ? "Follow people to see their posts here, or share something of your own!"
            : "Set up your profile, then follow people to fill your feed."
        }
        action={{
          label: hasProfile ? "Explore people" : "Set up profile",
          onClick: () =>
            hasProfile
              ? navigate({ to: "/explore", search: { q: undefined } })
              : navigate({ to: "/profile/edit" }),
        }}
        data-ocid="home.empty_state"
      />
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {allPosts.map((post, i) => (
        <div key={post.id.toString()} className="px-4 py-4">
          <PostCard post={post} index={i + 1} />
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="min-w-[120px]"
            data-ocid="home.load_more_button"
          >
            {isFetching ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}

      {!hasMore && allPosts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-xs">
          You&apos;re all caught up! 🎉
        </div>
      )}
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const navigate = useNavigate();

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const rightPanel = (
    <div className="space-y-4">
      <RecommendedUsers />
      <p className="text-xs text-muted-foreground px-2">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-smooth"
        >
          Built with caffeine.ai
        </a>
      </p>
    </div>
  );

  // Show full-page loader while auth is resolving
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <Layout rightPanel={rightPanel}>
        <PageLoader />
      </Layout>
    );
  }

  // Not authenticated — render nothing (redirect in effect)
  if (!isAuthenticated) return null;

  const hasProfile = !!profile;

  return (
    <Layout rightPanel={rightPanel}>
      {/* Create post box — always visible when authenticated */}
      <CreatePostBox />

      {/* Inline 'complete your profile' card when no profile yet */}
      {!hasProfile && <CompleteProfileBanner />}

      {/* Feed */}
      <FeedContent hasProfile={hasProfile} />
    </Layout>
  );
}
