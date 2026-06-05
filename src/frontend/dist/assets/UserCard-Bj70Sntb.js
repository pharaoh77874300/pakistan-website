import { u as useAuth, x as useIsFollowing, y as useFollowUser, z as useUnfollowUser, j as jsxRuntimeExports, l as Link, A as Avatar, t as BadgeCheck, B as Button, k as ue } from "./index-Ccb6n9uY.js";
function UserCard({ profile, index = 1 }) {
  const { identity, isAuthenticated } = useAuth();
  const isMe = (identity == null ? void 0 : identity.getPrincipal().toString()) === profile.id.toString();
  const { data: following } = useIsFollowing(
    isMe ? null : profile.id
  );
  const { mutate: follow, isPending: following_ } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowing } = useUnfollowUser();
  const handleFollow = () => {
    if (following) {
      unfollow(profile.id, {
        onError: () => ue.error("Could not unfollow")
      });
    } else {
      follow(profile.id, {
        onError: () => ue.error("Could not follow")
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth",
      "data-ocid": `user.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/profile/$userId",
            params: { userId: profile.id.toString() },
            className: "flex items-center gap-3 flex-1 min-w-0",
            "data-ocid": `user.profile_link.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: profile.avatarBlob, name: profile.username, size: "md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground text-sm truncate flex items-center gap-1", children: [
                  profile.username,
                  profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BadgeCheck,
                    {
                      className: "w-3.5 h-3.5 text-primary flex-shrink-0",
                      "aria-label": "Verified",
                      "data-ocid": `user.verified_badge.${index}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs truncate max-w-[150px]", children: profile.bio || "No bio yet" })
              ] })
            ]
          }
        ),
        isAuthenticated && !isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: following ? "outline" : "default",
            onClick: handleFollow,
            disabled: following_ || unfollowing,
            className: "flex-shrink-0 text-xs px-3",
            "data-ocid": `user.follow_button.${index}`,
            children: following ? "Unfollow" : "Follow"
          }
        )
      ]
    }
  );
}
export {
  UserCard as U
};
