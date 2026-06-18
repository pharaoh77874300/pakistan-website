import { c as createLucideIcon, u as useAuth, b as useNavigate, a as useMyProfile, ax as useCreateProfile, r as reactExports, aU as useProfileByUsername, j as jsxRuntimeExports, aV as LoaderCircle, Z as Zap, aE as User, aD as Avatar3D, A as Avatar, I as Input, aW as CircleX, B as Button, k as ue } from "./index-xPxN8AW-.js";
import { I as ImageUpload } from "./ImageUpload-BuhIYJuS.js";
import { L as Label } from "./label-B5gGGekv.js";
import { T as Textarea } from "./textarea-fj3e2o8j.js";
import { I as Image } from "./image-k6Ib0X9k.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode);
const DRAFT_KEY = "pakistan_profile_setup_draft";
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return { username: "", bio: "" };
}
function saveDraft(d) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
  }
}
function ProfileSetupPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: existingProfile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: createProfile, isPending: isSaving } = useCreateProfile();
  const draft = loadDraft();
  const [username, setUsername] = reactExports.useState(draft.username);
  const [bio, setBio] = reactExports.useState(draft.bio);
  const [avatar, setAvatar] = reactExports.useState(void 0);
  const [cover, setCover] = reactExports.useState(void 0);
  const [avatarType, setAvatarType] = reactExports.useState("photo");
  const [skinTone, setSkinTone] = reactExports.useState("medium");
  const [hairStyle, setHairStyle] = reactExports.useState("short");
  const [bodyType, setBodyType] = reactExports.useState(
    "average"
  );
  const [usernameError, setUsernameError] = reactExports.useState("");
  const [usernameChecking, setUsernameChecking] = reactExports.useState(false);
  const [usernameTaken, setUsernameTaken] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  const [checkUsername, setCheckUsername] = reactExports.useState("");
  const { data: usernameSearchResult, isFetching: usernameSearching } = useProfileByUsername(checkUsername || void 0);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  reactExports.useEffect(() => {
    if (!profileLoading && existingProfile) {
      navigate({ to: "/" });
    }
  }, [existingProfile, profileLoading, navigate]);
  reactExports.useEffect(() => {
    saveDraft({ username, bio });
  }, [username, bio]);
  reactExports.useEffect(() => {
    if (!checkUsername) return;
    if (usernameSearching) {
      setUsernameChecking(true);
      return;
    }
    setUsernameChecking(false);
    const taken = !!(usernameSearchResult && usernameSearchResult.username === checkUsername);
    setUsernameTaken(taken);
    if (taken) {
      setUsernameError("This username is already taken");
    } else if (checkUsername === username && checkUsername.length >= 3) {
      setUsernameError("");
    }
  }, [usernameSearchResult, usernameSearching, checkUsername, username]);
  const handleUsernameChange = reactExports.useCallback((val) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleaned);
    setUsernameError("");
    setUsernameTaken(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (cleaned.length < 3) {
      setCheckUsername("");
      if (cleaned.length > 0)
        setUsernameError("Username must be at least 3 characters");
      return;
    }
    debounceRef.current = setTimeout(() => {
      setCheckUsername(cleaned);
    }, 500);
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      ue.error("Username must be at least 3 characters");
      return;
    }
    if (usernameTaken) {
      ue.error("That username is already taken");
      return;
    }
    try {
      await createProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob: avatarType === "photo" ? avatar : void 0,
        coverBlob: cover,
        avatarType,
        avatar3dConfig: avatarType === "3d" ? JSON.stringify({ skinTone, hairStyle, bodyType }) : void 0
      });
      clearDraft();
      ue.success("Profile created! Welcome to Pakistan 🎉");
      navigate({ to: "/" });
    } catch {
      ue.error("Could not create profile. Please try again.");
    }
  };
  const handleSkip = () => {
    clearDraft();
    navigate({ to: "/" });
  };
  const usernameValid = username.length >= 3 && !usernameTaken && !usernameChecking;
  const canSave = usernameValid && !isSaving;
  if (isInitializing || profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "profile_setup.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-6 py-4 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: "Pakistan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Set up your profile" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-7 h-7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl sm:text-3xl text-foreground mb-2", children: "Welcome to Pakistan!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mx-auto", children: "Let's set up your profile so others can find and recognise you. You can update everything later." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-5", noValidate: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-32 sm:h-40 bg-primary/10", children: [
                cover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cover.getDirectURL(),
                    alt: "Cover preview",
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex items-center justify-center gap-2 text-primary/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-6 h-6" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Cover photo" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImageUpload,
                  {
                    value: cover,
                    onChange: setCover,
                    label: "Upload cover",
                    aspect: "wide",
                    "data-ocid": "profile_setup.cover_upload"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAvatarType("photo"),
                      className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${avatarType === "photo" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                      "data-ocid": "profile_setup.avatar_tab_photo",
                      children: "Upload Photo"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAvatarType("3d"),
                      className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${avatarType === "3d" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                      "data-ocid": "profile_setup.avatar_tab_3d",
                      children: "3D Avatar"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: avatarType === "3d" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Avatar3D,
                    {
                      skinTone,
                      hairStyle,
                      bodyType,
                      size: 80
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: avatar, name: username, size: "xl" }) }),
                  avatarType === "photo" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ImageUpload,
                    {
                      value: avatar,
                      onChange: setAvatar,
                      label: "Upload photo",
                      aspect: "square",
                      "data-ocid": "profile_setup.avatar_upload"
                    }
                  ) })
                ] }),
                avatarType === "3d" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "space-y-4",
                    "data-ocid": "profile_setup.avatar3d_controls",
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
                              "data-ocid": `profile_setup.skin_tone_${tone}`,
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
                              "data-ocid": `profile_setup.hair_style_${style}`,
                              children: style
                            },
                            style
                          )
                        ) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Body Type" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["slim", "average", "athletic"].map(
                          (bt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setBodyType(bt),
                              className: `px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${bodyType === bt ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
                              "data-ocid": `profile_setup.body_type_${bt}`,
                              children: bt
                            },
                            bt
                          )
                        ) })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "ps-username",
                        className: "text-sm font-medium mb-1.5 flex items-center gap-1",
                        children: [
                          "Username",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-xs", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none", children: "@" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "ps-username",
                          value: username,
                          onChange: (e) => handleUsernameChange(e.target.value),
                          placeholder: "your_username",
                          required: true,
                          autoComplete: "off",
                          className: "pl-7",
                          "data-ocid": "profile_setup.username_input"
                        }
                      ),
                      username.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: usernameChecking || usernameSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-muted-foreground" }) : usernameTaken ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }) })
                    ] }),
                    usernameError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive mt-1",
                        "data-ocid": "profile_setup.username_field_error",
                        children: usernameError
                      }
                    ) : username.length >= 3 && !usernameChecking && !usernameTaken ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary mt-1", children: [
                      "@",
                      username,
                      " is available"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Only lowercase letters, numbers, and underscores. Min 3 characters." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "ps-bio",
                        className: "text-sm font-medium mb-1.5 block",
                        children: [
                          "Bio",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal ml-1 text-xs", children: "(optional)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "ps-bio",
                        value: bio,
                        onChange: (e) => setBio(e.target.value),
                        placeholder: "Tell the world a little about yourself…",
                        rows: 3,
                        className: "resize-none",
                        maxLength: 160,
                        "data-ocid": "profile_setup.bio_textarea"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: bio.length > 140 ? "text-amber-500" : "",
                          children: bio.length
                        }
                      ),
                      "/160"
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" }),
              " Required fields"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: handleSkip,
                  className: "sm:w-auto border-border hover:bg-muted",
                  "data-ocid": "profile_setup.skip_button",
                  children: "Skip for now"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: !canSave || isSaving,
                  className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold",
                  "data-ocid": "profile_setup.save_button",
                  children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                    "Creating profile…"
                  ] }) : "Save & Continue"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-muted/40 border-t border-border py-4 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Pakistan. Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline hover:text-foreground transition-colors",
              children: "caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  ProfileSetupPage as default
};
