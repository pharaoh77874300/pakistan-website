import { PostPrivacy } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useDeletePost,
  useFlagPost,
  useProfile,
  useToggleLike,
} from "@/hooks/use-backend";
import type { PostView, UserId } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Flag,
  Heart,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "./Avatar";

interface PostCardProps {
  post: PostView;
  index?: number;
  pinned?: boolean;
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function PostCard({ post, index = 1, pinned }: PostCardProps) {
  const { identity } = useAuth();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<bigint | null>(null);

  const liked = optimisticLiked ?? post.likedByMe;
  const likeCount = optimisticCount ?? post.likeCount;

  const { mutateAsync: toggleLike, isPending: liking } = useToggleLike();
  const { mutate: deletePost } = useDeletePost();
  const { data: authorProfile } = useProfile(post.authorId as UserId);

  const isOwner =
    identity?.getPrincipal().toString() === post.authorId.toString();

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { mutateAsync: flagPost, isPending: flagging } = useFlagPost();

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await flagPost({ postId: post.id, reason: reportReason.trim() });
      toast.success("Post reported. Moderators will review it.");
      setReportOpen(false);
      setReportReason("");
    } catch {
      toast.error("Could not report post. Please try again.");
    }
  };

  const handleLike = async () => {
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

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => toast.success("Post deleted"),
      onError: () => toast.error("Could not delete post"),
    });
  };

  return (
    <article
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-smooth"
      data-ocid={`post.item.${index}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <Link
          to="/profile/$userId"
          params={{ userId: post.authorId.toString() }}
          className="flex items-center gap-3 hover:opacity-80 transition-smooth min-w-0"
          data-ocid={`post.author_link.${index}`}
        >
          <Avatar
            blob={authorProfile?.avatarBlob}
            name={authorProfile?.username}
            size="md"
            avatarType={authorProfile?.avatarType === "3d" ? "3d" : "photo"}
            avatar3dConfig={authorProfile?.avatar3dConfig}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-display font-semibold text-foreground text-sm truncate">
                {authorProfile?.username ?? "Loading..."}
              </p>
              {pinned && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
                  <Pin className="w-2.5 h-2.5" />
                  Pinned
                </span>
              )}
              {post.privacy === PostPrivacy.followersOnly && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              data-ocid={`post.options_button.${index}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                data-ocid={`post.delete_button.${index}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete post
              </DropdownMenuItem>
            )}
            {identity && !isOwner && (
              <DropdownMenuItem
                onClick={() => setReportOpen(true)}
                data-ocid={`post.report_button.${index}`}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageBlob && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img
            src={post.imageBlob.getDirectURL()}
            alt="Post content"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-border/50">
        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-smooth hover:bg-primary/10 ${
            liked ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
          data-ocid={`post.like_button.${index}`}
        >
          <Heart
            className={`w-4 h-4 transition-smooth ${liked ? "fill-primary" : ""}`}
          />
          <span className="font-medium">{likeCount.toString()}</span>
        </button>

        <Link
          to="/post/$postId"
          params={{ postId: post.id.toString() }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
          data-ocid={`post.comment_button.${index}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.commentCount.toString()}</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth ml-auto"
          data-ocid={`post.share_button.${index}`}
        >
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="post.report_dialog">
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
            <DialogDescription>
              Tell us why this post should be reviewed by moderators.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for reporting..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="min-h-[80px]"
            data-ocid="post.report_input"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportOpen(false)}
              data-ocid="post.report_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              disabled={!reportReason.trim() || flagging}
              data-ocid="post.report_submit_button"
            >
              {flagging ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
