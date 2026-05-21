import { a as create, c as createLucideIcon, u as useAuth, Z as Zap } from "./zap-DSkRDU80.js";
import { h as useRouterState, r as reactExports, j as jsxRuntimeExports, u as useNavigate, L as Link } from "./index-BuiRXQM6.js";
import { $ as $e, u as useMyProfile, A as Avatar } from "./button-CGyXWe1l.js";
import { I as Input, U as User } from "./user-BWgjoBtF.js";
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
var M = (e, i, s, u, m, a, l, h) => {
  let d = document.documentElement, w = ["light", "dark"];
  function p(n) {
    (Array.isArray(e) ? e : [e]).forEach((y) => {
      let k = y === "class", S = k && a ? m.map((f) => a[f] || f) : m;
      k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
    }), R(n);
  }
  function R(n) {
    h && w.includes(n) && (d.style.colorScheme = n);
  }
  function c() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (u) p(u);
  else try {
    let n = localStorage.getItem(i) || s, y = l && n === "system" ? c() : n;
    p(y);
  } catch (n) {
  }
};
var x = reactExports.createContext(void 0), U = { setTheme: (e) => {
}, themes: [] }, z = () => {
  var e;
  return (e = reactExports.useContext(x)) != null ? e : U;
};
reactExports.memo(({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w }) => {
  let p = JSON.stringify([s, i, a, e, h, l, u, m]).slice(1, -1);
  return reactExports.createElement("script", { ...w, suppressHydrationWarning: true, nonce: typeof window == "undefined" ? d : "", dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` } });
});
const Toaster = ({ ...props }) => {
  const { theme = "system" } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    $e,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, void 0)),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => window.localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  let hydrationVersion = 0;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    return setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      return setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    const currentVersion = ++hydrationVersion;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            const migration = options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
            if (migration instanceof Promise) {
              return migration.then((result) => [true, result]);
            }
            return [true, migration];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      if (currentVersion !== hydrationVersion) {
        return;
      }
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;
const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        applyTheme(next);
      }
    }),
    { name: "connectsphere-theme" }
  )
);
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
const stored = localStorage.getItem("connectsphere-theme");
const initial = stored ? JSON.parse(stored).state.theme : "dark";
applyTheme(initial);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Compass = createLucideIcon("compass", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
];
const Moon = createLucideIcon("moon", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, identity, login } = useAuth();
  const { data: profile } = useMyProfile();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate({ to: "/explore", search: { q: search.trim() } });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-3 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/",
        className: "lg:hidden flex items-center gap-2 flex-shrink-0",
        "data-ocid": "header.brand_link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-base text-foreground", children: "ConnectSphere" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSearch, className: "flex-1 max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search ConnectSphere...",
          className: "pl-9 h-9 bg-muted/50 border-border/50 focus:bg-card",
          "data-ocid": "header.search_input"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: toggleTheme,
          className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth",
          "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          "data-ocid": "header.theme_toggle",
          children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-4 h-4" })
        }
      ),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/explore", search: { q: void 0 } }),
          className: "relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth",
          "aria-label": "Explore (notifications coming soon)",
          title: "Notifications coming soon",
          "data-ocid": "header.notifications_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" })
        }
      ),
      isAuthenticated && identity ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({
            to: "/profile/$userId",
            params: { userId: identity.getPrincipal().toString() }
          }),
          className: "flex items-center gap-2 ml-1 hover:opacity-80 transition-smooth",
          "aria-label": "View your profile",
          "data-ocid": "header.user_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              blob: profile == null ? void 0 : profile.avatarBlob,
              name: profile == null ? void 0 : profile.username,
              size: "sm"
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: login,
          className: "ml-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-smooth",
          "data-ocid": "header.login_button",
          children: "Sign in"
        }
      )
    ] })
  ] });
}
function MobileNav() {
  const location = useLocation();
  const { isAuthenticated, identity } = useAuth();
  const items = [
    {
      to: "/",
      label: "Home",
      icon: House,
      exact: true,
      ocid: "mobile_nav.home_link"
    },
    {
      to: "/explore",
      label: "Explore",
      icon: Compass,
      exact: false,
      ocid: "mobile_nav.explore_link"
    },
    ...isAuthenticated && identity ? [
      {
        to: `/profile/${identity.getPrincipal().toString()}`,
        label: "Profile",
        icon: User,
        exact: false,
        ocid: "mobile_nav.profile_link"
      }
    ] : [
      {
        to: "/login",
        label: "Sign In",
        icon: LogIn,
        exact: false,
        ocid: "mobile_nav.login_link"
      }
    ]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-center justify-around h-16 px-2 safe-area-pb", children: items.map((item) => {
    const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: `flex flex-col items-center gap-1 flex-1 py-1 transition-smooth ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": item.ocid,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: item.label })
        ]
      },
      item.to
    );
  }) });
}
const navItems = [
  { to: "/", label: "Home", icon: House, exact: true },
  { to: "/explore", label: "Explore", icon: Compass }
];
function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, identity, login, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-border bg-card py-6 px-4 gap-1 flex-shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/",
        className: "flex items-center gap-2.5 px-3 mb-6 hover:opacity-90 transition-smooth",
        "data-ocid": "nav.brand_link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xl text-foreground", children: "ConnectSphere" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-1 flex-1", children: [
      navItems.map((item) => {
        const active = isActive(item.to, item.exact);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
            "data-ocid": `nav.${item.label.toLowerCase()}_link`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-5 h-5" }),
              item.label
            ]
          },
          item.to
        );
      }),
      isAuthenticated && identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/profile/$userId",
          params: { userId: identity.getPrincipal().toString() },
          className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${location.pathname.startsWith("/profile") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
          "data-ocid": "nav.profile_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5" }),
            "Profile"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto border-t border-border pt-4", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Avatar,
        {
          blob: profile == null ? void 0 : profile.avatarBlob,
          name: profile == null ? void 0 : profile.username,
          size: "sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (profile == null ? void 0 : profile.username) ?? "You" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: (profile == null ? void 0 : profile.bio) ?? "No bio" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: logout,
          className: "text-muted-foreground hover:text-destructive transition-smooth p-1.5 rounded-lg hover:bg-destructive/10",
          "aria-label": "Logout",
          "data-ocid": "nav.logout_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: login,
        className: "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth",
        "data-ocid": "nav.login_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
          "Sign in"
        ]
      }
    ) })
  ] });
}
function Layout({ children, rightPanel }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0 max-w-2xl mx-auto w-full px-0 pb-20 lg:pb-0", children }),
        rightPanel && /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden xl:block w-80 flex-shrink-0 py-6 pr-6", children: rightPanel })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "bottom-right", richColors: true })
  ] });
}
export {
  Layout as L,
  Search as S,
  Trash2 as T
};
