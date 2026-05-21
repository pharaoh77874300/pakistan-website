import { Toaster } from "@/components/ui/sonner";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function Layout({ children, rightPanel }: LayoutProps) {
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
    </div>
  );
}
