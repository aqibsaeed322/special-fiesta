import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/manger/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:hidden">
        <div className="sticky top-0 z-40 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="h-full px-3 flex items-center justify-between">
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar mode="mobile" onNavigate={() => setMobileSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="font-semibold">TaskManager</div>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <main className="min-h-screen transition-all duration-300 ml-0 lg:ml-64">
        <div className="px-3 py-4 sm:px-4 sm:py-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
