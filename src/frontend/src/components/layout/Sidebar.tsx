import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-backend";
import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Home, LogIn, LogOut, User, Zap } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Explore", icon: Compass },
];

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, identity, login, logout } = useAuth();
  const { data: profile } = useMyProfile();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-border bg-card py-6 px-4 gap-1 flex-shrink-0">
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-3 mb-6 hover:opacity-90 transition-smooth"
        data-ocid="nav.brand_link"
      >
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-xl text-foreground">
          ConnectSphere
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              data-ocid={`nav.${item.label.toLowerCase()}_link`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {isAuthenticated && identity && (
          <Link
            to="/profile/$userId"
            params={{ userId: identity.getPrincipal().toString() }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
              location.pathname.startsWith("/profile")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
            data-ocid="nav.profile_link"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="mt-auto border-t border-border pt-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Avatar
              blob={profile?.avatarBlob}
              name={profile?.username}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {profile?.username ?? "You"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.bio ?? "No bio"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-smooth p-1.5 rounded-lg hover:bg-destructive/10"
              aria-label="Logout"
              data-ocid="nav.logout_button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={login}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth"
            data-ocid="nav.login_button"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
        )}
      </div>
    </aside>
  );
}
