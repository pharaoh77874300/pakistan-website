import { AdminRole, FlagStatus, FlagTargetKind, InviteStatus } from "@/backend";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminGetMyTelegramChatId,
  useAdminGetTelegramBotToken,
  useAdminRegisterTelegramChatId,
  useAdminSetTelegramBotToken,
  useClaimOwner,
  useCreateModeratorInvite,
  useDismissFlag,
  useGetMyAdminRole,
  useGetOwner,
  useListActivityLog,
  useListFlags,
  useListModeratorInvites,
  useListModerators,
  useRemoveModerator,
  useResolveFlag,
  useRevokeModeratorInvite,
} from "@/hooks/use-backend";
import type { UserId } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Flag,
  Link2,
  Loader2,
  Send,
  Shield,
  ShieldOff,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FlagStatusBadge({ status }: { status: FlagStatus }) {
  if (status === FlagStatus.pending)
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        Pending
      </Badge>
    );
  if (status === FlagStatus.resolved)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20">
        Resolved
      </Badge>
    );
  return <Badge className="bg-muted text-muted-foreground">Dismissed</Badge>;
}

function InviteStatusBadge({ status }: { status: InviteStatus }) {
  if (status === InviteStatus.pending)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
        Pending
      </Badge>
    );
  if (status === InviteStatus.claimed)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
        Claimed
      </Badge>
    );
  if (status === InviteStatus.revoked)
    return (
      <Badge className="bg-muted text-muted-foreground text-xs">Revoked</Badge>
    );
  return <Badge className="bg-amber-100 text-amber-800 text-xs">Expired</Badge>;
}

function FlagKindBadge({ kind }: { kind: FlagTargetKind }) {
  const map: Record<string, string> = {
    [FlagTargetKind.post]: "bg-blue-100 text-blue-800",
    [FlagTargetKind.comment]: "bg-purple-100 text-purple-800",
    [FlagTargetKind.user]: "bg-red-100 text-red-800",
  };
  return <Badge className={map[kind] ?? "bg-muted"}>{kind}</Badge>;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { identity, isAuthenticated, isInitializing, login } = useAuth();
  const {
    data: myRole,
    isLoading: roleLoading,
    isFetching: roleFetching,
  } = useGetMyAdminRole();
  const { data: ownerData, isLoading: ownerLoading } = useGetOwner();
  const { data: moderators = [], isLoading: modLoading } = useListModerators();
  const { data: allFlags = [], isLoading: flagsLoading } = useListFlags();
  const { data: activityLog = [] } = useListActivityLog();
  const { data: pendingInvites = [], isLoading: invitesLoading } =
    useListModeratorInvites(true);

  const createInvite = useCreateModeratorInvite();
  const removeModerator = useRemoveModerator();
  const revokeInvite = useRevokeModeratorInvite();
  const resolveFlag = useResolveFlag();
  const dismissFlag = useDismissFlag();
  const claimOwner = useClaimOwner();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const { data: myTelegramChatId } = useAdminGetMyTelegramChatId();
  const { data: telegramBotToken } = useAdminGetTelegramBotToken();
  const registerChatId = useAdminRegisterTelegramChatId();
  const setBotTokenMutation = useAdminSetTelegramBotToken();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");

  // Cross-check: if ownerData principal matches mine, I am owner even if
  // myRole hasn't resolved yet (prevents flash of Access Denied after claim).
  const myPrincipalStr = identity?.getPrincipal().toString();
  const ownerPrincipalStr = ownerData?.toString();
  const iAmTheOwnerByPrincipal =
    !!myPrincipalStr &&
    !!ownerPrincipalStr &&
    myPrincipalStr === ownerPrincipalStr;

  const isOwner = myRole === AdminRole.owner || iAmTheOwnerByPrincipal;
  const isModerator = myRole === AdminRole.moderator && !iAmTheOwnerByPrincipal;
  const hasAccess = isOwner || isModerator;

  // No owner claimed yet when ownerData comes back as null after loading
  const ownerUnclaimed =
    !ownerLoading && (ownerData === null || ownerData === undefined);

  const handleClaimOwner = async () => {
    try {
      await claimOwner.mutateAsync();
      toast.success("You are now the Super Admin!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to claim owner";
      toast.error(msg);
    }
  };

  const handleGenerateInvite = async () => {
    // Generate a cryptographically-style unique code using timestamp + random
    const code = `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    try {
      await createInvite.mutateAsync(code);
      const url = `${window.location.origin}/admin/join-moderator?code=${encodeURIComponent(code)}`;
      setGeneratedInviteUrl(url);
      setInviteModalOpen(true);
    } catch {
      toast.error("Failed to generate invite link");
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(generatedInviteUrl).then(() => {
      toast.success("Invite link copied to clipboard!");
    });
  };

  const handleRevokeInvite = async (code: string) => {
    try {
      await revokeInvite.mutateAsync(code);
      toast.success("Invite revoked");
    } catch {
      toast.error("Failed to revoke invite");
    }
  };

  const handleRemoveModerator = async (userId: UserId) => {
    try {
      await removeModerator.mutateAsync(userId);
      toast.success("Moderator removed");
    } catch {
      toast.error("Failed to remove moderator");
    }
  };

  const handleResolve = async (flagId: bigint) => {
    try {
      await resolveFlag.mutateAsync({ flagId });
      toast.success("Flag resolved");
    } catch {
      toast.error("Failed to resolve flag");
    }
  };

  const handleDismiss = async (flagId: bigint) => {
    try {
      await dismissFlag.mutateAsync({ flagId });
      toast.success("Flag dismissed");
    } catch {
      toast.error("Failed to dismiss flag");
    }
  };

  const pendingFlags = allFlags.filter((f) => f.status === FlagStatus.pending);
  const resolvedFlags = allFlags.filter(
    (f) => f.status === FlagStatus.resolved,
  );
  const dismissedFlags = allFlags.filter(
    (f) => f.status === FlagStatus.dismissed,
  );

  const suspendedUserIds = [
    ...new Set(
      activityLog
        .filter((log) => log.action === "suspendUser" && log.targetPrincipal)
        .map((log) => log.targetPrincipal!.toString()),
    ),
  ].filter(
    (id) =>
      !activityLog.find(
        (log) =>
          log.action === "unsuspendUser" &&
          log.targetPrincipal?.toString() === id,
      ),
  );

  // ── Auth gate: must be logged in via Internet Identity ─────────────────────
  if (isInitializing) {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mt-3 mb-8 leading-relaxed">
            Sign in with Internet Identity to access the Pakistan admin panel.
          </p>
          <Button
            type="button"
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 font-semibold"
            onClick={() => login()}
            data-ocid="admin.login_button"
          >
            Continue with Internet Identity
          </Button>
        </div>
      </Layout>
    );
  }

  // Stay in loading state while either query is in-flight.
  // This prevents a flash of "Access Denied" when ownerData loads before myRole.
  const isStillVerifying =
    roleLoading ||
    ownerLoading ||
    (roleFetching && !hasAccess && !ownerUnclaimed);

  if (isStillVerifying) {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Layout>
    );
  }

  // No owner claimed yet — anyone logged in via II can become the Super Admin
  if (ownerUnclaimed) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Claim Super Admin
          </h2>
          <p className="text-muted-foreground mt-3 mb-8 leading-relaxed">
            No owner has been set yet. Be the first to claim Super Admin rights
            and take full control of Pakistan's admin panel.
          </p>
          <Button
            type="button"
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 font-semibold"
            onClick={handleClaimOwner}
            disabled={claimOwner.isPending}
            data-ocid="admin.claim_owner_button"
          >
            {claimOwner.isPending ? (
              "Claiming..."
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Become Super Admin
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            This can only be done once. Once claimed, only you will have
            owner-level access.
          </p>
        </div>
      </Layout>
    );
  }

  // Owner exists but this user has no admin role
  if (!hasAccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldOff className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You need moderator or owner permissions to access the admin panel.
            Contact the site owner to request access via an invite link.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin.access_denied.back_button"
          >
            Go to Home
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* Invite Link Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="admin.invite_modal.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Invite Link Generated
            </DialogTitle>
            <DialogDescription>
              Share this link with the person you want to invite as a moderator.
              It expires in 7 days and can only be used once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-mono text-foreground break-all flex-1 min-w-0">
                {generatedInviteUrl}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCopyInvite}
                data-ocid="admin.invite_modal.copy_button"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteModalOpen(false)}
                data-ocid="admin.invite_modal.close_button"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Layout>
        <div className="p-4 lg:p-6 space-y-6" data-ocid="admin.page">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Role:{" "}
                <span className="font-semibold text-primary capitalize">
                  {isOwner ? "Super Admin" : (myRole ?? "None")}
                </span>
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className="grid w-full grid-cols-5 bg-muted/50"
              data-ocid="admin.tabs"
            >
              <TabsTrigger value="dashboard" data-ocid="admin.dashboard_tab">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="flags" data-ocid="admin.flags_tab">
                Flagged
                {pendingFlags.length > 0 && (
                  <span className="ml-1.5 min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1">
                    {pendingFlags.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" data-ocid="admin.users_tab">
                Users
              </TabsTrigger>
              <TabsTrigger value="moderators" data-ocid="admin.moderators_tab">
                Moderators
              </TabsTrigger>
              <TabsTrigger value="telegram" data-ocid="admin.telegram_tab">
                Telegram
              </TabsTrigger>
            </TabsList>
            {/* Dashboard */}
            <TabsContent value="dashboard" className="mt-6 space-y-6">
              <div
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                data-ocid="admin.stats_section"
              >
                <StatCard
                  label="Total Flags"
                  value={allFlags.length}
                  icon={Flag}
                  color="bg-primary/10 text-primary"
                />
                <StatCard
                  label="Pending"
                  value={pendingFlags.length}
                  icon={Clock}
                  color="bg-amber-100 text-amber-700"
                />
                <StatCard
                  label="Resolved"
                  value={resolvedFlags.length}
                  icon={CheckCircle}
                  color="bg-primary/10 text-primary"
                />
                <StatCard
                  label="Dismissed"
                  value={dismissedFlags.length}
                  icon={AlertTriangle}
                  color="bg-muted text-muted-foreground"
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Moderator Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {moderators.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active moderators
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activityLog.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No activity yet.
                    </p>
                  ) : (
                    activityLog.slice(0, 10).map((log, i) => (
                      <div
                        key={`log-${String(log.timestamp)}-${i}`}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        data-ocid={`admin.activity_log.item.${i + 1}`}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {log.action}
                          </p>
                          {log.note && (
                            <p className="text-xs text-muted-foreground">
                              {log.note}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            Number(log.timestamp) / 1_000_000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Flagged Content */}
            <TabsContent
              value="flags"
              className="mt-6 space-y-4"
              data-ocid="admin.flags_section"
            >
              {flagsLoading ? (
                ["flag-skel-1", "flag-skel-2", "flag-skel-3"].map((k) => (
                  <Skeleton key={k} className="h-24 w-full" />
                ))
              ) : allFlags.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="admin.flags.empty_state"
                >
                  <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No flags to review.</p>
                </div>
              ) : (
                allFlags.map((flag, i) => (
                  <Card
                    key={flag.id.toString()}
                    className="border-border"
                    data-ocid={`admin.flags.item.${i + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start gap-2 mb-3">
                        <FlagKindBadge kind={flag.targetKind} />
                        <FlagStatusBadge status={flag.status} />
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(
                            Number(flag.createdAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        <span className="font-semibold">Reason:</span>{" "}
                        {flag.reason}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Target ID: {flag.targetId.toString()}
                      </p>
                      {flag.status === FlagStatus.pending && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={() => handleResolve(flag.id)}
                            data-ocid={`admin.flags.resolve_button.${i + 1}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismiss(flag.id)}
                            data-ocid={`admin.flags.dismiss_button.${i + 1}`}
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            {/* Users (Suspended) */}
            <TabsContent
              value="users"
              className="mt-6 space-y-4"
              data-ocid="admin.users_section"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Suspended Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {suspendedUserIds.length === 0 ? (
                    <div
                      className="text-center py-8"
                      data-ocid="admin.users.empty_state"
                    >
                      <UserCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No suspended users.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {suspendedUserIds.map((principalStr, i) => (
                        <div
                          key={principalStr}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                          data-ocid={`admin.users.item.${i + 1}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono text-foreground truncate">
                              {principalStr}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Suspended user
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Moderators */}
            <TabsContent
              value="moderators"
              className="mt-6 space-y-4"
              data-ocid="admin.moderators_section"
            >
              {isOwner && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-primary" /> Invite
                      Moderator
                    </CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleGenerateInvite}
                      disabled={createInvite.isPending}
                      data-ocid="admin.moderators.generate_invite_button"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1.5" />
                      {createInvite.isPending
                        ? "Generating..."
                        : "Generate Invite Link"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Generate a single-use invite link and share it with the
                      person you want to make a moderator. The link expires in{" "}
                      <strong className="text-foreground">7 days</strong>.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pending Invites */}
              {isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Pending Invites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invitesLoading ? (
                      ["inv-skel-1", "inv-skel-2"].map((k) => (
                        <Skeleton key={k} className="h-14 w-full mb-2" />
                      ))
                    ) : pendingInvites.length === 0 ? (
                      <div
                        className="text-center py-6"
                        data-ocid="admin.invites.empty_state"
                      >
                        <Link2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No pending invites.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {pendingInvites.map((invite, i) => (
                          <div
                            key={invite.code}
                            className="flex items-start justify-between p-3 rounded-lg bg-muted/40 border border-border gap-3"
                            data-ocid={`admin.invites.item.${i + 1}`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-foreground truncate">
                                  {invite.code}
                                </span>
                                <InviteStatusBadge status={invite.status} />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Created{" "}
                                {new Date(
                                  Number(invite.createdAt) / 1_000_000,
                                ).toLocaleDateString()}
                                {" · "}Expires{" "}
                                {new Date(
                                  Number(invite.expiresAt) / 1_000_000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive/10 flex-shrink-0"
                              onClick={() => handleRevokeInvite(invite.code)}
                              data-ocid={`admin.invites.revoke_button.${i + 1}`}
                            >
                              Revoke
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Current Moderators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Current
                    Moderators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {modLoading ? (
                    ["mod-skel-1", "mod-skel-2"].map((k) => (
                      <Skeleton key={k} className="h-14 w-full mb-2" />
                    ))
                  ) : moderators.length === 0 ? (
                    <div
                      className="text-center py-8"
                      data-ocid="admin.moderators.empty_state"
                    >
                      <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No moderators yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {moderators.map((mod, i) => (
                        <div
                          key={mod.userId.toString()}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                          data-ocid={`admin.moderators.item.${i + 1}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono text-foreground truncate">
                              {mod.userId.toString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Added{" "}
                              {new Date(
                                Number(mod.grantedAt) / 1_000_000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {isOwner && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="ml-3 border-destructive text-destructive hover:bg-destructive/10 flex-shrink-0"
                              onClick={() => handleRemoveModerator(mod.userId)}
                              data-ocid={`admin.moderators.remove_button.${i + 1}`}
                            >
                              <UserMinus className="w-3.5 h-3.5 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Telegram Settings */}
            <TabsContent
              value="telegram"
              className="mt-6 space-y-4"
              data-ocid="admin.telegram_section"
            >
              {/* Telegram Chat ID — all admin roles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" />
                    Your Telegram Chat ID
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myTelegramChatId && (
                    <p className="text-sm text-muted-foreground">
                      Current:{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {myTelegramChatId}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Send a message to the Pakistan bot on Telegram and paste
                    your Chat ID here to receive 2FA codes.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. 123456789"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value.trim())}
                      className="font-mono"
                      data-ocid="admin.telegram.chat_id_input"
                    />
                    <Button
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                      onClick={async () => {
                        if (!chatId) return;
                        try {
                          await registerChatId.mutateAsync(chatId);
                          setChatId("");
                          toast.success("Telegram Chat ID saved!");
                        } catch {
                          toast.error("Failed to save Chat ID.");
                        }
                      }}
                      disabled={!chatId || registerChatId.isPending}
                      data-ocid="admin.telegram.save_chat_id_button"
                    >
                      {registerChatId.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          Saving
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bot Token — owner only */}
              {isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      Telegram Bot Token
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {telegramBotToken && (
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span className="text-primary font-semibold">
                          Configured ✓
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Create a bot via @BotFather on Telegram and paste the
                      token here. Required for sending 2FA codes.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="123456:ABC-DEF..."
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value.trim())}
                        className="font-mono"
                        data-ocid="admin.telegram.bot_token_input"
                      />
                      <Button
                        type="button"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                        onClick={async () => {
                          if (!botToken) return;
                          try {
                            await setBotTokenMutation.mutateAsync(botToken);
                            setBotToken("");
                            toast.success("Bot token saved!");
                          } catch {
                            toast.error("Failed to save bot token.");
                          }
                        }}
                        disabled={!botToken || setBotTokenMutation.isPending}
                        data-ocid="admin.telegram.save_bot_token_button"
                      >
                        {setBotTokenMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            Saving
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>{" "}
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
