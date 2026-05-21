import { b as useSearch, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-BuiRXQM6.js";
import { L as Layout, S as Search } from "./Layout-BSB1muAy.js";
import { E as EmptyState, S as Skeleton } from "./skeleton-0lR1H5cf.js";
import { X, P as PostCard } from "./PostCard-BSFkJYac.js";
import { U as UserCard } from "./UserCard-D6o9W57l.js";
import { u as useMyProfile, e as useFollowing, B as Button, f as useAllPosts, g as useSearchPosts, a as useListProfiles } from "./button-CGyXWe1l.js";
import { I as Input } from "./user-BWgjoBtF.js";
import { u as useAuth } from "./zap-DSkRDU80.js";
import { S as Sparkles } from "./sparkles-DnputVrC.js";
import { m as motion } from "./proxy-Bs7miKTM.js";
import { T as TrendingUp } from "./trending-up-aX7PvuJJ.js";
const PAGE_SIZE = 10n;
function PostSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16 ml-auto" })
    ] })
  ] });
}
function UserSuggestionSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-lg" })
  ] });
}
function SuggestedUsers({ myId, followingIds }) {
  var _a;
  const { data: profiles, isLoading } = useListProfiles(0n, 30n);
  const suggestions = reactExports.useMemo(() => {
    if (!(profiles == null ? void 0 : profiles.items)) return [];
    return profiles.items.filter(
      (p) => p.id.toString() !== myId && !followingIds.has(p.id.toString())
    ).slice(0, 6);
  }, [profiles, myId, followingIds]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block w-72 xl:w-80 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden sticky top-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Suggested for you" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/50", children: Array.from({ length: 4 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is stable
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserSuggestionSkeleton, {}, i)
    )) }) : suggestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "You're following everyone! 🎉" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "divide-y divide-border/50",
        "data-ocid": "explore.suggestions_list",
        children: suggestions.map((profile, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserCard,
          {
            profile,
            index: i + 1
          },
          profile.id.toString()
        ))
      }
    ),
    (((_a = profiles == null ? void 0 : profiles.items) == null ? void 0 : _a.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/explore",
        search: (prev) => ({ ...prev, q: void 0 }),
        className: "text-primary text-xs font-medium hover:underline",
        "data-ocid": "explore.see_more_users_link",
        children: "Discover more people"
      }
    ) })
  ] }) });
}
function SearchBar({ value, onChange, onSubmit, onClear }) {
  const handleKey = (e) => {
    if (e.key === "Enter") onSubmit();
    if (e.key === "Escape") onClear();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "text",
          placeholder: "Search posts by keyword...",
          value,
          onChange: (e) => onChange(e.target.value),
          onKeyDown: handleKey,
          className: "pl-9 pr-9 bg-background border-border focus-visible:ring-primary h-11",
          "data-ocid": "explore.search_input"
        }
      ),
      value && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClear,
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": "Clear search",
          "data-ocid": "explore.search_clear_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        onClick: onSubmit,
        className: "h-11 px-5 font-medium",
        "data-ocid": "explore.search_button",
        children: "Search"
      }
    )
  ] });
}
function PostsFeed({ searchQuery, isSearching }) {
  const [offset, setOffset] = reactExports.useState(0n);
  const [accumulatedPosts, setAccumulatedPosts] = reactExports.useState([]);
  const [allLoaded, setAllLoaded] = reactExports.useState(false);
  const initializedRef = reactExports.useRef(false);
  const prevOffsetRef = reactExports.useRef(0n);
  const { data: allPostsPage, isLoading: loadingAll } = useAllPosts(
    offset,
    PAGE_SIZE
  );
  const { data: searchResults, isLoading: loadingSearch } = useSearchPosts(searchQuery);
  reactExports.useEffect(() => {
    if (!(allPostsPage == null ? void 0 : allPostsPage.items)) return;
    const newItems = allPostsPage.items;
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
  const handleLoadMore = reactExports.useCallback(() => {
    setOffset((prev) => prev + PAGE_SIZE);
  }, []);
  if (isSearching) {
    if (loadingSearch) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(PostSkeleton, {}, i)
      )) });
    }
    if (!searchResults || searchResults.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: "🔍",
          title: "No posts found",
          description: `No posts match "${searchQuery}". Try different keywords.`,
          "data-ocid": "explore.search_empty_state"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "explore.search_results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: searchResults.length }),
        " ",
        "result",
        searchResults.length !== 1 ? "s" : "",
        " for “",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: searchQuery }),
        "”"
      ] }),
      searchResults.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.22, delay: Math.min(i * 0.05, 0.25) },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i + 1 })
        },
        post.id.toString()
      ))
    ] });
  }
  if (loadingAll && accumulatedPosts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Array.from({ length: 5 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(PostSkeleton, {}, i)
    )) });
  }
  if (accumulatedPosts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "✨",
        title: "Nothing here yet",
        description: "Be the first to post something amazing for the world to discover!",
        "data-ocid": "explore.empty_state"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "explore.posts_list", children: [
    accumulatedPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, delay: Math.min(i * 0.04, 0.32) },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i + 1 })
      },
      post.id.toString()
    )),
    !allLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center pt-4",
        "data-ocid": "explore.load_more_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleLoadMore,
            disabled: loadingAll,
            className: "min-w-36 border-border hover:border-primary/50 hover:text-primary transition-smooth",
            "data-ocid": "explore.load_more_button",
            children: loadingAll ? "Loading..." : "Load more posts"
          }
        )
      }
    ),
    allLoaded && accumulatedPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground py-6", children: "You've seen all posts ✓" })
  ] });
}
function ExplorePage() {
  const search = useSearch({ from: "/explore" });
  const initialQ = search.q;
  const [inputValue, setInputValue] = reactExports.useState(
    typeof initialQ === "string" ? initialQ : ""
  );
  const [activeQuery, setActiveQuery] = reactExports.useState(
    typeof initialQ === "string" ? initialQ : ""
  );
  reactExports.useEffect(() => {
    const q = typeof initialQ === "string" ? initialQ : "";
    setInputValue(q);
    setActiveQuery(q);
  }, [initialQ]);
  const { identity, isAuthenticated } = useAuth();
  const myId = isAuthenticated ? (identity == null ? void 0 : identity.getPrincipal().toString()) ?? null : null;
  const { data: myProfile } = useMyProfile();
  const { data: followingIds } = useFollowing(
    isAuthenticated && myProfile ? myProfile.id : null
  );
  const followingSet = reactExports.useMemo(
    () => new Set((followingIds ?? []).map((id) => id.toString())),
    [followingIds]
  );
  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setActiveQuery(trimmed);
  };
  const handleClear = () => {
    setInputValue("");
    setActiveQuery("");
  };
  const isSearching = activeQuery.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "explore.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl gradient-accent flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-lg text-foreground leading-tight", children: "Explore" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Discover posts from everyone" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SearchBar,
        {
          value: inputValue,
          onChange: setInputValue,
          onSubmit: handleSearch,
          onClear: handleClear
        }
      ),
      isSearching && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          className: "mt-2 flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Results for" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: activeQuery }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClear,
                className: "text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto underline underline-offset-2",
                "data-ocid": "explore.clear_search_button",
                children: "Clear"
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0", "data-ocid": "explore.feed_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostsFeed, { searchQuery: activeQuery, isSearching }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestedUsers, { myId, followingIds: followingSet })
    ] }) })
  ] }) });
}
export {
  ExplorePage as default
};
