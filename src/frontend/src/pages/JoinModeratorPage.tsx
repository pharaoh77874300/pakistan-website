import { InviteStatus } from "@/backend";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  useClaimModeratorInvite,
  useGetModeratorInvite,
} from "@/hooks/use-backend";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle, Loader2, Shield, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinModeratorPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin/join-moderator" });
  const code = (search as Record<string, string>).code ?? "";

  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const { data: invite, isLoading } = useGetModeratorInvite(code);
  const claimInvite = useClaimModeratorInvite();
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!code) return;
    setClaimError(null);
    try {
      const success = await claimInvite.mutateAsync(code);
      if (success) {
        setClaimed(true);
        toast.success("You are now a moderator!");
      } else {
        setClaimError(
          "This invite link is no longer valid or has already been used.",
        );
      }
    } catch {
      setClaimError("Failed to claim the invite. Please try again.");
    }
  };

  // Still bootstrapping
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Missing code — redirect
  if (!code) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto"
          data-ocid="join_mod.invalid.panel"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Invalid Invite Link
          </h2>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            This invite link is missing a code. Please use the full link shared
            by the admin.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            data-ocid="join_mod.invalid.back_button"
          >
            Go to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-md"
          data-ocid="join_mod.login_gate.panel"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Moderator Invitation
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            You've been invited to become a moderator on Pakistan. Sign in with
            Internet Identity to accept.
          </p>
          <Button
            type="button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="join_mod.login_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Continue with Internet Identity
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Successfully claimed
  if (claimed) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto"
          data-ocid="join_mod.success.panel"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome, Moderator!
          </h2>
          <p className="text-muted-foreground mt-3 mb-8 leading-relaxed">
            You now have moderator access to Pakistan's admin panel. You can
            review flagged content and help keep the community safe.
          </p>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
            onClick={() => navigate({ to: "/admin" })}
            data-ocid="join_mod.go_to_admin_button"
          >
            <Shield className="w-4 h-4 mr-2" />
            Go to Admin Panel
          </Button>
        </div>
      </Layout>
    );
  }

  // Invalid / expired / revoked or claim error
  const isInvalid =
    !invite ||
    invite.status === InviteStatus.claimed ||
    invite.status === InviteStatus.expired ||
    invite.status === InviteStatus.revoked ||
    claimError !== null;

  if (isInvalid) {
    const reason =
      claimError ??
      (invite?.status === InviteStatus.claimed
        ? "This invite has already been claimed."
        : invite?.status === InviteStatus.expired
          ? "This invite has expired."
          : invite?.status === InviteStatus.revoked
            ? "This invite was revoked by the owner."
            : "This invite link is invalid or no longer available.");

    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto"
          data-ocid="join_mod.invalid.panel"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Invite Unavailable
          </h2>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">{reason}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            data-ocid="join_mod.invalid.back_button"
          >
            Go to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Valid pending invite
  const expiresDate = new Date(Number(invite.expiresAt) / 1_000_000);
  const daysLeft = Math.max(
    0,
    Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000),
  );

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center py-16 px-6 max-w-md mx-auto"
        data-ocid="join_mod.claim.panel"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground text-center">
          Moderator Invitation
        </h2>
        <p className="text-muted-foreground mt-3 text-center leading-relaxed">
          You've been invited to become a moderator on Pakistan. As a moderator
          you can review flagged content and help keep the community safe.
        </p>

        <Card className="w-full mt-6 border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Pending
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expires in</span>
              <span className="text-sm font-medium text-foreground">
                {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expires on</span>
              <span className="text-sm font-medium text-foreground">
                {expiresDate.toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Button
          type="button"
          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          onClick={handleClaim}
          disabled={claimInvite.isPending}
          data-ocid="join_mod.accept_button"
        >
          {claimInvite.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Accepting…
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Accept &amp; Become Moderator
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="mt-2 text-muted-foreground"
          onClick={() => navigate({ to: "/" })}
          data-ocid="join_mod.decline_button"
        >
          Decline
        </Button>
      </div>
    </Layout>
  );
}
