import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-BuiRXQM6.js";
import { c as createLucideIcon, u as useAuth, b as useAuthStore, Z as Zap } from "./zap-DSkRDU80.js";
import { U as Users } from "./users-BYm_XI2t.js";
import { G as Globe } from "./globe-C-ieAYvu.js";
import { S as Sparkles } from "./sparkles-DnputVrC.js";
import { U as UserPlus } from "./user-plus-D5R3rqTE.js";
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
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode);
function SignupPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (user) {
      if (user.profile) {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/onboarding/welcome" });
      }
    }
  }, [user, navigate]);
  const highlights = [
    {
      icon: Camera,
      label: "Share moments",
      desc: "Post photos, videos, and stories with the world"
    },
    {
      icon: Users,
      label: "Connect with people",
      desc: "Follow creators, friends, and inspiring voices"
    },
    {
      icon: Globe,
      label: "Discover content",
      desc: "Explore trending topics and tailored feeds"
    },
    {
      icon: Sparkles,
      label: "Join communities",
      desc: "Find your tribe and engage in conversations that matter"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col lg:flex-row",
      "data-ocid": "signup.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-cover bg-center",
              style: {
                backgroundImage: "url('/assets/generated/social-hero.dim_1200x600.jpg')"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 backdrop-blur-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center max-w-md animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-foreground", children: "Pakistan.com" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl lg:text-5xl text-foreground mb-4 leading-tight", children: [
              "Start your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "journey" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-10", children: "Join millions of people sharing what matters most to them." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 gap-3 text-left", children: highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 transition-smooth hover:bg-card/80",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(h.icon, { className: "w-4 h-4 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: h.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: h.desc })
                  ] })
                ]
              },
              h.label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8 lg:w-[440px] bg-card border-l border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground", children: "Create your account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "It only takes a moment — no password required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: [
            { step: 1, text: "Authenticate with Internet Identity" },
            { step: 2, text: "Set up your profile & username" },
            { step: 3, text: "Start sharing and connecting" }
          ].map(({ step, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0", children: step }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: text })
          ] }, step)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: login,
              disabled: isInitializing || isLoggingIn,
              className: "w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl gradient-accent text-white font-semibold text-base hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated",
              "data-ocid": "signup.submit_button",
              children: isInitializing ? "Initializing..." : isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Creating account..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-5 h-5" }),
                "Sign up with Internet Identity"
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Internet Identity provides secure, passwordless authentication on the Internet Computer — no email or password needed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/login",
                className: "text-primary font-medium hover:underline",
                "data-ocid": "signup.login_link",
                children: "Log in"
              }
            )
          ] }) })
        ] }) })
      ]
    }
  );
}
export {
  SignupPage as default
};
