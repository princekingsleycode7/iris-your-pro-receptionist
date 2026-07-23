import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  Settings,
  Menu,
  X,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard", active: true },
  { label: "Calls", icon: PhoneCall, to: "/dashboard", active: false },
  { label: "Appointments", icon: CalendarDays, to: "/dashboard", active: false },
  { label: "Settings", icon: Settings, to: "/dashboard", active: false },
];

export function DashboardLayout({ children, email }: { children: ReactNode; email?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60 bg-white border-r border-neutral-200 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          <Link to="/" className="text-sm font-black tracking-[0.25em]">
            IRIS
          </Link>
          <span className="ml-2 text-[10px] font-semibold text-neutral-400 tracking-widest">
            RECEPTIONIST
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white grid place-items-center text-xs font-bold">
              {(email ?? "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{email ?? "Owner"}</div>
              <div className="text-[10px] text-neutral-400">Business owner</div>
            </div>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 grid place-items-center rounded-md hover:bg-neutral-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-black tracking-[0.2em]">IRIS</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ONLINE
        </span>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200">
              <span className="text-sm font-black tracking-[0.25em]">IRIS</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 grid place-items-center rounded-md hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    item.active ? "bg-neutral-100" : "text-neutral-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              onClick={signOut}
              className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-60 pb-24 lg:pb-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-10 py-6 lg:py-10 space-y-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200 grid grid-cols-4 h-16">
        {[
          { label: "Home", icon: LayoutDashboard, active: true },
          { label: "Calls", icon: PhoneCall },
          { label: "Appts", icon: CalendarDays },
          { label: "More", icon: MoreHorizontal },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
              item.active ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
