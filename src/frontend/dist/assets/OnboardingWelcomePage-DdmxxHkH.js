import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-BuiRXQM6.js";
import { u as useAuth, b as useAuthStore, Z as Zap } from "./zap-DSkRDU80.js";
import { U as Users } from "./users-BYm_XI2t.js";
import { S as Sparkles } from "./sparkles-DnputVrC.js";
import { G as Globe } from "./globe-C-ieAYvu.js";
const features = [
  {
    icon: Users,
    title: "Connect",
    desc: "Build meaningful relationships with people who share your passions and ambitions.",
    color: "text-primary bg-primary/15"
  },
  {
    icon: Sparkles,
    title: "Share",
    desc: "Post photos, thoughts, and stories that reflect who you are to the world.",
    color: "text-accent bg-accent/15"
  },
  {
    icon: Globe,
    title: "Discover",
    desc: "Explore trending topics, new voices, and communities you didn't know you needed.",
    color: "text-primary bg-primary/15"
  }
];
function OnboardingWelcomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const handleGetStarted = () => {
    navigate({ to: "/onboarding/profile" });
  };
  const handleSkip = () => {
    navigate({ to: "/" });
  };
  if (isInitializing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center relative overflow-hidden",
      "data-ocid": "onboarding_welcome.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-y-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-7 h-7 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-foreground tracking-tight", children: "Pakistan.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4", children: [
            "Your professional",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "social world" }),
            " ",
            "starts here"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-lg sm:text-xl max-w-lg mb-10", children: [
            "Welcome",
            (user == null ? void 0 : user.profile) ? `, ${user.profile.username}` : "",
            "! You're now part of a community where great connections happen every day."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3 bg-card/70 backdrop-blur-sm border border-border/60 rounded-2xl p-5 shadow-subtle transition-smooth hover:shadow-elevated hover:-translate-y-0.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-base mb-1", children: f.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: f.desc })
                ] })
              ]
            },
            f.title
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleGetStarted,
              className: "w-full sm:w-auto px-10 py-4 rounded-2xl gradient-accent text-white font-display font-semibold text-lg shadow-elevated hover:opacity-90 transition-smooth hover:-translate-y-0.5 active:translate-y-0 mb-4",
              "data-ocid": "onboarding_welcome.get_started_button",
              children: "Get Started →"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSkip,
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline",
              "data-ocid": "onboarding_welcome.skip_link",
              children: "Skip setup — take me to my feed"
            }
          )
        ] })
      ]
    }
  );
}
export {
  OnboardingWelcomePage as default
};
