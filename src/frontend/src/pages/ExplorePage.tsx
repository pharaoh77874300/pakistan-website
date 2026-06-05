import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PostCard } from "@/components/shared/PostCard";
import { UserCard } from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useAllPosts,
  useFollowUser,
  useFollowing,
  useIsFollowing,
  useListProfiles,
  useMyProfile,
  useSearchPosts,
  useSearchUsers,
  useUnfollowUser,
} from "@/hooks/use-backend";
import type { PostView, ProfileView, UserId } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  BadgeCheck,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10n;

// ─── Skeletons ────────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-16 ml-auto" />
      </div>
    </div>
  );
}

function UserSuggestionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  );
}

// ─── Suggested Users Sidebar ──────────────────────────────────────────────────

interface SuggestedUsersProps {
  myId: string | null;
  followingIds: Set<string>;
}

function SuggestedUsers({ myId, followingIds }: SuggestedUsersProps) {
  const { data: profiles, isLoading } = useListProfiles(0n, 30n);

  const suggestions = useMemo(() => {
    if (!profiles?.items) return [];
    return (profiles.items as ProfileView[])
      .filter(
        (p) => p.id.toString() !== myId && !followingIds.has(p.id.toString()),
      )
      .slice(0, 6);
  }, [profiles, myId, followingIds]);

  return (
    <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
      <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold text-sm text-foreground">
            Suggested for you
          </h2>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is stable
              <UserSuggestionSkeleton key={i} />
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-muted-foreground text-sm">
              You&apos;re following everyone! 🎉
            </p>
          </div>
        ) : (
          <div
            className="divide-y divide-border/50"
            data-ocid="explore.suggestions_list"
          >
            {suggestions.map((profile, i) => (
              <UserCard
                key={profile.id.toString()}
                profile={profile}
                index={i + 1}
              />
            ))}
          </div>
        )}

        {(profiles?.items?.length ?? 0) > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <Link
              to="/explore"
              search={(prev) => ({ ...prev, q: undefined })}
              className="text-primary text-xs font-medium hover:underline"
              data-ocid="explore.see_more_users_link"
            >
              Discover more people
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Typeahead Suggestion Item ────────────────────────────────────────────────

interface SuggestionItemProps {
  profile: ProfileView;
  index: number;
  onSelect: (profile: ProfileView) => void;
}

function SuggestionItem({ profile, index, onSelect }: SuggestionItemProps) {
  const { identity, isAuthenticated } = useAuth();
  const isMe = identity?.getPrincipal().toString() === profile.id.toString();
  const { data: isFollowing } = useIsFollowing(
    isMe ? null : (profile.id as UserId),
  );
  const { mutate: follow, isPending: followPending } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowPending } = useUnfollowUser();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left"
      data-ocid={`explore.suggestion_item.${index}`}
    >
      <Avatar blob={profile.avatarBlob} name={profile.username} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-foreground truncate">
            {profile.username}
          </span>
          {profile.isVerified && (
            <BadgeCheck
              className="w-3.5 h-3.5 text-primary flex-shrink-0"
              aria-label="Verified"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            @{profile.username.toLowerCase()}
          </span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground">
            {Number(profile.followerCount).toLocaleString()} followers
          </span>
        </div>
      </div>
      {isAuthenticated && !isMe && (
        <Button
          size="sm"
          variant={isFollowing ? "outline" : "default"}
          onClick={handleFollowClick}
          disabled={followPending || unfollowPending}
          className="flex-shrink-0 text-xs px-3 h-7"
          data-ocid={`explore.suggestion_follow_button.${index}`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </button>
  );
}

// ─── User Search Results Section ──────────────────────────────────────────────

interface UserSearchResultsProps {
  query: string;
}

function UserSearchResults({ query }: UserSearchResultsProps) {
  const { data: users, isLoading } = useSearchUsers(query);
  const { identity } = useAuth();
  const navigate = useNavigate();

  const _handleSelect = (profile: ProfileView) => {
    navigate({
      to: "/profile/$userId",
      params: { userId: profile.id.toString() },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">People</h3>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {[0, 1, 2].map((i) => (
            <UserSuggestionSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) return null;

  const myId = identity?.getPrincipal().toString();
  const filteredUsers = (users as ProfileView[]).filter(
    (u) => u.id.toString() !== myId,
  );

  if (filteredUsers.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">People</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredUsers.length} found
        </span>
      </div>
      <div
        className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50"
        data-ocid="explore.user_search_results"
      >
        {filteredUsers.map((profile, i) => (
          <motion.div
            key={profile.id.toString()}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, delay: i * 0.04 }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Link
                to="/profile/$userId"
                params={{ userId: profile.id.toString() }}
                className="flex items-center gap-3 flex-1 min-w-0"
                data-ocid={`explore.user_result_link.${i + 1}`}
              >
                <Avatar
                  blob={profile.avatarBlob}
                  name={profile.username}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground truncate">
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
              </Link>
              <UserCard profile={profile} index={i + 1} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Search Bar with Typeahead ─────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (query: string) => void;
  onClear: () => void;
}

function SearchBar({ value, onChange, onSubmit, onClear }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounce the typeahead query — only fire when typing slows
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const { data: suggestions, isLoading: loadingSuggestions } = useSearchUsers(
    debouncedValue.trim().length >= 1 ? debouncedValue.trim() : "",
  );

  const topSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return (suggestions as ProfileView[]).slice(0, 5);
  }, [suggestions]);

  const showDropdown =
    open &&
    value.trim().length >= 1 &&
    (loadingSuggestions || topSuggestions.length > 0);

  // Close dropdown on outside click
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

  const handleSelect = (profile: ProfileView) => {
    setOpen(false);
    navigate({
      to: "/profile/$userId",
      params: { userId: profile.id.toString() },
    });
    // Also submit so search results update
    onSubmit(profile.username);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(false);
      onSubmit(value);
    }
    if (e.key === "Escape") {
      setOpen(false);
      onClear();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search posts and people..."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            className="pl-9 pr-9 bg-background border-border focus-visible:ring-primary h-11"
            data-ocid="explore.search_input"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="explore.search_clear_button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          onClick={() => {
            setOpen(false);
            onSubmit(value);
          }}
          className="h-11 px-5 font-medium"
          data-ocid="explore.search_button"
        >
          Search
        </Button>
      </div>

      {/* Typeahead dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
            data-ocid="explore.suggestions_dropdown"
          >
            {loadingSuggestions && topSuggestions.length === 0 ? (
              <div className="divide-y divide-border/50">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {topSuggestions.map((profile, i) => (
                  <SuggestionItem
                    key={profile.id.toString()}
                    profile={profile}
                    index={i + 1}
                    onSelect={handleSelect}
                  />
                ))}
                {topSuggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSubmit(value);
                    }}
                    className="w-full px-4 py-2.5 text-xs text-primary hover:bg-muted/40 transition-colors font-medium flex items-center gap-2"
                    data-ocid="explore.suggestions_see_all_button"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search posts for &ldquo;{value}&rdquo;
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Posts Feed ───────────────────────────────────────────────────────────────

interface PostsFeedProps {
  searchQuery: string;
  isSearching: boolean;
}

function PostsFeed({ searchQuery, isSearching }: PostsFeedProps) {
  const [offset, setOffset] = useState(0n);
  const [accumulatedPosts, setAccumulatedPosts] = useState<PostView[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const initializedRef = useRef(false);
  const prevOffsetRef = useRef(0n);

  const { data: allPostsPage, isLoading: loadingAll } = useAllPosts(
    offset,
    PAGE_SIZE,
  );
  const { data: searchResults, isLoading: loadingSearch } =
    useSearchPosts(searchQuery);

  // Initialize or accumulate pages
  useEffect(() => {
    if (!allPostsPage?.items) return;
    const newItems = allPostsPage.items as PostView[];

    if (offset === 0n && !initializedRef.current) {
      initializedRef.current = true;
      setAccumulatedPosts(newItems);
      if (!allPostsPage.nextOffset || newItems.length < Number(PAGE_SIZE)) {
        setAllLoaded(true);
      }
    } else if (offset > 0n && offset !== prevOffsetRef.current) {
      prevOffsetRef.current = offset;
      setAccumulatedPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id.toString()));
        const fresh = newItems.filter((p) => !seen.has(p.id.toString()));
        return [...prev, ...fresh];
      });
      if (!allPostsPage.nextOffset || newItems.length < Number(PAGE_SIZE)) {
        setAllLoaded(true);
      }
    }
  }, [allPostsPage, offset]);

  const handleLoadMore = useCallback(() => {
    setOffset((prev) => prev + PAGE_SIZE);
  }, []);

  // ── Search results view ──
  if (isSearching) {
    if (loadingSearch) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <PostSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (!searchResults || searchResults.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title="No posts found"
          description={`No posts match "${searchQuery}". Try different keywords.`}
          data-ocid="explore.search_empty_state"
        />
      );
    }
    return (
      <div className="space-y-4" data-ocid="explore.search_results">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">
            {searchResults.length}
          </span>{" "}
          result{searchResults.length !== 1 ? "s" : ""} for &ldquo;
          <span className="text-primary">{searchQuery}</span>
          &rdquo;
        </p>
        {(searchResults as PostView[]).map((post, i) => (
          <motion.div
            key={post.id.toString()}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(i * 0.05, 0.25) }}
          >
            <PostCard post={post} index={i + 1} />
          </motion.div>
        ))}
      </div>
    );
  }

  // ── All posts view ──
  if (loadingAll && accumulatedPosts.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (accumulatedPosts.length === 0) {
    return (
      <EmptyState
        icon="✨"
        title="Nothing here yet"
        description="Be the first to post something amazing for the world to discover!"
        data-ocid="explore.empty_state"
      />
    );
  }

  return (
    <div className="space-y-4" data-ocid="explore.posts_list">
      {accumulatedPosts.map((post, i) => (
        <motion.div
          key={post.id.toString()}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: Math.min(i * 0.04, 0.32) }}
        >
          <PostCard post={post} index={i + 1} />
        </motion.div>
      ))}

      {!allLoaded && (
        <div
          className="flex justify-center pt-4"
          data-ocid="explore.load_more_section"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingAll}
            className="min-w-36 border-border hover:border-primary/50 hover:text-primary transition-smooth"
            data-ocid="explore.load_more_button"
          >
            {loadingAll ? "Loading..." : "Load more posts"}
          </Button>
        </div>
      )}

      {allLoaded && accumulatedPosts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          You&apos;ve seen all posts ✓
        </p>
      )}
    </div>
  );
}

// ─── ExplorePage ──────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const search = useSearch({ from: "/explore" });
  const navigate = useNavigate();
  const initialQ = (search as Record<string, unknown>).q;
  const [inputValue, setInputValue] = useState(
    typeof initialQ === "string" ? initialQ : "",
  );
  const [activeQuery, setActiveQuery] = useState(
    typeof initialQ === "string" ? initialQ : "",
  );

  // Sync when URL q param changes (e.g. from header search)
  useEffect(() => {
    const q = typeof initialQ === "string" ? initialQ : "";
    setInputValue(q);
    setActiveQuery(q);
  }, [initialQ]);

  const { identity, isAuthenticated } = useAuth();
  const myId = isAuthenticated
    ? (identity?.getPrincipal().toString() ?? null)
    : null;

  const { data: myProfile } = useMyProfile();
  const { data: followingIds } = useFollowing(
    isAuthenticated && myProfile ? (myProfile.id as UserId) : null,
  );

  const followingSet = useMemo(
    () => new Set((followingIds ?? []).map((id) => id.toString())),
    [followingIds],
  );

  const handleSearch = (query?: string) => {
    const trimmed = (query ?? inputValue).trim();
    if (trimmed) {
      setActiveQuery(trimmed);
      setInputValue(trimmed);
      // Persist query in URL
      navigate({ to: "/explore", search: { q: trimmed } });
    }
  };

  const handleClear = () => {
    setInputValue("");
    setActiveQuery("");
    navigate({ to: "/explore", search: { q: undefined } });
  };

  const isSearching = activeQuery.length > 0;

  return (
    <Layout>
      <div className="min-h-screen bg-background" data-ocid="explore.page">
        {/* Sticky header with search */}
        <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl gradient-accent flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                  Explore
                </h1>
                <p className="text-muted-foreground text-xs">
                  Discover posts from everyone
                </p>
              </div>
            </div>

            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSearch}
              onClear={handleClear}
            />

            {isSearching && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">
                  Results for
                </span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {activeQuery}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto underline underline-offset-2"
                  data-ocid="explore.clear_search_button"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Main feed */}
            <main className="flex-1 min-w-0" data-ocid="explore.feed_section">
              {isSearching && <UserSearchResults query={activeQuery} />}
              <PostsFeed searchQuery={activeQuery} isSearching={isSearching} />
            </main>

            {/* Sidebar */}
            <SuggestedUsers myId={myId} followingIds={followingSet} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
