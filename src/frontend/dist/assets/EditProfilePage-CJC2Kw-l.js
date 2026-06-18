import { c as createLucideIcon, b as useNavigate, u as useAuth, a as useMyProfile, aw as useUpdateProfile, ax as useCreateProfile, r as reactExports, j as jsxRuntimeExports, L as Layout, P as PageLoader, B as Button, ay as Card, az as CardHeader, aA as CardTitle, aB as CardDescription, aC as CardContent, aD as Avatar3D, A as Avatar, aE as User, I as Input, aF as TriangleAlert, aG as Separator, k as ue } from "./index-xPxN8AW-.js";
import { I as ImageUpload } from "./ImageUpload-BuhIYJuS.js";
import { L as Label } from "./label-B5gGGekv.js";
import { T as Textarea } from "./textarea-fj3e2o8j.js";
import { A as ArrowLeft } from "./arrow-left-DWIC0fnP.js";
import { T as Trash2 } from "./trash-2-Ct8i_2I0.js";
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
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
  const [avatarType, setAvatarType] = reactExports.useState("photo");
  const [skinTone, setSkinTone] = reactExports.useState("medium");
  const [hairStyle, setHairStyle] = reactExports.useState("short");
  const [bodyType, setBodyType] = reactExports.useState(
    "average"
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarBlob ?? void 0);
      setCover(profile.coverBlob ?? void 0);
      const type = profile.avatarType;
      setAvatarType(type ?? "photo");
      const configStr = profile.avatar3dConfig;
      if (configStr) {
        try {
          const cfg = JSON.parse(configStr);
          if (cfg.skinTone)
            setSkinTone(cfg.skinTone);
          if (cfg.hairStyle)
            setHairStyle(
              cfg.hairStyle
            );
          if (cfg.bodyType)
            setBodyType(cfg.bodyType);
        } catch {
        }
      }
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
      const payload = {
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob: avatarType === "photo" ? avatar : void 0,
        coverBlob: cover,
        avatarType,
        avatar3dConfig: avatarType === "3d" ? JSON.stringify({ skinTone, hairStyle, bodyType }) : void 0
      };
      if (!profile) {
        await createProfile(payload);
        ue.success("Profile created!");
      } else {
        await updateProfile(payload);
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAvatarType("photo"),
                    className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${avatarType === "photo" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                    "data-ocid": "edit_profile.avatar_tab_photo",
                    children: "Upload Photo"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAvatarType("3d"),
                    className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${avatarType === "3d" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                    "data-ocid": "edit_profile.avatar_tab_3d",
                    children: "3D Avatar"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: avatarType === "3d" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Avatar3D,
                  {
                    skinTone,
                    hairStyle,
                    bodyType,
                    size: 80
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: avatar, name: username, size: "xl" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: avatarType === "photo" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                ] }) })
              ] }),
              avatarType === "3d" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-4 mt-4",
                  "data-ocid": "edit_profile.avatar3d_controls",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Skin Tone" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["light", "medium", "dark", "deep"].map(
                        (tone) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setSkinTone(tone),
                            className: `px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${skinTone === tone ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                            "data-ocid": `edit_profile.skin_tone_${tone}`,
                            children: tone
                          },
                          tone
                        )
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Hair Style" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["short", "medium", "long", "curly"].map(
                        (style) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setHairStyle(style),
                            className: `px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${hairStyle === style ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                            "data-ocid": `edit_profile.hair_style_${style}`,
                            children: style
                          },
                          style
                        )
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Body Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["slim", "average", "athletic"].map((bt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setBodyType(bt),
                          className: `px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${bodyType === bt ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                          "data-ocid": `edit_profile.body_type_${bt}`,
                          children: bt
                        },
                        bt
                      )) })
                    ] })
                  ]
                }
              )
            ] })
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
