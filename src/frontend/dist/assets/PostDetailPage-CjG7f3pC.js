import { M as useParams, u as useAuth, b as useNavigate, r as reactExports, T as usePost, a7 as useComments, a8 as useAddComment, a9 as useDeleteComment, j as jsxRuntimeExports, L as Layout, P as PageLoader, a6 as Separator, k as ue, A as Avatar, B as Button, l as Link, a1 as useToggleLike, O as useProfile, S as Skeleton } from "./index-Ccb6n9uY.js";
import { E as EmptyState, M as MessageCircle, H as Heart } from "./EmptyState-CyA6rgMG.js";
import { T as Textarea } from "./textarea-DMQd4hx4.js";
import { A as ArrowLeft } from "./arrow-left-JZl2qOAS.js";
import { S as Share2 } from "./share-2-B0XPrrBh.js";
import { T as Trash2 } from "./trash-2-BC5QzRoL.js";
function timeAgo(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1e3);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function PostDetailCard({ post }) {
  const { identity, isAuthenticated } = useAuth();
  const [optimisticLiked, setOptimisticLiked] = reactExports.useState(null);
  const [optimisticCount, setOptimisticCount] = reactExports.useState(null);
  const liked = optimisticLiked ?? post.likedByMe;
  const likeCount = optimisticCount ?? post.likeCount;
  const { mutateAsync: toggleLike, isPending: liking } = useToggleLike();
  const { data: authorProfile } = useProfile(post.authorId);
  (identity == null ? void 0 : identity.getPrincipal().toString()) === post.authorId.toString();
  const handleLike = async () => {
    if (!isAuthenticated) {
      ue.info("Sign in to like posts");
      return;
    }
    if (liking) return;
    setOptimisticLiked(!liked);
    setOptimisticCount(liked ? likeCount - 1n : likeCount + 1n);
    try {
      await toggleLike(post.id);
    } catch {
      setOptimisticLiked(null);
      setOptimisticCount(null);
    }
  };
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id.toString()}`).then(() => ue.success("Link copied!")).catch(() => ue.error("Could not copy link"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "bg-card border border-border rounded-2xl overflow-hidden",
      "data-ocid": "post_detail.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/profile/$userId",
              params: { userId: post.authorId.toString() },
              className: "shrink-0",
              "data-ocid": "post_detail.author_link",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  blob: authorProfile == null ? void 0 : authorProfile.avatarBlob,
                  name: authorProfile == null ? void 0 : authorProfile.username,
                  size: "md"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/profile/$userId",
                params: { userId: post.authorId.toString() },
                className: "font-display font-semibold text-foreground hover:text-primary transition-colors leading-tight block truncate",
                "data-ocid": "post_detail.author_name",
                children: (authorProfile == null ? void 0 : authorProfile.username) ?? "..."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: timeAgo(post.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-relaxed whitespace-pre-wrap text-[15px]", children: post.content }) }),
        post.imageBlob && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 mb-3 rounded-xl overflow-hidden border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.imageBlob.getDirectURL(),
            alt: "Post content",
            className: "w-full object-contain max-h-[80vh]"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 flex items-center gap-4 text-muted-foreground text-sm border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: likeCount.toString() }),
            " ",
            "likes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: post.commentCount.toString() }),
            " ",
            "comments"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-2 py-2 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLike,
              disabled: liking,
              className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-primary/10 ${liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`,
              "aria-label": "Like post",
              "data-ocid": "post_detail.like_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    className: `w-[18px] h-[18px] transition-smooth ${liked ? "fill-primary" : ""}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: liked ? "Liked" : "Like" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth",
              "aria-label": "Comment",
              "data-ocid": "post_detail.comment_icon_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-[18px] h-[18px]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Comment" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleShare,
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth ml-auto",
              "aria-label": "Share",
              "data-ocid": "post_detail.share_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-[18px] h-[18px]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Share" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function CommentItem({ comment, index, onDelete, isOwner }) {
  const { data: authorProfile } = useProfile(comment.authorId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-4 py-3", "data-ocid": `comment.item.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/profile/$userId",
        params: { userId: comment.authorId.toString() },
        className: "shrink-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            blob: authorProfile == null ? void 0 : authorProfile.avatarBlob,
            name: authorProfile == null ? void 0 : authorProfile.username,
            size: "sm"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-2xl px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/profile/$userId",
              params: { userId: comment.authorId.toString() },
              className: "font-semibold text-foreground text-sm hover:text-primary transition-colors truncate",
              "data-ocid": `comment.author_link.${index}`,
              children: (authorProfile == null ? void 0 : authorProfile.username) ?? "Unknown"
            }
          ),
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDelete,
              className: "text-muted-foreground hover:text-destructive transition-smooth p-0.5 shrink-0",
              "aria-label": "Delete comment",
              "data-ocid": `comment.delete_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm leading-relaxed break-words", children: comment.content })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1 ml-1", children: timeAgo(comment.createdAt) })
    ] })
  ] });
}
function CommentSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-2xl" })
    ] })
  ] });
}
function PostDetailPage() {
  const { postId } = useParams({ from: "/post/$postId" });
  const { identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = reactExports.useState("");
  let postIdBigInt = null;
  try {
    postIdBigInt = BigInt(postId);
  } catch {
  }
  const { data: post, isLoading: postLoading } = usePost(postIdBigInt);
  const { data: comments = [], isLoading: commentsLoading } = useComments(postIdBigInt);
  const { mutateAsync: addComment, isPending: adding } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !postIdBigInt) return;
    try {
      await addComment({ postId: postIdBigInt, content: comment.trim() });
      setComment("");
      ue.success("Comment added");
    } catch {
      ue.error("Could not add comment");
    }
  };
  if (postLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) });
  }
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "💬",
        title: "Post not found",
        description: "This post may have been deleted or does not exist.",
        action: { label: "Go home", onClick: () => navigate({ to: "/" }) },
        "data-ocid": "post_detail.empty_state"
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto w-full", "data-ocid": "post_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/" }),
        className: "flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium text-sm",
        "aria-label": "Go back",
        "data-ocid": "post_detail.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back to feed" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostDetailCard, { post }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mx-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-6", "data-ocid": "comments.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm", children: "Comments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs bg-muted rounded-full px-2 py-0.5", children: comments.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mx-4 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/30", "data-ocid": "comments.list", children: commentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommentSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommentSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommentSkeleton, {})
      ] }) : comments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: "💬",
          title: "No comments yet",
          description: "Be the first to share your thoughts!",
          "data-ocid": "comments.empty_state"
        }
      ) }) : comments.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CommentItem,
        {
          comment: c,
          index: i + 1,
          isOwner: (identity == null ? void 0 : identity.getPrincipal().toString()) === c.authorId.toString(),
          onDelete: () => deleteComment(c.id, {
            onError: () => ue.error("Could not delete comment")
          })
        },
        c.id.toString()
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 mx-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
        isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleComment,
            className: "flex gap-3",
            "data-ocid": "comment.form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  name: identity == null ? void 0 : identity.getPrincipal().toString().slice(0, 6),
                  size: "sm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Add a comment…",
                    value: comment,
                    onChange: (e) => setComment(e.target.value),
                    rows: 2,
                    className: "resize-none text-sm bg-muted/50 border-border/50 focus:bg-card",
                    "data-ocid": "comment.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    comment.length,
                    "/500"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      size: "sm",
                      disabled: adding || !comment.trim() || comment.length > 500,
                      className: "font-medium",
                      "data-ocid": "comment.submit_button",
                      children: adding ? "Posting…" : "Post comment"
                    }
                  )
                ] })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border/50",
            "data-ocid": "comment.auth_prompt",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in to join the conversation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  asChild: true,
                  "data-ocid": "comment.login_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign in" })
                }
              )
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  PostDetailPage as default
};
