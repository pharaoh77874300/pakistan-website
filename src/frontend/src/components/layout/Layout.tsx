import { FlagStatus } from "@/backend";
import { Toaster } from "@/components/ui/sonner";
import { useGetMyAdminRole, useListFlags } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function Layout({ children, rightPanel }: LayoutProps) {
  const { data: adminRole } = useGetMyAdminRole();
  const { data: flags } = useListFlags(FlagStatus.pending);
  const pendingCount = flags?.filter((f) => f.status === "pending").length ?? 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 flex">
          <div className="flex-1 min-w-0 max-w-2xl mx-auto w-full px-0 pb-20 lg:pb-0">
            {children}
          </div>
          {rightPanel && (
            <aside className="hidden xl:block w-80 flex-shrink-0 py-6 pr-6">
              {rightPanel}
            </aside>
          )}
        </main>
      </div>
      <MobileNav />
      <Toaster position="bottom-right" richColors />
      {adminRole != null && (
        <Link
          to="/admin"
          data-ocid="admin.fab_button"
          className="group fixed bottom-20 right-6 z-50 sm:bottom-6 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          aria-label="Admin Panel"
        >
          <span className="relative">
            <Shield className="h-5 w-5 flex-shrink-0" />
            {pendingCount > 0 && (
              <span
                data-ocid="admin.badge"
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background"
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 group-hover:max-w-xs">
            Admin Panel
          </span>
        </Link>
      )}
    </div>
  );
}
