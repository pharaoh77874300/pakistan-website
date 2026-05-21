import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { Camera, Globe, Sparkles, UserPlus, Users, Zap } from "lucide-react";
import { useEffect } from "react";

export default function SignupPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.profile) {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/onboarding/welcome" });
      }
    }
  }, [user, navigate]);

  const highlights = [
    {
      icon: Camera,
      label: "Share moments",
      desc: "Post photos, videos, and stories with the world",
    },
    {
      icon: Users,
      label: "Connect with people",
      desc: "Follow creators, friends, and inspiring voices",
    },
    {
      icon: Globe,
      label: "Discover content",
      desc: "Explore trending topics and tailored feeds",
    },
    {
      icon: Sparkles,
      label: "Join communities",
      desc: "Find your tribe and engage in conversations that matter",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      data-ocid="signup.page"
    >
      {/* Left — hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/social-hero.dim_1200x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        <div className="relative z-10 text-center max-w-md animate-fade-in">
          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-3xl text-foreground">
              Pakistan.com
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
            Start your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              journey
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Join millions of people sharing what matters most to them.
          </p>

          <ul className="grid grid-cols-1 gap-3 text-left">
            {highlights.map((h) => (
              <li
                key={h.label}
                className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 transition-smooth hover:bg-card/80"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <h.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {h.label}
                  </p>
                  <p className="text-muted-foreground text-xs">{h.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — sign-up card */}
      <div className="flex items-center justify-center p-8 lg:w-[440px] bg-card border-l border-border">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              It only takes a moment — no password required
            </p>
          </div>

          {/* Steps */}
          <ol className="space-y-3">
            {[
              { step: 1, text: "Authenticate with Internet Identity" },
              { step: 2, text: "Set up your profile & username" },
              { step: 3, text: "Start sharing and connecting" },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {step}
                </span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </li>
            ))}
          </ol>

          <div className="space-y-4">
            <button
              type="button"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl gradient-accent text-white font-semibold text-base hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated"
              data-ocid="signup.submit_button"
            >
              {isInitializing ? (
                "Initializing..."
              ) : isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign up with Internet Identity
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Internet Identity provides secure, passwordless authentication on
            the Internet Computer — no email or password needed.
          </p>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
                data-ocid="signup.login_link"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
