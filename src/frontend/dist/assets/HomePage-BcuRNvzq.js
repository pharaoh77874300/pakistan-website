import { c as createLucideIcon, u as useAuth, a as useMyProfile, b as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, P as PageLoader, d as useListProfiles, S as Skeleton, e as useCreatePost, f as useQueryClient, g as PostPrivacy, A as Avatar, X, h as Lock, B as Button, i as useFeedPosts, k as ue } from "./index-xPxN8AW-.js";
import { E as EmptyState } from "./EmptyState-CJ3DDLhk.js";
import { I as ImageUpload } from "./ImageUpload-BuhIYJuS.js";
import { P as PostCard } from "./PostCard-CgD8i3r0.js";
import { U as UserCard } from "./UserCard-C2qTSCEc.js";
import { T as Textarea } from "./textarea-fj3e2o8j.js";
import { I as Image } from "./image-k6Ib0X9k.js";
import { G as Globe } from "./globe-kSpYvvB3.js";
import "./trash-2-Ct8i_2I0.js";
import "./share-2-CD7Th5Pc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 20a6 6 0 0 0-12 0", key: "1qehca" }],
  ["circle", { cx: "12", cy: "10", r: "4", key: "1h16sb" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const CircleUserRound = createLucideIcon("circle-user-round", __iconNode);
function CreatePostBox() {
  const { data: profile } = useMyProfile();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const qc = useQueryClient();
  const [content, setContent] = reactExports.useState("");
  const [image, setImage] = reactExports.useState(void 0);
  const [showUpload, setShowUpload] = reactExports.useState(false);
  const [privacy, setPrivacy] = reactExports.useState(PostPrivacy.public_);
  const textareaRef = reactExports.useRef(null);
  const handleContentChange = (e) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    const tempId = BigInt(Date.now()) * -1n;
    const optimisticPost = {
      id: tempId,
      authorId: (profile == null ? void 0 : profile.id) ?? {},
      content: content.trim(),
      imageBlob: image ?? void 0,
      likeCount: 0n,
      commentCount: 0n,
      likedByMe: false,
      createdAt: BigInt(Date.now()) * 1000000n,
      retweetCount: 0n,
      privacy
    };
    qc.setQueryData(
      ["feedPosts", "0"],
      (old) => ({
        items: [optimisticPost, ...(old == null ? void 0 : old.items) ?? []],
        total: ((old == null ? void 0 : old.total) ?? 0n) + 1n,
        nextOffset: old == null ? void 0 : old.nextOffset
      })
    );
    const prevContent = content;
    const prevImage = image;
    setContent("");
    setImage(void 0);
    setShowUpload(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    const prevPrivacy = privacy;
    setPrivacy(PostPrivacy.public_);
    try {
      await createPost({
        content: prevContent,
        imageBlob: prevImage,
        privacy: prevPrivacy
      });
      ue.success("Post published!");
    } catch {
      qc.setQueryData(["feedPosts", "0"], (old) => ({
        items: ((old == null ? void 0 : old.items) ?? []).filter((p) => p.id !== tempId),
        total: ((old == null ? void 0 : old.total) ?? 1n) - 1n,
        nextOffset: old == null ? void 0 : old.nextOffset
      }));
      setContent(prevContent);
      setImage(prevImage);
      setPrivacy(prevPrivacy);
      ue.error("Could not publish post");
    }
  };
  const canSubmit = content.trim().length > 0 || !!image;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 pt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Avatar,
      {
        blob: profile == null ? void 0 : profile.avatarBlob,
        name: profile == null ? void 0 : profile.username,
        size: "md"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          ref: textareaRef,
          placeholder: "What's on your mind?",
          value: content,
          onChange: handleContentChange,
          onKeyDown: (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (canSubmit && !isPending)
                handleSubmit(e);
            }
          },
          className: "resize-none border-0 bg-muted/30 focus:bg-muted/50 rounded-xl text-sm min-h-[80px] overflow-hidden transition-smooth",
          "data-ocid": "post.input"
        }
      ),
      showUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUpload,
          {
            value: image,
            onChange: setImage,
            label: "Add photo",
            aspect: "wide",
            "data-ocid": "post.image_upload"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setShowUpload(false);
              setImage(void 0);
            },
            className: "absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth",
            "aria-label": "Remove image",
            "data-ocid": "post.close_upload_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowUpload(!showUpload),
              className: `flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg transition-smooth ${showUpload ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`,
              "aria-label": "Add photo",
              "data-ocid": "post.add_image_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Photo" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setPrivacy(
                privacy === PostPrivacy.public_ ? PostPrivacy.followersOnly : PostPrivacy.public_
              ),
              className: `flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg transition-smooth ${privacy === PostPrivacy.followersOnly ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`,
              "aria-label": privacy === PostPrivacy.public_ ? "Public post" : "Followers only",
              "data-ocid": "post.privacy_toggle",
              children: [
                privacy === PostPrivacy.public_ ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: privacy === PostPrivacy.public_ ? "Public" : "Followers" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          content.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs tabular-nums ${content.length > 260 ? "text-destructive" : content.length > 200 ? "text-accent" : "text-muted-foreground"}`,
              children: 280 - content.length
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: isPending || !canSubmit || content.length > 280,
              className: "px-5 gradient-accent text-white border-0 disabled:opacity-50",
              "data-ocid": "post.submit_button",
              children: isPending ? "Posting…" : "Post"
            }
          )
        ] })
      ] })
    ] })
  ] }) }) });
}
function CompleteProfileBanner() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mx-4 mt-4 bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-start gap-3",
      "data-ocid": "home.complete_profile_banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUserRound, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: "Complete your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Add a username, avatar, and bio so people can find and follow you." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "mt-3 gradient-accent text-white border-0",
              onClick: () => navigate({ to: "/profile/edit" }),
              "data-ocid": "home.complete_profile_button",
              children: "Set up profile"
            }
          )
        ] })
      ]
    }
  );
}
function RecommendedUsers() {
  const { data: page, isLoading } = useListProfiles(0n, 5n);
  const navigate = useNavigate();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-3 text-sm", children: "Suggested" }),
      [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-32" })
        ] })
      ] }, i))
    ] });
  }
  const profiles = (page == null ? void 0 : page.items) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Suggested for you" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "text-xs text-primary hover:underline transition-smooth",
          onClick: () => navigate({ to: "/explore", search: { q: void 0 } }),
          "data-ocid": "home.see_all_button",
          children: "See all"
        }
      )
    ] }),
    profiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs px-4 pb-4", children: "No suggestions yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-2", children: profiles.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserCard, { profile: p, index: i + 1 }, p.id.toString())) })
  ] });
}
function FeedContent({ hasProfile }) {
  const navigate = useNavigate();
  const [offset, setOffset] = reactExports.useState(0n);
  const PAGE_SIZE = 20n;
  const {
    data: feedData,
    isLoading,
    isFetching
  } = useFeedPosts(offset, PAGE_SIZE);
  const [allPosts, setAllPosts] = reactExports.useState([]);
  const seenIds = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!(feedData == null ? void 0 : feedData.items)) return;
    const newPosts = [];
    for (const p of feedData.items) {
      const key = p.id.toString();
      if (!seenIds.current.has(key)) {
        seenIds.current.add(key);
        newPosts.push(p);
      }
    }
    if (offset === 0n) {
      seenIds.current = new Set(feedData.items.map((p) => p.id.toString()));
      setAllPosts(feedData.items);
    } else if (newPosts.length > 0) {
      setAllPosts((prev) => [...prev, ...newPosts]);
    }
  }, [feedData, offset]);
  const hasMore = (feedData == null ? void 0 : feedData.nextOffset) !== void 0 && feedData.nextOffset !== null;
  const handleLoadMore = () => {
    if ((feedData == null ? void 0 : feedData.nextOffset) !== void 0 && feedData.nextOffset !== null) {
      setOffset(feedData.nextOffset);
    }
  };
  if (isLoading && offset === 0n) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  }
  if (allPosts.length === 0 && !isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "✨",
        title: "Your feed is empty",
        description: hasProfile ? "Follow people to see their posts here, or share something of your own!" : "Set up your profile, then follow people to fill your feed.",
        action: {
          label: hasProfile ? "Explore people" : "Set up profile",
          onClick: () => hasProfile ? navigate({ to: "/explore", search: { q: void 0 } }) : navigate({ to: "/profile/edit" })
        },
        "data-ocid": "home.empty_state"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/50", children: [
    allPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i + 1 }) }, post.id.toString())),
    hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: handleLoadMore,
        disabled: isFetching,
        className: "min-w-[120px]",
        "data-ocid": "home.load_more_button",
        children: isFetching ? "Loading…" : "Load more"
      }
    ) }),
    !hasMore && allPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground text-xs", children: "You're all caught up! 🎉" })
  ] });
}
function HomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const rightPanel = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendedUsers, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground px-2", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-primary transition-smooth",
          children: "Built with caffeine.ai"
        }
      )
    ] })
  ] });
  if (isInitializing || isAuthenticated && profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { rightPanel, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) });
  }
  if (!isAuthenticated) return null;
  const hasProfile = !!profile;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { rightPanel, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CreatePostBox, {}),
    !hasProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(CompleteProfileBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeedContent, { hasProfile })
  ] });
}
export {
  HomePage as default
};
