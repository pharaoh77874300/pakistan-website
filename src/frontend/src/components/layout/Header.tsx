import { Avatar } from "@/components/shared/Avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-backend";
import { useThemeStore } from "@/store/theme-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Moon, Search, Sun, Zap } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, identity, login } = useAuth();
  const { data: profile } = useMyProfile();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate({ to: "/explore", search: { q: search.trim() } });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-3 shadow-subtle">
      {/* Mobile brand */}
      <Link
        to="/"
        className="lg:hidden flex items-center gap-2 flex-shrink-0"
        data-ocid="header.brand_link"
      >
        <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-display font-bold text-base text-foreground">
          ConnectSphere
        </span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ConnectSphere..."
            className="pl-9 h-9 bg-muted/50 border-border/50 focus:bg-card"
            data-ocid="header.search_input"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          data-ocid="header.theme_toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications placeholder */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/explore", search: { q: undefined } })
            }
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            aria-label="Explore (notifications coming soon)"
            title="Notifications coming soon"
            data-ocid="header.notifications_button"
          >
            <Bell className="w-4 h-4" />
          </button>
        )}

        {/* Auth */}
        {isAuthenticated && identity ? (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/profile/$userId",
                params: { userId: identity.getPrincipal().toString() },
              })
            }
            className="flex items-center gap-2 ml-1 hover:opacity-80 transition-smooth"
            aria-label="View your profile"
            data-ocid="header.user_button"
          >
            <Avatar
              blob={profile?.avatarBlob}
              name={profile?.username}
              size="sm"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={login}
            className="ml-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-smooth"
            data-ocid="header.login_button"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
