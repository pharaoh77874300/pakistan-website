import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "@tanstack/react-router";
import { Globe, Sparkles, Users, Zap } from "lucide-react";
import { useEffect } from "react";

const features = [
  {
    icon: Users,
    title: "Connect",
    desc: "Build meaningful relationships with people who share your passions and ambitions.",
    color: "text-primary bg-primary/15",
  },
  {
    icon: Sparkles,
    title: "Share",
    desc: "Post photos, thoughts, and stories that reflect who you are to the world.",
    color: "text-accent bg-accent/15",
  },
  {
    icon: Globe,
    title: "Discover",
    desc: "Explore trending topics, new voices, and communities you didn't know you needed.",
    color: "text-primary bg-primary/15",
  },
];

export default function OnboardingWelcomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/signup" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const handleGetStarted = () => {
    navigate({ to: "/onboarding/profile" });
  };

  const handleSkip = () => {
    navigate({ to: "/" });
  };

  if (isInitializing) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      data-ocid="onboarding_welcome.page"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full animate-fade-in">
        {/* Brand mark */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-elevated">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="font-display font-bold text-3xl text-foreground tracking-tight">
            Pakistan.com
          </span>
        </div>

        {/* Hero headline */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
          Your professional{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            social world
          </span>{" "}
          starts here
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mb-10">
          Welcome{user?.profile ? `, ${user.profile.username}` : ""}! You're now
          part of a community where great connections happen every day.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center gap-3 bg-card/70 backdrop-blur-sm border border-border/60 rounded-2xl p-5 shadow-subtle transition-smooth hover:shadow-elevated hover:-translate-y-0.5"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-base mb-1">
                  {f.title}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleGetStarted}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl gradient-accent text-white font-display font-semibold text-lg shadow-elevated hover:opacity-90 transition-smooth hover:-translate-y-0.5 active:translate-y-0 mb-4"
          data-ocid="onboarding_welcome.get_started_button"
        >
          Get Started →
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          data-ocid="onboarding_welcome.skip_link"
        >
          Skip setup — take me to my feed
        </button>
      </div>
    </div>
  );
}
