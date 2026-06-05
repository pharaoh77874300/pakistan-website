import { AdminRole } from "@/backend";
import { useAuth } from "@/hooks/use-auth";
import { useGetMyAdminRole } from "@/hooks/use-backend";
import { useUnreadCount } from "@/hooks/use-notifications";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  Home,
  LogIn,
  Settings,
  Shield,
  User,
} from "lucide-react";

export function MobileNav() {
  const location = useLocation();
  const { isAuthenticated, identity } = useAuth();
  const { data: unreadCount = 0n } = useUnreadCount();
  const { data: myRole } = useGetMyAdminRole();
  const isAdmin = myRole === AdminRole.owner || myRole === AdminRole.moderator;

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
            to: "/notifications",
            label: "Alerts",
            icon: Bell,
            exact: false,
            ocid: "mobile_nav.notifications_link",
          },
          {
            to: `/profile/${identity.getPrincipal().toString()}`,
            label: "Profile",
            icon: User,
            exact: false,
            ocid: "mobile_nav.profile_link",
          },
          {
            to: "/settings",
            label: "Settings",
            icon: Settings,
            exact: false,
            ocid: "mobile_nav.settings_link",
          },
          ...(isAdmin
            ? [
                {
                  to: "/admin",
                  label: "Admin",
                  icon: Shield,
                  exact: false,
                  ocid: "mobile_nav.admin_link",
                },
              ]
            : []),
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
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.to === "/notifications" && unreadCount > 0n && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                  {unreadCount > 9n ? "9+" : unreadCount.toString()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
