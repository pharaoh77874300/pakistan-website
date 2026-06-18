import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
} from "@/hooks/use-backend";
import type { ProfileView, UserId } from "@/types";
import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "./Avatar";

interface UserCardProps {
  profile: ProfileView;
  index?: number;
}

export function UserCard({ profile, index = 1 }: UserCardProps) {
  const { identity, isAuthenticated } = useAuth();
  const isMe = identity?.getPrincipal().toString() === profile.id.toString();
  const { data: following } = useIsFollowing(
    isMe ? null : (profile.id as UserId),
  );
  const { mutate: follow, isPending: following_ } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowing } = useUnfollowUser();

  const handleFollow = () => {
    if (following) {
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
    <div
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth"
      data-ocid={`user.item.${index}`}
    >
      <Link
        to="/profile/$userId"
        params={{ userId: profile.id.toString() }}
        className="flex items-center gap-3 flex-1 min-w-0"
        data-ocid={`user.profile_link.${index}`}
      >
        <Avatar
          blob={profile.avatarBlob}
          name={profile.username}
          size="md"
          avatarType={profile.avatarType === "3d" ? "3d" : "photo"}
          avatar3dConfig={profile.avatar3dConfig}
        />
        <div className="min-w-0">
          <p className="font-display font-semibold text-foreground text-sm truncate flex items-center gap-1">
            {profile.username}
            {profile.isVerified && (
              <BadgeCheck
                className="w-3.5 h-3.5 text-primary flex-shrink-0"
                aria-label="Verified"
                data-ocid={`user.verified_badge.${index}`}
              />
            )}
          </p>
          <p className="text-muted-foreground text-xs truncate max-w-[150px]">
            {profile.bio || "No bio yet"}
          </p>
        </div>
      </Link>
      {isAuthenticated && !isMe && (
        <Button
          size="sm"
          variant={following ? "outline" : "default"}
          onClick={handleFollow}
          disabled={following_ || unfollowing}
          className="flex-shrink-0 text-xs px-3"
          data-ocid={`user.follow_button.${index}`}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
}
