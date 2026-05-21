import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-BuiRXQM6.js";
import { a as useListProfiles, B as Button, h as useIsFollowing, i as useFollowUser, j as useUnfollowUser, A as Avatar, d as ue } from "./button-CGyXWe1l.js";
import { u as useAuth, Z as Zap } from "./zap-DSkRDU80.js";
import { U as UserPlus } from "./user-plus-D5R3rqTE.js";
import { S as Sparkles } from "./sparkles-DnputVrC.js";
import { C as CircleCheck } from "./circle-check-BtwIwCJ6.js";
function OnboardingFollowPage() {
  const { isAuthenticated, isInitializing, identity } = useAuth();
  const navigate = useNavigate();
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const { data: profilesResult, isLoading } = useListProfiles(0n, 30n);
  const suggestions = ((profilesResult == null ? void 0 : profilesResult.items) ?? []).filter(
    (p) => p.id.toString() !== myPrincipal
  );
  const [followedIds, setFollowedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const handleDone = () => navigate({ to: "/" });
  const followCount = followedIds.size;
  if (isInitializing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "onboarding_follow.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Pakistan.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: 3, total: 3 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-3xl space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 text-accent mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl sm:text-3xl text-foreground mb-2", children: "Find people to follow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Follow a few people to make your feed come alive!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center gap-2",
              "data-ocid": "onboarding_follow.counter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-smooth ${followCount > 0 ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted border-border text-muted-foreground"}`,
                  children: [
                    followCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                    followCount > 0 ? `Following ${followCount} ${followCount === 1 ? "person" : "people"}` : "Follow a few people to make your feed come alive!"
                  ]
                }
              )
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
              "data-ocid": "onboarding_follow.loading_state",
              children: ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((skId) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-card border border-border rounded-2xl p-5 animate-pulse",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted mx-auto mb-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-3/4 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-muted rounded w-1/2 mx-auto mb-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted rounded-lg w-full" })
                  ]
                },
                skId
              ))
            }
          ) : suggestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-16 text-muted-foreground",
              "data-ocid": "onboarding_follow.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: "No suggestions yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Be one of the first! Your friends will show up here soon." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
              "data-ocid": "onboarding_follow.list",
              children: suggestions.map((profile, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SuggestedUserCard,
                {
                  profile,
                  index: i + 1,
                  onFollowChange: (id, followed) => {
                    setFollowedIds((prev) => {
                      const next = new Set(prev);
                      if (followed) next.add(id);
                      else next.delete(id);
                      return next;
                    });
                  }
                },
                profile.id.toString()
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "lg",
              onClick: handleDone,
              className: "px-10 gap-2",
              "data-ocid": "onboarding_follow.done_button",
              children: "Done — take me to my feed →"
            }
          ) })
        ] }) })
      ]
    }
  );
}
function SuggestedUserCard({
  profile,
  index,
  onFollowChange
}) {
  const { data: isFollowing } = useIsFollowing(profile.id);
  const { mutate: follow, isPending: followPending } = useFollowUser();
  const { mutate: unfollow, isPending: unfollowPending } = useUnfollowUser();
  const isPending = followPending || unfollowPending;
  const handleToggle = () => {
    if (isFollowing) {
      unfollow(profile.id, {
        onSuccess: () => onFollowChange(profile.id.toString(), false),
        onError: () => ue.error("Could not unfollow")
      });
    } else {
      follow(profile.id, {
        onSuccess: () => onFollowChange(profile.id.toString(), true),
        onError: () => ue.error("Could not follow")
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center transition-smooth hover:shadow-subtle",
      "data-ocid": `onboarding_follow.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: profile.avatarBlob, name: profile.username, size: "lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm mt-3 truncate w-full", children: profile.username }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs line-clamp-2 mt-1 mb-4 min-h-[2.5rem]", children: profile.bio || "No bio yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: isFollowing ? "outline" : "default",
            onClick: handleToggle,
            disabled: isPending,
            className: "w-full gap-1.5 text-xs",
            "data-ocid": `onboarding_follow.follow_button.${index}`,
            children: isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
              "Following"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-3.5 h-3.5" }),
              "Follow"
            ] })
          }
        )
      ]
    }
  );
}
function StepIndicator({ current, total }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2",
      "aria-label": `Step ${current} of ${total}`,
      children: [
        Array.from({ length: total }, (_, i) => i + 1).map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          step < current ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${step === current ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
              children: step
            }
          ),
          step < total && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-0.5 w-6 rounded-full ${step < current ? "bg-primary" : "bg-border"}`
            }
          )
        ] }, step)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
          "Step ",
          current,
          " of ",
          total
        ] })
      ]
    }
  );
}
export {
  OnboardingFollowPage as default
};
