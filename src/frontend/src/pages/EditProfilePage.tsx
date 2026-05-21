import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreateProfile,
  useMyProfile,
  useUpdateProfile,
} from "@/hooks/use-backend";
import type { ExternalBlob } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Save, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { mutateAsync: updateProfile, isPending: updating } =
    useUpdateProfile();
  const { mutateAsync: createProfile, isPending: creating } =
    useCreateProfile();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<ExternalBlob | undefined>(undefined);
  const [cover, setCover] = useState<ExternalBlob | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Prefill form from profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarBlob ?? undefined);
      setCover(profile.coverBlob ?? undefined);
    }
  }, [profile]);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const isPending = updating || creating;

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!isAuthenticated) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    try {
      if (!profile) {
        await createProfile({
          username: username.trim(),
          bio: bio.trim(),
          avatarBlob: avatar,
          coverBlob: cover,
        });
        toast.success("Profile created!");
      } else {
        await updateProfile({
          username: username.trim(),
          bio: bio.trim(),
          avatarBlob: avatar,
          coverBlob: cover,
        });
        toast.success("Profile updated successfully!");
      }
      if (profile?.id) {
        navigate({
          to: "/profile/$userId",
          params: { userId: profile.id.toString() },
        });
      } else {
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Could not save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (profile?.id) {
      navigate({
        to: "/profile/$userId",
        params: { userId: profile.id.toString() },
      });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto px-4 py-6 space-y-6"
        data-ocid="edit_profile.page"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            aria-label="Go back"
            data-ocid="edit_profile.cancel_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {profile ? "Edit Profile" : "Create Profile"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {profile
                ? "Update your personal information"
                : "Set up your profile to get started"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Cover Photo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Cover Photo
              </CardTitle>
              <CardDescription>Recommended size: 1500 × 500px</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden bg-muted h-36 mb-3">
                {cover ? (
                  <img
                    src={cover.getDirectURL()}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full gradient-accent opacity-30" />
                )}
              </div>
              <ImageUpload
                value={cover}
                onChange={setCover}
                label="Upload cover photo"
                aspect="wide"
                data-ocid="edit_profile.cover_upload"
              />
            </CardContent>
          </Card>

          {/* Avatar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Profile Picture
              </CardTitle>
              <CardDescription>Square image works best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  <Avatar blob={avatar} name={username} size="xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {avatar
                      ? "Looking good! Upload a new one to change it."
                      : "No photo yet — upload one to personalize your profile."}
                  </p>
                  <ImageUpload
                    value={avatar}
                    onChange={setAvatar}
                    label="Change avatar"
                    aspect="square"
                    data-ocid="edit_profile.avatar_upload"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="username"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  required
                  autoComplete="off"
                  data-ocid="edit_profile.username_input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your unique identifier on the platform
                </p>
              </div>
              <div>
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the world about yourself..."
                  rows={4}
                  className="resize-none"
                  maxLength={300}
                  data-ocid="edit_profile.bio_textarea"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {bio.length}/300
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="sm:w-auto w-full"
              data-ocid="edit_profile.back_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 gap-2"
              data-ocid="edit_profile.submit_button"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving changes..." : "Save changes"}
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        {profile && (
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions — proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Delete your account
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Permanently remove your profile, posts, and all data
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => setShowDeleteConfirm(true)}
                    data-ocid="edit_profile.delete_button"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete account
                  </Button>
                </div>
              ) : (
                <div
                  className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 space-y-3"
                  data-ocid="edit_profile.delete_confirm_panel"
                >
                  <p className="text-sm font-semibold text-destructive">
                    Are you absolutely sure?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. All your posts, followers, and
                    profile data will be permanently deleted.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowDeleteConfirm(false)}
                      data-ocid="edit_profile.delete_cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        toast.info(
                          "Account deletion is not yet available. Contact support for assistance.",
                        )
                      }
                      data-ocid="edit_profile.delete_confirm_button"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Yes, delete my account
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
