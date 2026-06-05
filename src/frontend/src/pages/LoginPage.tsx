import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";
import { MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

export default function LoginPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();

  const features = [
    {
      icon: Users,
      label: "Follow people",
      desc: "Connect with creators and friends",
    },
    {
      icon: MessageSquare,
      label: "Join conversations",
      desc: "Comment, share, and discuss",
    },
    {
      icon: TrendingUp,
      label: "Explore trending",
      desc: "Discover what's popular now",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      data-ocid="login.page"
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

        <div className="relative z-10 text-center max-w-md">
          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-3xl text-foreground">
              Pakistan
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
            Your world,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              connected
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Share moments, discover communities, and connect with people who
            inspire you.
          </p>

          <ul className="grid grid-cols-1 gap-3 text-left">
            {features.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {f.label}
                  </p>
                  <p className="text-muted-foreground text-xs">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — auth card */}
      <div className="flex items-center justify-center p-8 lg:w-[440px] bg-card border-l border-border">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in with Internet Identity to continue
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl gradient-accent text-white font-semibold text-base hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated"
              data-ocid="login.submit_button"
            >
              {isInitializing ? (
                "Initializing..."
              ) : isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Continue with Internet Identity
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Internet Identity provides secure, passwordless authentication on
            the Internet Computer.
          </p>

          <div className="pt-4 border-t border-border text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to use this app in accordance with its
              purpose.
            </p>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
                data-ocid="login.signup_link"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
