import { c as createLucideIcon, u as useAuth, j as jsxRuntimeExports, Z as Zap, l as Link } from "./index-Ccb6n9uY.js";
import { U as Users } from "./users-BfzvVCX3.js";
import { T as TrendingUp } from "./trending-up-CRb1auwZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function LoginPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();
  const features = [
    {
      icon: Users,
      label: "Follow people",
      desc: "Connect with creators and friends"
    },
    {
      icon: MessageSquare,
      label: "Join conversations",
      desc: "Comment, share, and discuss"
    },
    {
      icon: TrendingUp,
      label: "Explore trending",
      desc: "Discover what's popular now"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col lg:flex-row",
      "data-ocid": "login.page",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-foreground", children: "Pakistan" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl lg:text-5xl text-foreground mb-4 leading-tight", children: [
              "Your world,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "connected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-10", children: "Share moments, discover communities, and connect with people who inspire you." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 gap-3 text-left", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-4 h-4 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: f.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: f.desc })
                  ] })
                ]
              },
              f.label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8 lg:w-[440px] bg-card border-l border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground", children: "Welcome back" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Sign in with Internet Identity to continue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: login,
              disabled: isInitializing || isLoggingIn,
              className: "w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl gradient-accent text-white font-semibold text-base hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated",
              "data-ocid": "login.submit_button",
              children: isInitializing ? "Initializing..." : isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Signing in..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
                "Continue with Internet Identity"
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Internet Identity provides secure, passwordless authentication on the Internet Computer." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "By continuing, you agree to use this app in accordance with its purpose." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Don't have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/signup",
                  className: "text-primary font-medium hover:underline",
                  "data-ocid": "login.signup_link",
                  children: "Sign up"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  LoginPage as default
};
