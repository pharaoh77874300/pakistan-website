import { c as createLucideIcon, j as jsxRuntimeExports, R as Root, C as Content, D as Close, X, E as cn, T as Title, F as Portal, O as Overlay, G as useParams, u as useAuth, b as useNavigate, r as reactExports, H as Principal, J as useProfile, K as useUserPosts, M as usePinnedPosts, x as useIsFollowing, y as useFollowUser, z as useUnfollowUser, L as Layout, o as motion, A as Avatar, B as Button, N as UserCheck, t as BadgeCheck, Q as Badge, S as Skeleton, k as ue, V as usePost, s as AnimatePresence, W as useFollowers, n as useFollowing, l as Link } from "./index-xPxN8AW-.js";
import { E as EmptyState, H as Heart, M as MessageCircle } from "./EmptyState-CJ3DDLhk.js";
import { a as Pin, P as PostCard } from "./PostCard-CgD8i3r0.js";
import { U as UserPlus } from "./user-plus-D4doLz4X.js";
import "./textarea-fj3e2o8j.js";
import "./trash-2-Ct8i_2I0.js";
import "./share-2-CD7Th5Pc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6", key: "pblm9e" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18", key: "nf6bnh" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2", key: "12espp" }]
];
const Images = createLucideIcon("images", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function LightboxModal({
  images,
  initialIndex,
  onClose
}) {
  const [idx, setIdx] = reactExports.useState(initialIndex);
  const post = images[idx];
  const timeAgo = (ts) => {
    const diff = Date.now() - Number(ts) / 1e6;
    if (diff < 6e4) return "just now";
    if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
    if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
    return new Date(Number(ts) / 1e6).toLocaleDateString();
  };
  const prev = reactExports.useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = reactExports.useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);
  if (!(post == null ? void 0 : post.imageBlob)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4",
      onClick: onClose,
      "data-ocid": "profile.lightbox",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.92, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.92, opacity: 0 },
          transition: { duration: 0.2 },
          className: "relative bg-card rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-elevated",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-foreground/20 hover:bg-foreground/40 text-white flex items-center justify-center transition-smooth",
                "data-ocid": "profile.lightbox.close_button",
                "aria-label": "Close lightbox",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden bg-muted min-h-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: post.imageBlob.getDirectURL(),
                  alt: "Post content",
                  className: "w-full object-contain max-h-[60vh]"
                }
              ),
              images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: prev,
                    className: "absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/30 hover:bg-foreground/50 text-white flex items-center justify-center transition-smooth",
                    "data-ocid": "profile.lightbox.prev_button",
                    "aria-label": "Previous image",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: next,
                    className: "absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/30 hover:bg-foreground/50 text-white flex items-center justify-center transition-smooth",
                    "data-ocid": "profile.lightbox.next_button",
                    "aria-label": "Next image",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2 border-t border-border", children: [
              post.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed line-clamp-3", children: post.content }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3.5 h-3.5" }),
                  post.likeCount.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5" }),
                  post.commentCount.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto", children: timeAgo(post.createdAt) })
              ] }),
              images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
                idx + 1,
                " / ",
                images.length
              ] })
            ] })
          ]
        }
      )
    }
  ) });
}
function PinnedPostItem({ postId, index }) {
  const { data: post } = usePost(postId);
  if (!post) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": `profile.pinned.item.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -left-1 z-10 bg-primary rounded-full p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-2.5 h-2.5 text-primary-foreground fill-current" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index })
  ] });
}
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 md:h-56 w-full rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-12 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-full ring-4 ring-card flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-9 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" })
      ] })
    ] })
  ] });
}
function StatButton({
  count,
  label,
  ocid,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "flex flex-col items-center gap-0.5 group cursor-pointer hover:opacity-80 transition-smooth disabled:cursor-default",
      disabled: !onClick,
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors", children: count.toString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
      ]
    }
  );
}
function UserRow({
  userId,
  onClose
}) {
  const { data: profile } = useProfile(userId);
  const pid = userId.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/profile/$userId",
      params: { userId: pid },
      onClick: onClose,
      className: "flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-smooth",
      "data-ocid": "profile.user_list.item",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            blob: profile == null ? void 0 : profile.avatarBlob,
            name: (profile == null ? void 0 : profile.username) ?? pid.slice(0, 5),
            size: "md"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: (profile == null ? void 0 : profile.username) ?? `${pid.slice(0, 8)}…` }),
          (profile == null ? void 0 : profile.bio) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: profile.bio })
        ] })
      ]
    }
  );
}
function UserListSheet({
  open,
  onOpenChange,
  title,
  userId,
  type
}) {
  const { data: followers } = useFollowers(
    type === "followers" && open ? userId : null
  );
  const { data: following } = useFollowing(
    type === "following" && open ? userId : null
  );
  const items = type === "followers" ? followers : following;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[70vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-display", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "overflow-y-auto mt-4 space-y-1 pr-1",
        style: { maxHeight: "calc(70vh - 80px)" },
        children: !items ? Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable ID
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
          ] }, i)
        )) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-muted-foreground py-8 text-sm", children: [
          "No ",
          type,
          " yet"
        ] }) : items.map((uid) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserRow,
          {
            userId: uid,
            onClose: () => onOpenChange(false)
          },
          uid.toString()
        ))
      }
    )
  ] }) });
}
function ProfilePage() {
  const { userId } = useParams({ from: "/profile/$userId" });
  const { identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sheetType, setSheetType] = reactExports.useState(
    null
  );
  const [activeTab, setActiveTab] = reactExports.useState("posts");
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(null);
  let principal = null;
  try {
    principal = Principal.fromText(userId);
  } catch {
  }
  const isMe = (identity == null ? void 0 : identity.getPrincipal().toString()) === userId;
  const { data: profile, isLoading: profileLoading } = useProfile(principal);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(principal);
  const { data: pinnedPostIds } = usePinnedPosts(principal);
  const { data: isFollowing } = useIsFollowing(isMe ? null : principal);
  const { mutate: follow, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollow, isPending: isUnfollowPending } = useUnfollowUser();
  const posts = (postsData == null ? void 0 : postsData.items) ?? [];
  const mediaPosts = posts.filter((p) => !!p.imageBlob);
  const isBusy = isFollowPending || isUnfollowPending;
  const handleFollow = () => {
    if (!principal) return;
    if (isFollowing) {
      unfollow(principal, { onError: () => ue.error("Could not unfollow") });
    } else {
      follow(principal, { onError: () => ue.error("Could not follow") });
    }
  };
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {}) });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "👤",
        title: "User not found",
        description: "This profile doesn't exist or may have been removed.",
        action: { label: "Go home", onClick: () => navigate({ to: "/" }) },
        "data-ocid": "profile.empty_state"
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "profile.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 md:h-56 bg-muted overflow-hidden", children: [
        profile.coverBlob ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: profile.coverBlob.getDirectURL(),
            alt: "Cover banner",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full gradient-accent opacity-25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/60 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-0 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-12 md:-mt-14 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0.85, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { duration: 0.35, ease: "backOut" },
                className: "flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Avatar,
                  {
                    blob: profile.avatarBlob,
                    name: profile.username,
                    size: "xl",
                    className: "w-24 h-24 md:w-28 md:h-28 ring-4 ring-card shadow-elevated text-2xl"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pb-1", children: isMe ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "rounded-full font-semibold px-5 transition-smooth",
                onClick: () => navigate({ to: "/profile/edit" }),
                "data-ocid": "profile.edit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Edit profile"
                ]
              }
            ) : isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: isFollowing ? "outline" : "default",
                className: "rounded-full font-semibold px-5 transition-smooth",
                onClick: handleFollow,
                disabled: isBusy,
                "data-ocid": "profile.follow_button",
                children: isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Following"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Follow"
                ] })
              }
            ) : null })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.1 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground leading-tight", children: profile.username }),
                  profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BadgeCheck,
                    {
                      className: "w-5 h-5 text-primary flex-shrink-0",
                      "aria-label": "Verified",
                      "data-ocid": "profile.verified_badge"
                    }
                  ),
                  isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-[10px] px-1.5 py-0 font-medium",
                      children: "You"
                    }
                  )
                ] }),
                profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed max-w-md", children: profile.bio })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "flex gap-6 mt-4",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.18 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatButton,
                  {
                    count: profile.postCount,
                    label: "Posts",
                    ocid: "profile.stats.posts"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatButton,
                  {
                    count: profile.followerCount,
                    label: "Followers",
                    onClick: () => setSheetType("followers"),
                    ocid: "profile.stats.followers"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatButton,
                  {
                    count: profile.followingCount,
                    label: "Following",
                    onClick: () => setSheetType("following"),
                    ocid: "profile.stats.following"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("posts"),
              className: `flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-smooth ${activeTab === "posts" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"}`,
              "data-ocid": "profile.posts_tab",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-4 h-4" }),
                "Posts"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("media"),
              className: `flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-smooth ${activeTab === "media" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"}`,
              "data-ocid": "profile.media_tab",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "w-4 h-4" }),
                "Photos"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-[40vh]", children: [
        activeTab === "posts" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          pinnedPostIds && pinnedPostIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 pt-4 pb-2",
              "data-ocid": "profile.pinned_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3 h-3" }),
                  "Pinned Posts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: pinnedPostIds.map((pid, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PinnedPostItem,
                  {
                    postId: pid,
                    index: i + 1
                  },
                  pid.toString()
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 border-t border-border/40" })
              ]
            }
          ),
          postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable ID
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" })
            ] }, i)
          )) }) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: "✨",
              title: isMe ? "Share your first post" : "No posts yet",
              description: isMe ? "Express yourself — your posts will appear here." : `${profile.username} hasn't posted anything yet.`,
              action: isMe ? {
                label: "Create post",
                onClick: () => navigate({ to: "/" })
              } : void 0,
              "data-ocid": "profile.posts.empty_state"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "divide-y divide-border/40",
              initial: "hidden",
              animate: "visible",
              variants: {
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } }
              },
              children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  variants: {
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 }
                  },
                  transition: { duration: 0.28, ease: "easeOut" },
                  className: "px-4 py-3",
                  "data-ocid": `profile.post.item.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i + 1 })
                },
                post.id.toString()
              ))
            }
          )
        ] }),
        activeTab === "media" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "aspect-square w-full rounded-lg"
          },
          i
        )) }) : mediaPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: "🖼️",
            title: "No photos yet",
            description: isMe ? "Your photo posts will appear here." : `${profile.username} hasn't shared any photos.`,
            "data-ocid": "profile.media.empty_state"
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "grid grid-cols-3 gap-1",
            initial: "hidden",
            animate: "visible",
            variants: {
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } }
            },
            children: mediaPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                onClick: () => setLightboxIndex(i),
                variants: {
                  hidden: { opacity: 0, scale: 0.92 },
                  visible: { opacity: 1, scale: 1 }
                },
                transition: { duration: 0.22, ease: "easeOut" },
                className: "relative aspect-square w-full rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "data-ocid": `profile.media.item.${i + 1}`,
                "aria-label": `Open photo ${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: post.imageBlob.getDirectURL(),
                      alt: `Post ${i + 1}`,
                      className: "w-full h-full object-cover transition-smooth group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-smooth" })
                ]
              },
              post.id.toString()
            ))
          }
        ) })
      ] }),
      lightboxIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
        LightboxModal,
        {
          images: mediaPosts,
          initialIndex: lightboxIndex,
          onClose: () => setLightboxIndex(null)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UserListSheet,
      {
        open: sheetType === "followers",
        onOpenChange: (v) => !v && setSheetType(null),
        title: `Followers · ${profile.followerCount.toString()}`,
        userId: principal,
        type: "followers"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UserListSheet,
      {
        open: sheetType === "following",
        onOpenChange: (v) => !v && setSheetType(null),
        title: `Following · ${profile.followingCount.toString()}`,
        userId: principal,
        type: "following"
      }
    )
  ] });
}
export {
  ProfilePage as default
};
