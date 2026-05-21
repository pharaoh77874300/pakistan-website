import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-BuiRXQM6.js";
import { u as useMyProfile, t as useUpdateProfile, A as Avatar, B as Button, d as ue } from "./button-CGyXWe1l.js";
import { I as ImageUpload } from "./ImageUpload-wQ7x3p_J.js";
import { U as User, I as Input } from "./user-BWgjoBtF.js";
import { L as Label } from "./label-9JhulSLm.js";
import { T as Textarea } from "./textarea-BNjtWPVi.js";
import { c as createLucideIcon, u as useAuth, Z as Zap } from "./zap-DSkRDU80.js";
import { C as CircleCheck } from "./circle-check-BtwIwCJ6.js";
import "./index-1jI7Rj5-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
const NEXT = "/onboarding/follow";
function OnboardingProfilePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [avatar, setAvatar] = reactExports.useState(void 0);
  const [cover, setCover] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  reactExports.useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarBlob ?? void 0);
      setCover(profile.coverBlob ?? void 0);
    }
  }, [profile]);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      ue.error("Username is required");
      return;
    }
    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob: avatar,
        coverBlob: cover
      });
      ue.success("Profile saved!");
      navigate({ to: NEXT });
    } catch {
      ue.error("Could not save profile. Please try again.");
    }
  };
  const handleSkip = () => navigate({ to: NEXT });
  if (isInitializing || profileLoading) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "onboarding_profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Pakistan.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: 2, total: 3 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl sm:text-3xl text-foreground mb-2", children: "Set up your profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Help others recognise you — you can update this anytime." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Profile picture" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { blob: avatar, name: username, size: "xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: avatar ? "Great photo! Upload a new one to change it." : "Add a photo so people can recognise you." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ImageUpload,
                    {
                      value: avatar,
                      onChange: setAvatar,
                      label: "Upload photo",
                      aspect: "square",
                      "data-ocid": "onboarding_profile.avatar_upload"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                "Cover photo",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-xl overflow-hidden bg-muted h-28 mb-3", children: cover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: cover.getDirectURL(),
                  alt: "Cover preview",
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full gradient-accent opacity-20" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ImageUpload,
                {
                  value: cover,
                  onChange: setCover,
                  label: "Upload cover photo",
                  aspect: "wide",
                  "data-ocid": "onboarding_profile.cover_upload"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "ob-username",
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
                    id: "ob-username",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    placeholder: "your_username",
                    required: true,
                    autoComplete: "off",
                    "data-ocid": "onboarding_profile.username_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "ob-bio",
                    className: "text-sm font-medium mb-1.5 block",
                    children: "Bio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "ob-bio",
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    placeholder: "Tell the world about yourself...",
                    rows: 3,
                    className: "resize-none",
                    maxLength: 300,
                    "data-ocid": "onboarding_profile.bio_textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [
                  bio.length,
                  "/300"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: handleSkip,
                  className: "sm:w-auto",
                  "data-ocid": "onboarding_profile.skip_button",
                  children: "Skip for now"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isPending,
                  className: "flex-1 gap-2",
                  "data-ocid": "onboarding_profile.save_button",
                  children: isPending ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    "Save & Continue",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  ] })
                }
              )
            ] })
          ] })
        ] }) })
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
  OnboardingProfilePage as default
};
