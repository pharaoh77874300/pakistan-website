import { Avatar } from "@/components/shared/Avatar";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile, useUpdateProfile } from "@/hooks/use-backend";
import type { ExternalBlob } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NEXT = "/onboarding/follow";

export default function OnboardingProfilePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<ExternalBlob | undefined>(undefined);
  const [cover, setCover] = useState<ExternalBlob | undefined>(undefined);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarBlob ?? undefined);
      setCover(profile.coverBlob ?? undefined);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob: avatar,
        coverBlob: cover,
      });
      toast.success("Profile saved!");
      navigate({ to: NEXT });
    } catch {
      toast.error("Could not save profile. Please try again.");
    }
  };

  const handleSkip = () => navigate({ to: NEXT });

  if (isInitializing || profileLoading) return null;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="onboarding_profile.page"
    >
      {/* Minimal header with progress */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-semibold text-foreground text-sm">
              Pakistan.com
            </span>
          </div>
          <StepIndicator current={2} total={3} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-xl space-y-8">
          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 text-primary mb-4">
              <User className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
              Set up your profile
            </h1>
            <p className="text-muted-foreground">
              Help others recognise you — you can update this anytime.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar section */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <p className="font-semibold text-foreground text-sm">
                Profile picture
              </p>
              <div className="flex items-center gap-5">
                <Avatar blob={avatar} name={username} size="xl" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {avatar
                      ? "Great photo! Upload a new one to change it."
                      : "Add a photo so people can recognise you."}
                  </p>
                  <ImageUpload
                    value={avatar}
                    onChange={setAvatar}
                    label="Upload photo"
                    aspect="square"
                    data-ocid="onboarding_profile.avatar_upload"
                  />
                </div>
              </div>
            </div>

            {/* Cover photo */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <p className="font-semibold text-foreground text-sm">
                Cover photo{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </p>
              <div className="relative rounded-xl overflow-hidden bg-muted h-28 mb-3">
                {cover ? (
                  <img
                    src={cover.getDirectURL()}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full gradient-accent opacity-20" />
                )}
              </div>
              <ImageUpload
                value={cover}
                onChange={setCover}
                label="Upload cover photo"
                aspect="wide"
                data-ocid="onboarding_profile.cover_upload"
              />
            </div>

            {/* Username + Bio */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div>
                <Label
                  htmlFor="ob-username"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ob-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  required
                  autoComplete="off"
                  data-ocid="onboarding_profile.username_input"
                />
              </div>
              <div>
                <Label
                  htmlFor="ob-bio"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Bio
                </Label>
                <Textarea
                  id="ob-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the world about yourself..."
                  rows={3}
                  className="resize-none"
                  maxLength={300}
                  data-ocid="onboarding_profile.bio_textarea"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {bio.length}/300
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="sm:w-auto"
                data-ocid="onboarding_profile.skip_button"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 gap-2"
                data-ocid="onboarding_profile.save_button"
              >
                {isPending ? (
                  "Saving..."
                ) : (
                  <>
                    Save & Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-1.5">
          {step < current ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                step === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {step}
            </div>
          )}
          {step < total && (
            <div
              className={`h-0.5 w-6 rounded-full ${
                step < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        Step {current} of {total}
      </span>
    </div>
  );
}
