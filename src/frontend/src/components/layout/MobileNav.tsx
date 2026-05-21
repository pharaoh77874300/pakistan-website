import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Home, LogIn, User } from "lucide-react";

export function MobileNav() {
  const location = useLocation();
  const { isAuthenticated, identity } = useAuth();

  const items = [
    {
      to: "/",
      label: "Home",
      icon: Home,
      exact: true,
      ocid: "mobile_nav.home_link",
    },
    {
      to: "/explore",
      label: "Explore",
      icon: Compass,
      exact: false,
      ocid: "mobile_nav.explore_link",
    },
    ...(isAuthenticated && identity
      ? [
          {
            to: `/profile/${identity.getPrincipal().toString()}`,
            label: "Profile",
            icon: User,
            exact: false,
            ocid: "mobile_nav.profile_link",
          },
        ]
      : [
          {
            to: "/login",
            label: "Sign In",
            icon: LogIn,
            exact: false,
            ocid: "mobile_nav.login_link",
          },
        ]),
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-center justify-around h-16 px-2 safe-area-pb">
      {items.map((item) => {
        const active = item.exact
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-smooth ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={item.ocid}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
