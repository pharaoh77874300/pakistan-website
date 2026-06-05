import { c as createLucideIcon, r as reactExports, C as useControllableState, j as jsxRuntimeExports, D as Primitive, E as composeEventHandlers, G as createContextScope, K as cn, N as Principal, b as useNavigate, an as useGetMyAdminRole, ao as useGetOwner, ap as useListModerators, aq as useListFlags, ar as useListActivityLog, as as useClaimOwnerRole, at as useAddModerator, au as useRemoveModerator, av as useResolveFlag, aw as useDismissFlag, ax as useAdminRemovePost, ay as useAdminRemoveComment, az as useAdminSuspendUser, aA as useAdminUnsuspendUser, aB as AdminRole, aC as FlagStatus, L as Layout, S as Skeleton, aD as Shield, B as Button, aE as FlagTargetKind, I as Input, k as ue } from "./index-Ccb6n9uY.js";
import { B as Badge } from "./badge-B1ceX0-P.js";
import { T as TriangleAlert, C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-CFLncRkR.js";
import { b as useDirection, u as useId, R as Root, I as Item, P as Presence, d as createRovingFocusGroupScope } from "./index-a7GLAC_G.js";
import { T as Trash2 } from "./trash-2-BC5QzRoL.js";
import { U as Users } from "./users-BfzvVCX3.js";
import { U as UserCheck } from "./user-check-68zcrl7K.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function createPrincipal(text) {
  return Principal.fromText(text);
}
function StatCard({
  label,
  value,
  icon: Icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-foreground mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6" }) })
  ] }) }) });
}
function FlagStatusBadge({ status }) {
  if (status === FlagStatus.pending)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-800 border-amber-200", children: "Pending" });
  if (status === FlagStatus.resolved)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20", children: "Resolved" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-muted text-muted-foreground", children: "Dismissed" });
}
function FlagKindBadge({ kind }) {
  const map = {
    [FlagTargetKind.post]: "bg-blue-100 text-blue-800",
    [FlagTargetKind.comment]: "bg-purple-100 text-purple-800",
    [FlagTargetKind.user]: "bg-red-100 text-red-800"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: map[kind] ?? "bg-muted", children: kind });
}
function AdminPage() {
  const navigate = useNavigate();
  const { data: myRole, isLoading: roleLoading } = useGetMyAdminRole();
  const { data: owner } = useGetOwner();
  const { data: moderators = [], isLoading: modLoading } = useListModerators();
  const { data: allFlags = [], isLoading: flagsLoading } = useListFlags();
  const { data: activityLog = [] } = useListActivityLog();
  const claimOwner = useClaimOwnerRole();
  const addModerator = useAddModerator();
  const removeModerator = useRemoveModerator();
  const resolveFlag = useResolveFlag();
  const dismissFlag = useDismissFlag();
  const removePost = useAdminRemovePost();
  const removeComment = useAdminRemoveComment();
  const suspendUser = useAdminSuspendUser();
  const unsuspendUser = useAdminUnsuspendUser();
  const [newModInput, setNewModInput] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const isOwner = myRole === AdminRole.owner;
  const isModerator = myRole === AdminRole.moderator;
  const hasAccess = isOwner || isModerator;
  reactExports.useEffect(() => {
    if (!roleLoading && !hasAccess && myRole !== void 0) {
      navigate({ to: "/" });
    }
  }, [roleLoading, hasAccess, myRole, navigate]);
  const pendingFlags = allFlags.filter((f) => f.status === FlagStatus.pending);
  const resolvedFlags = allFlags.filter(
    (f) => f.status === FlagStatus.resolved
  );
  const dismissedFlags = allFlags.filter(
    (f) => f.status === FlagStatus.dismissed
  );
  const suspendedUserIds = [
    ...new Set(
      activityLog.filter((log) => log.action === "suspendUser" && log.targetPrincipal).map((log) => log.targetPrincipal.toString())
    )
  ].filter(
    (id) => !activityLog.find(
      (log) => {
        var _a;
        return log.action === "unsuspendUser" && ((_a = log.targetPrincipal) == null ? void 0 : _a.toString()) === id;
      }
    )
  );
  const handleAddModerator = async () => {
    const trimmed = newModInput.trim();
    if (!trimmed) return;
    try {
      const principal = createPrincipal(trimmed);
      await addModerator.mutateAsync(principal);
      ue.success("Moderator added successfully");
      setNewModInput("");
    } catch {
      ue.error("Failed to add moderator — check the principal ID");
    }
  };
  const handleRemoveModerator = async (userId) => {
    try {
      await removeModerator.mutateAsync(userId);
      ue.success("Moderator removed");
    } catch {
      ue.error("Failed to remove moderator");
    }
  };
  const handleResolve = async (flagId) => {
    try {
      await resolveFlag.mutateAsync({ flagId });
      ue.success("Flag resolved");
    } catch {
      ue.error("Failed to resolve flag");
    }
  };
  const handleDismiss = async (flagId) => {
    try {
      await dismissFlag.mutateAsync({ flagId });
      ue.success("Flag dismissed");
    } catch {
      ue.error("Failed to dismiss flag");
    }
  };
  const handleRemoveContent = async (flag) => {
    try {
      if (flag.targetKind === FlagTargetKind.post) {
        await removePost.mutateAsync({ postId: flag.targetId });
      } else if (flag.targetKind === FlagTargetKind.comment) {
        await removeComment.mutateAsync({ commentId: flag.targetId });
      }
      await resolveFlag.mutateAsync({
        flagId: flag.id,
        note: "Content removed"
      });
      ue.success("Content removed and flag resolved");
    } catch {
      ue.error("Failed to remove content");
    }
  };
  const handleSuspend = async (flag) => {
    if (!flag.targetPrincipal) return;
    try {
      await suspendUser.mutateAsync({ target: flag.targetPrincipal });
      await resolveFlag.mutateAsync({
        flagId: flag.id,
        note: "User suspended"
      });
      ue.success("User suspended");
    } catch {
      ue.error("Failed to suspend user");
    }
  };
  const handleUnsuspend = async (principalStr) => {
    try {
      const principal = createPrincipal(principalStr);
      await unsuspendUser.mutateAsync({ target: principal });
      ue.success("User unsuspended");
    } catch {
      ue.error("Failed to unsuspend user");
    }
  };
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" })
    ] }) });
  }
  if (!hasAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-16 h-16 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "You don't have permission to view this page." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 lg:p-6 space-y-6", "data-ocid": "admin.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }),
          "Admin Panel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Role:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary capitalize", children: myRole ?? "None" })
        ] })
      ] }),
      !owner && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: () => claimOwner.mutate(),
          className: "bg-primary text-primary-foreground",
          "data-ocid": "admin.claim_owner_button",
          children: "Claim Owner Role"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "grid w-full grid-cols-4 bg-muted/50",
          "data-ocid": "admin.tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "dashboard", "data-ocid": "admin.dashboard_tab", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "flags", "data-ocid": "admin.flags_tab", children: [
              "Flagged",
              pendingFlags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1", children: pendingFlags.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "users", "data-ocid": "admin.users_tab", children: "Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "moderators", "data-ocid": "admin.moderators_tab", children: "Moderators" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "dashboard", className: "mt-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
            "data-ocid": "admin.stats_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Flags",
                  value: allFlags.length,
                  icon: Flag,
                  color: "bg-primary/10 text-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Pending",
                  value: pendingFlags.length,
                  icon: Clock,
                  color: "bg-amber-100 text-amber-700"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Resolved",
                  value: resolvedFlags.length,
                  icon: CircleCheckBig,
                  color: "bg-primary/10 text-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Dismissed",
                  value: dismissedFlags.length,
                  icon: TriangleAlert,
                  color: "bg-muted text-muted-foreground"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Moderator Count" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-primary", children: moderators.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Active moderators" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Activity" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: activityLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No activity yet." }) : activityLog.slice(0, 10).map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between py-2 border-b border-border last:border-0",
              "data-ocid": `admin.activity_log.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground capitalize", children: log.action }),
                  log.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: log.note })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(
                  Number(log.timestamp) / 1e6
                ).toLocaleDateString() })
              ]
            },
            `log-${String(log.timestamp)}-${i}`
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "flags",
          className: "mt-6 space-y-4",
          "data-ocid": "admin.flags_section",
          children: flagsLoading ? ["flag-skel-1", "flag-skel-2", "flag-skel-3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }, k)) : allFlags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12",
              "data-ocid": "admin.flags.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No flags to review." })
              ]
            }
          ) : allFlags.map((flag, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-border",
              "data-ocid": `admin.flags.item.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FlagKindBadge, { kind: flag.targetKind }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FlagStatusBadge, { status: flag.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: new Date(
                    Number(flag.createdAt) / 1e6
                  ).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Reason:" }),
                  " ",
                  flag.reason
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                  "Target ID: ",
                  flag.targetId.toString()
                ] }),
                flag.status === FlagStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "border-primary text-primary hover:bg-primary/10",
                      onClick: () => handleResolve(flag.id),
                      "data-ocid": `admin.flags.resolve_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 mr-1" }),
                        " Resolve"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      onClick: () => handleDismiss(flag.id),
                      "data-ocid": `admin.flags.dismiss_button.${i + 1}`,
                      children: "Dismiss"
                    }
                  ),
                  flag.targetKind !== FlagTargetKind.user && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "border-destructive text-destructive hover:bg-destructive/10",
                      onClick: () => handleRemoveContent(flag),
                      "data-ocid": `admin.flags.remove_content_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-1" }),
                        " Remove Content"
                      ]
                    }
                  ),
                  flag.targetKind === FlagTargetKind.user && flag.targetPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "border-destructive text-destructive hover:bg-destructive/10",
                      onClick: () => handleSuspend(flag),
                      "data-ocid": `admin.flags.suspend_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-3.5 h-3.5 mr-1" }),
                        " Suspend User"
                      ]
                    }
                  )
                ] })
              ] })
            },
            flag.id.toString()
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "users",
          className: "mt-6 space-y-4",
          "data-ocid": "admin.users_section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
              " Suspended Users"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: suspendedUserIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-8",
                "data-ocid": "admin.users.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-10 h-10 text-muted-foreground mx-auto mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No suspended users." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: suspendedUserIds.map((principalStr, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border",
                "data-ocid": `admin.users.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-foreground truncate", children: principalStr }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Suspended user" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "ml-3 border-primary text-primary hover:bg-primary/10 flex-shrink-0",
                      onClick: () => handleUnsuspend(principalStr),
                      "data-ocid": `admin.users.unsuspend_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-3.5 h-3.5 mr-1" }),
                        " Unsuspend"
                      ]
                    }
                  )
                ]
              },
              principalStr
            )) }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsContent,
        {
          value: "moderators",
          className: "mt-6 space-y-4",
          "data-ocid": "admin.moderators_section",
          children: [
            isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Add Moderator" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Principal ID (e.g. aaaaa-aa)",
                    value: newModInput,
                    onChange: (e) => setNewModInput(e.target.value),
                    className: "flex-1",
                    "data-ocid": "admin.moderators.add_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    onClick: handleAddModerator,
                    disabled: !newModInput.trim() || addModerator.isPending,
                    className: "bg-primary text-primary-foreground",
                    "data-ocid": "admin.moderators.add_button",
                    children: "Add"
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
                " Current Moderators"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: modLoading ? ["mod-skel-1", "mod-skel-2"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full mb-2" }, k)) : moderators.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-8",
                  "data-ocid": "admin.moderators.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-muted-foreground mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No moderators yet." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: moderators.map((mod, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border",
                  "data-ocid": `admin.moderators.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-foreground truncate", children: mod.userId.toString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "Added",
                        " ",
                        new Date(
                          Number(mod.grantedAt) / 1e6
                        ).toLocaleDateString()
                      ] })
                    ] }),
                    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "outline",
                        className: "ml-3 border-destructive text-destructive hover:bg-destructive/10 flex-shrink-0",
                        onClick: () => handleRemoveModerator(mod.userId),
                        "data-ocid": `admin.moderators.remove_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-3.5 h-3.5 mr-1" }),
                          " Remove"
                        ]
                      }
                    )
                  ]
                },
                mod.userId.toString()
              )) }) })
            ] })
          ]
        }
      )
    ] })
  ] }) });
}
export {
  AdminPage as default
};
