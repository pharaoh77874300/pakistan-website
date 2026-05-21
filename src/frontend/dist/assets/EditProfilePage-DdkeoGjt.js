import { j as jsxRuntimeExports, u as useNavigate, r as reactExports, P as PageLoader } from "./index-BuiRXQM6.js";
import { L as Layout, T as Trash2 } from "./Layout-BSB1muAy.js";
import { k as cn, u as useMyProfile, t as useUpdateProfile, v as useCreateProfile, B as Button, A as Avatar, d as ue } from "./button-CGyXWe1l.js";
import { I as ImageUpload } from "./ImageUpload-wQ7x3p_J.js";
import { U as User, I as Input } from "./user-BWgjoBtF.js";
import { L as Label } from "./label-9JhulSLm.js";
import { A as ArrowLeft, S as Separator } from "./separator-A2adlF9o.js";
import { T as Textarea } from "./textarea-BNjtWPVi.js";
import { c as createLucideIcon, u as useAuth } from "./zap-DSkRDU80.js";
import "./index-1jI7Rj5-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function EditProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutateAsync: createProfile, isPending: creating } = useCreateProfile();
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [avatar, setAvatar] = reactExports.useState(void 0);
  const [cover, setCover] = reactExports.useState(void 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarBlob ?? void 0);
      setCover(profile.coverBlob ?? void 0);
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);
  const isPending = updating || creating;
  if (authLoading || profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) });
  }
  if (!isAuthenticated) return null;
  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      ue.error("Username is required");
      return;
    }
    try {
      if (!profile) {
        await createProfile({
          username: username.trim(),
          bio: bio.trim(),
          avatarBlob: avatar,
          coverBlob: cover
        });
        ue.success("Profile created!");
      } else {
        await updateProfile({
          username: username.trim(),
          bio: bio.trim(),
          avatarBlob: avatar,
          coverBlob: cover
        });
        ue.success("Profile updated successfully!");
      }
      if (profile == null ? void 0 : profile.id) {
        navigate({
          to: "/profile/$userId",
          params: { userId: profile.id.toString() }
        });
      } else {
        navigate({ to: "/" });
      }
    } catch {
      ue.error("Could not save profile. Please try again.");
    }
  };
  const handleCancel = () => {
    if (profile == null ? void 0 : profile.id) {
      navigate({
        to: "/profile/$userId",
        params: { userId: profile.id.toString() }
      });
    } else {
      navigate({ to: "/" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 py-6 space-y-6",
      "data-ocid": "edit_profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              onClick: handleCancel,
              "aria-label": "Go back",
              "data-ocid": "edit_profile.cancel_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: profile ? "Edit Profile" : "Create Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: profile ? "Update your personal information" : "Set up your profile to get started" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Cover Photo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Recommended size: 1500 × 500px" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-xl overflow-hidden bg-muted h-36 mb-3", children: cover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: cover.getDirectURL(),
                  alt: "Cover preview",
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full gradient-accent opacity-30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ImageUpload,
                {
                  value: cover,
                  onChange: setCover,
                  label: "Upload cover photo",
                  aspect: "wide",
                  "data-ocid": "edit_profile.cover_upload"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Profile Picture" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Square image works best" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: avatar, name: username, size: "xl" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: avatar ? "Looking good! Upload a new one to change it." : "No photo yet — upload one to personalize your profile." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImageUpload,
                  {
                    value: avatar,
                    onChange: setAvatar,
                    label: "Change avatar",
                    aspect: "square",
                    "data-ocid": "edit_profile.avatar_upload"
                  }
                )
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }),
              "Profile Information"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "username",
                    className: "text-sm font-medium mb-1.5 block",
                    children: [
                      "Username ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "username",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    placeholder: "your_username",
                    required: true,
                    autoComplete: "off",
                    "data-ocid": "edit_profile.username_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Your unique identifier on the platform" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "bio",
                    className: "text-sm font-medium mb-1.5 block",
                    children: "Bio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "bio",
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    placeholder: "Tell the world about yourself...",
                    rows: 4,
                    className: "resize-none",
                    maxLength: 300,
                    "data-ocid": "edit_profile.bio_textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [
                  bio.length,
                  "/300"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleCancel,
                className: "sm:w-auto w-full",
                "data-ocid": "edit_profile.back_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: isPending,
                className: "flex-1 gap-2",
                "data-ocid": "edit_profile.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  isPending ? "Saving changes..." : "Save changes"
                ]
              }
            )
          ] })
        ] }),
        profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-destructive flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
              "Danger Zone"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Irreversible actions — proceed with caution" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
            !showDeleteConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Delete your account" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Permanently remove your profile, posts, and all data" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "border-destructive/50 text-destructive hover:bg-destructive/10 shrink-0",
                  onClick: () => setShowDeleteConfirm(true),
                  "data-ocid": "edit_profile.delete_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Delete account"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg bg-destructive/10 border border-destructive/30 p-4 space-y-3",
                "data-ocid": "edit_profile.delete_confirm_panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive", children: "Are you absolutely sure?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This action cannot be undone. All your posts, followers, and profile data will be permanently deleted." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                        onClick: () => setShowDeleteConfirm(false),
                        "data-ocid": "edit_profile.delete_cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "destructive",
                        size: "sm",
                        className: "flex-1",
                        onClick: () => ue.info(
                          "Account deletion is not yet available. Contact support for assistance."
                        ),
                        "data-ocid": "edit_profile.delete_confirm_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
                          "Yes, delete my account"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  EditProfilePage as default
};
