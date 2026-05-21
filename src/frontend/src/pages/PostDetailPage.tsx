import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useAddComment,
  useComments,
  useDeleteComment,
  usePost,
  useProfile,
  useToggleLike,
} from "@/hooks/use-backend";
import type { Comment, PostView, UserId } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Full Post View ───────────────────────────────────────────────────────────

interface PostDetailCardProps {
  post: PostView;
}

function PostDetailCard({ post }: PostDetailCardProps) {
  const { identity, isAuthenticated } = useAuth();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<bigint | null>(null);

  const liked = optimisticLiked ?? post.likedByMe;
  const likeCount = optimisticCount ?? post.likeCount;

  const { mutateAsync: toggleLike, isPending: liking } = useToggleLike();
  const { data: authorProfile } = useProfile(post.authorId as UserId);

  const _isOwner =
    identity?.getPrincipal().toString() === post.authorId.toString();

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to like posts");
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
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${post.id.toString()}`)
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Could not copy link"));
  };

  return (
    <article
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-ocid="post_detail.card"
    >
      {/* Author header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Link
          to="/profile/$userId"
          params={{ userId: post.authorId.toString() }}
          className="shrink-0"
          data-ocid="post_detail.author_link"
        >
          <Avatar
            blob={authorProfile?.avatarBlob}
            name={authorProfile?.username}
            size="md"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/profile/$userId"
            params={{ userId: post.authorId.toString() }}
            className="font-display font-semibold text-foreground hover:text-primary transition-colors leading-tight block truncate"
            data-ocid="post_detail.author_name"
          >
            {authorProfile?.username ?? "..."}
          </Link>
          <p className="text-muted-foreground text-xs mt-0.5">
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Full text content */}
      <div className="px-4 pb-3">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
          {post.content}
        </p>
      </div>

      {/* Full image display */}
      {post.imageBlob && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-border/50">
          <img
            src={post.imageBlob.getDirectURL()}
            alt="Post content"
            className="w-full object-contain max-h-[80vh]"
          />
        </div>
      )}

      {/* Like / comment counts bar */}
      <div className="px-4 py-2 flex items-center gap-4 text-muted-foreground text-sm border-t border-border/50">
        <span>
          <strong className="text-foreground">{likeCount.toString()}</strong>{" "}
          likes
        </span>
        <span>
          <strong className="text-foreground">
            {post.commentCount.toString()}
          </strong>{" "}
          comments
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 px-2 py-2 border-t border-border/50">
        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-primary/10 ${
            liked ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
          aria-label="Like post"
          data-ocid="post_detail.like_button"
        >
          <Heart
            className={`w-[18px] h-[18px] transition-smooth ${
              liked ? "fill-primary" : ""
            }`}
          />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
          aria-label="Comment"
          data-ocid="post_detail.comment_icon_button"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth ml-auto"
          aria-label="Share"
          data-ocid="post_detail.share_button"
        >
          <Share2 className="w-[18px] h-[18px]" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment;
  index: number;
  onDelete: () => void;
  isOwner: boolean;
}

function CommentItem({ comment, index, onDelete, isOwner }: CommentItemProps) {
  const { data: authorProfile } = useProfile(comment.authorId as UserId);

  return (
    <div className="flex gap-3 px-4 py-3" data-ocid={`comment.item.${index}`}>
      <Link
        to="/profile/$userId"
        params={{ userId: comment.authorId.toString() }}
        className="shrink-0"
      >
        <Avatar
          blob={authorProfile?.avatarBlob}
          name={authorProfile?.username}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-2xl px-3 py-2">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <Link
              to="/profile/$userId"
              params={{ userId: comment.authorId.toString() }}
              className="font-semibold text-foreground text-sm hover:text-primary transition-colors truncate"
              data-ocid={`comment.author_link.${index}`}
            >
              {authorProfile?.username ?? "Unknown"}
            </Link>
            {isOwner && (
              <button
                type="button"
                onClick={onDelete}
                className="text-muted-foreground hover:text-destructive transition-smooth p-0.5 shrink-0"
                aria-label="Delete comment"
                data-ocid={`comment.delete_button.${index}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-foreground text-sm leading-relaxed break-words">
            {comment.content}
          </p>
        </div>
        <p className="text-muted-foreground text-xs mt-1 ml-1">
          {timeAgo(comment.createdAt)}
        </p>
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostDetailPage() {
  const { postId } = useParams({ from: "/post/$postId" });
  const { identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  let postIdBigInt: bigint | null = null;
  try {
    postIdBigInt = BigInt(postId);
  } catch {
    // invalid id
  }

  const { data: post, isLoading: postLoading } = usePost(postIdBigInt);
  const { data: comments = [], isLoading: commentsLoading } =
    useComments(postIdBigInt);
  const { mutateAsync: addComment, isPending: adding } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !postIdBigInt) return;
    try {
      await addComment({ postId: postIdBigInt, content: comment.trim() });
      setComment("");
      toast.success("Comment added");
    } catch {
      toast.error("Could not add comment");
    }
  };

  if (postLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <EmptyState
            icon="💬"
            title="Post not found"
            description="This post may have been deleted or does not exist."
            action={{ label: "Go home", onClick: () => navigate({ to: "/" }) }}
            data-ocid="post_detail.empty_state"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full" data-ocid="post_detail.page">
        {/* Back button / breadcrumb */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium text-sm"
            aria-label="Go back"
            data-ocid="post_detail.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to feed</span>
          </button>
        </div>

        {/* Post card */}
        <div className="p-4">
          <PostDetailCard post={post} />
        </div>

        <Separator className="mx-4" />

        {/* Comments section */}
        <div className="pb-6" data-ocid="comments.section">
          {/* Comments header with count */}
          <div className="flex items-center gap-2 px-4 py-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">
              Comments
            </h2>
            <span className="text-muted-foreground text-xs bg-muted rounded-full px-2 py-0.5">
              {comments.length}
            </span>
          </div>

          <Separator className="mx-4 mb-2" />

          {/* Comments list */}
          <div className="divide-y divide-border/30" data-ocid="comments.list">
            {commentsLoading ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : comments.length === 0 ? (
              <div className="px-4 py-8">
                <EmptyState
                  icon="💬"
                  title="No comments yet"
                  description="Be the first to share your thoughts!"
                  data-ocid="comments.empty_state"
                />
              </div>
            ) : (
              comments.map((c, i) => (
                <CommentItem
                  key={c.id.toString()}
                  comment={c}
                  index={i + 1}
                  isOwner={
                    identity?.getPrincipal().toString() ===
                    c.authorId.toString()
                  }
                  onDelete={() =>
                    deleteComment(c.id, {
                      onError: () => toast.error("Could not delete comment"),
                    })
                  }
                />
              ))
            )}
          </div>

          {/* Add comment form — bottom of list */}
          <div className="mt-2 mx-4">
            <Separator className="mb-4" />
            {isAuthenticated ? (
              <form
                onSubmit={handleComment}
                className="flex gap-3"
                data-ocid="comment.form"
              >
                <Avatar
                  name={identity?.getPrincipal().toString().slice(0, 6)}
                  size="sm"
                />
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="resize-none text-sm bg-muted/50 border-border/50 focus:bg-card"
                    data-ocid="comment.input"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {comment.length}/500
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        adding || !comment.trim() || comment.length > 500
                      }
                      className="font-medium"
                      data-ocid="comment.submit_button"
                    >
                      {adding ? "Posting…" : "Post comment"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div
                className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border/50"
                data-ocid="comment.auth_prompt"
              >
                <p className="text-sm text-muted-foreground">
                  Sign in to join the conversation
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  data-ocid="comment.login_button"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
