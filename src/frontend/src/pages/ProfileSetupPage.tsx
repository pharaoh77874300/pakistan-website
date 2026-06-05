import { Avatar } from "@/components/shared/Avatar";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreateProfile,
  useMyProfile,
  useProfileByUsername,
} from "@/hooks/use-backend";
import type { ExternalBlob } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ImageIcon,
  Loader2,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DRAFT_KEY = "pakistan_profile_setup_draft";

interface Draft {
  username: string;
  bio: string;
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as Draft;
  } catch {
    // ignore
  }
  return { username: "", bio: "" };
}

function saveDraft(d: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export default function ProfileSetupPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: existingProfile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: createProfile, isPending: isSaving } =
    useCreateProfile();

  const draft = loadDraft();
  const [username, setUsername] = useState(draft.username);
  const [bio, setBio] = useState(draft.bio);
  const [avatar, setAvatar] = useState<ExternalBlob | undefined>(undefined);
  const [cover, setCover] = useState<ExternalBlob | undefined>(undefined);
  const [usernameError, setUsernameError] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);

  // Debounce username check
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Query to check username availability — we need to call the hook
  // at component level; we use a controlled state to trigger search
  const [checkUsername, setCheckUsername] = useState("");
  const { data: usernameSearchResult, isFetching: usernameSearching } =
    useProfileByUsername(checkUsername || undefined);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // If user already has a profile, send to home
  useEffect(() => {
    if (!profileLoading && existingProfile) {
      navigate({ to: "/" });
    }
  }, [existingProfile, profileLoading, navigate]);

  // Persist draft on change
  useEffect(() => {
    saveDraft({ username, bio });
  }, [username, bio]);

  // Process username availability result
  useEffect(() => {
    if (!checkUsername) return;
    if (usernameSearching) {
      setUsernameChecking(true);
      return;
    }
    setUsernameChecking(false);
    // If a profile is found with that username, it's taken
    const taken = !!(
      usernameSearchResult && usernameSearchResult.username === checkUsername
    );
    setUsernameTaken(taken);
    if (taken) {
      setUsernameError("This username is already taken");
    } else if (checkUsername === username && checkUsername.length >= 3) {
      setUsernameError("");
    }
  }, [usernameSearchResult, usernameSearching, checkUsername, username]);

  const handleUsernameChange = useCallback((val: string) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (usernameTaken) {
      toast.error("That username is already taken");
      return;
    }
    try {
      await createProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob: avatar,
        coverBlob: cover,
      });
      clearDraft();
      toast.success("Profile created! Welcome to Pakistan 🎉");
      navigate({ to: "/" });
    } catch {
      toast.error("Could not create profile. Please try again.");
    }
  };

  const handleSkip = () => {
    clearDraft();
    navigate({ to: "/" });
  };

  const usernameValid =
    username.length >= 3 && !usernameTaken && !usernameChecking;
  const canSave = usernameValid && !isSaving;

  if (isInitializing || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="profile_setup.page"
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Pakistan
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Set up your profile
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-4">
              <User className="w-7 h-7" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
              Welcome to Pakistan!
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Let's set up your profile so others can find and recognise you.
              You can update everything later.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5" noValidate>
            {/* Cover + Avatar preview */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Cover photo area */}
              <div className="relative h-32 sm:h-40 bg-primary/10">
                {cover ? (
                  <img
                    src={cover.getDirectURL()}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center gap-2 text-primary/40">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">Cover photo</span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <ImageUpload
                    value={cover}
                    onChange={setCover}
                    label="Upload cover"
                    aspect="wide"
                    data-ocid="profile_setup.cover_upload"
                  />
                </div>
              </div>

              {/* Avatar row */}
              <div className="px-5 pb-5">
                <div className="flex items-end gap-4 -mt-8 mb-4">
                  <div className="relative">
                    <Avatar blob={avatar} name={username} size="xl" />
                  </div>
                  <div className="pb-1">
                    <ImageUpload
                      value={avatar}
                      onChange={setAvatar}
                      label="Upload photo"
                      aspect="square"
                      data-ocid="profile_setup.avatar_upload"
                    />
                  </div>
                </div>

                {/* Fields inside the card */}
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <Label
                      htmlFor="ps-username"
                      className="text-sm font-medium mb-1.5 flex items-center gap-1"
                    >
                      Username
                      <span className="text-destructive text-xs">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                        @
                      </span>
                      <Input
                        id="ps-username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="your_username"
                        required
                        autoComplete="off"
                        className="pl-7"
                        data-ocid="profile_setup.username_input"
                      />
                      {/* Availability indicator */}
                      {username.length >= 3 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameChecking || usernameSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : usernameTaken ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </span>
                      )}
                    </div>
                    {usernameError ? (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="profile_setup.username_field_error"
                      >
                        {usernameError}
                      </p>
                    ) : username.length >= 3 &&
                      !usernameChecking &&
                      !usernameTaken ? (
                      <p className="text-xs text-primary mt-1">
                        @{username} is available
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Only lowercase letters, numbers, and underscores. Min 3
                        characters.
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <Label
                      htmlFor="ps-bio"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Bio
                      <span className="text-muted-foreground font-normal ml-1 text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="ps-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the world a little about yourself…"
                      rows={3}
                      className="resize-none"
                      maxLength={160}
                      data-ocid="profile_setup.bio_textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      <span
                        className={bio.length > 140 ? "text-amber-500" : ""}
                      >
                        {bio.length}
                      </span>
                      /160
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required fields note */}
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Required fields
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="sm:w-auto border-border hover:bg-muted"
                data-ocid="profile_setup.skip_button"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={!canSave || isSaving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold"
                data-ocid="profile_setup.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating profile…
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Pakistan. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
