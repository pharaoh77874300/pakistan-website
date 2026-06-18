import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminGetTfaLockoutStatus,
  useAdminRequestTfaCode,
  useAdminVerifyTfaCode,
} from "@/hooks/use-backend";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Send, Shield } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const TFA_SESSION_KEY = "admin_2fa_verified";
const CODE_TTL = 600; // seconds
const RESEND_COOLDOWN = 60; // seconds

interface AdminLoginGateProps {
  children: ReactNode;
}

function TfaGate({ onVerified }: { onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [codeExpiry, setCodeExpiry] = useState(CODE_TTL);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [error, setError] = useState("");
  const requestTfa = useAdminRequestTfaCode();
  const verifyTfa = useAdminVerifyTfaCode();
  const { data: lockout, refetch: refetchLockout } =
    useAdminGetTfaLockoutStatus();
  const didRequest = useRef(false);

  // Auto-request on mount
  useEffect(() => {
    if (didRequest.current) return;
    didRequest.current = true;
    requestTfa.mutate(undefined, {
      onError: () =>
        setError(
          "Failed to send code. Ensure your Telegram Chat ID is registered.",
        ),
    });
  }, [requestTfa.mutate]);

  // Code expiry countdown
  useEffect(() => {
    if (codeExpiry <= 0) return;
    const t = setTimeout(() => setCodeExpiry((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [codeExpiry]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Lockout countdown
  const [lockoutSecs, setLockoutSecs] = useState<number | null>(null);
  useEffect(() => {
    if (lockout?.locked && lockout.lockedUntil != null) {
      const nowMs = Date.now();
      const untilMs = Number(lockout.lockedUntil) / 1_000_000;
      const remaining = Math.max(0, Math.floor((untilMs - nowMs) / 1000));
      setLockoutSecs(remaining);
    } else {
      setLockoutSecs(null);
    }
  }, [lockout]);
  useEffect(() => {
    if (lockoutSecs == null || lockoutSecs <= 0) return;
    const t = setTimeout(() => {
      setLockoutSecs((v) => (v != null ? v - 1 : null));
      if (lockoutSecs === 1) refetchLockout();
    }, 1000);
    return () => clearTimeout(t);
  }, [lockoutSecs, refetchLockout]);

  const handleResend = () => {
    setError("");
    setResendCooldown(RESEND_COOLDOWN);
    setCodeExpiry(CODE_TTL);
    requestTfa.mutate(undefined, {
      onError: () => setError("Failed to resend code."),
    });
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    try {
      const ok = await verifyTfa.mutateAsync(code);
      if (ok) {
        sessionStorage.setItem(TFA_SESSION_KEY, "1");
        onVerified();
      } else {
        setError("Incorrect code. Please try again.");
        refetchLockout();
      }
    } catch {
      setError("Verification failed. Please try again.");
      refetchLockout();
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-md"
        data-ocid="admin.tfa_gate.panel"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Send className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          2-Factor Verification
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          A 6-digit code was sent to your Telegram. Enter it below.
        </p>

        {lockoutSecs != null && lockoutSecs > 0 ? (
          <div
            className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mb-4 text-sm text-destructive"
            data-ocid="admin.tfa_gate.lockout_state"
          >
            Too many failed attempts. Try again in{" "}
            <span className="font-semibold">{fmt(lockoutSecs)}</span>.
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                className="text-center text-2xl tracking-widest font-mono h-14"
                data-ocid="admin.tfa_gate.code_input"
                disabled={verifyTfa.isPending}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              {error && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.tfa_gate.error_state"
                >
                  {error}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Code expires in{" "}
                <span
                  className={
                    codeExpiry <= 60
                      ? "text-destructive font-semibold"
                      : "font-medium"
                  }
                >
                  {fmt(codeExpiry)}
                </span>
              </p>
            </div>
            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mb-3"
              onClick={handleVerify}
              disabled={verifyTfa.isPending || code.length !== 6}
              data-ocid="admin.tfa_gate.submit_button"
            >
              {verifyTfa.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resendCooldown > 0 || requestTfa.isPending}
              data-ocid="admin.tfa_gate.resend_button"
            >
              {requestTfa.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Wraps admin-only pages. If the user is not authenticated via Internet Identity,
 * it shows a dedicated login prompt instead of the page content.
 * After II auth is confirmed and user has admin/moderator role, shows a 2FA screen.
 */
export function AdminLoginGate({ children }: AdminLoginGateProps) {
  const { isAuthenticated, isInitializing, isLoggingIn, login, identity } =
    useAuth();
  const navigate = useNavigate();
  const [tfaVerified, setTfaVerified] = useState(
    () => sessionStorage.getItem(TFA_SESSION_KEY) === "1",
  );

  // Clear 2FA flag on logout
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem(TFA_SESSION_KEY);
      setTfaVerified(false);
    }
  }, [isAuthenticated]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  const principalStr = identity?.getPrincipal().toString();
  const isAnonymous = principalStr === "2vxsx-fae";

  if (isAnonymous) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-md"
          data-ocid="admin.anon_blocked.panel"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Anonymous Access Blocked
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            The admin panel requires a real Internet Identity. Anonymous
            principals cannot access admin features.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin.anon_blocked.back_button"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-md"
          data-ocid="admin.login_gate.panel"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Admin Panel
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with Internet Identity to access the admin panel. Your
            identity is used to verify your admin or moderator role.
          </p>
          <Button
            type="button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="admin.login_gate.login_button"
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
          <p className="text-xs text-muted-foreground mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2 hover:no-underline"
              onClick={() => navigate({ to: "/login" })}
              data-ocid="admin.login_gate.signup_link"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    );
  }

  // II authenticated — check 2FA
  if (!tfaVerified) {
    return <TfaGate onVerified={() => setTfaVerified(true)} />;
  }

  return <>{children}</>;
}
