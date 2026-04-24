import { ReactNode } from "react";
import { LayoutDashboard, Users, MessageSquare, Calendar, CreditCard, Camera, FolderOpen, Settings, LogOut, HelpCircle, Search, Bell, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Users, label: "Clients", to: "/clients" },
  { icon: MessageSquare, label: "Leads", to: "/leads" },
  { icon: Calendar, label: "Events", to: "/events" },
  { icon: CreditCard, label: "Billing", to: "/billing" },
  { icon: Camera, label: "Studio", to: "/studio" },
  { icon: FolderOpen, label: "Portfolio", to: "/portfolio" },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-6 py-6 flex items-center gap-2.5">
          <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Camera className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-base leading-none">Lensly</p>
            <p className="text-[11px] text-muted-foreground mt-1">Studio Suite</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeClassName="!bg-gradient-primary !text-primary-foreground shadow-glow"
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 p-4 rounded-2xl glass">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="size-4 text-primary" />
            <p className="text-sm font-semibold">Need help?</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Browse docs and tutorials.</p>
          <Button variant="secondary" size="sm" className="w-full rounded-lg">
            View Help Center
          </Button>
        </div>

        <div className="border-t border-sidebar-border p-3 space-y-1">
          <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Settings className="size-[18px]" /> Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <LogOut className="size-[18px]" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search anything..."
                className="pl-9 h-10 rounded-xl bg-secondary/60 border-border/60 focus-visible:ring-primary"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/60">
                <span className="text-xs text-muted-foreground">Storage</span>
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[12%] rounded-full bg-gradient-primary" />
                </div>
                <span className="text-xs font-medium">3 / 500GB</span>
              </div>

              <Button size="sm" className="rounded-xl bg-warning text-warning-foreground hover:bg-warning/90 shadow-card">
                ⭐ Upgrade
              </Button>

              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="size-10 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <button className="size-10 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors relative">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary animate-pulse" />
              </button>

              <div className="size-10 rounded-xl gradient-primary grid place-items-center text-sm font-bold text-primary-foreground shadow-glow">
                DR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
