"use client";

import { Link, usePathname } from "@/lib/i18n/routing";
import { Calendar, CalendarX2, LayoutDashboard, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/blocked-dates", label: "Blocked dates", icon: CalendarX2 },
  { href: "/admin/optometrists", label: "Optometrists", icon: UserCog },
];

export function AdminNav(_props?: { items?: unknown }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 overflow-y-auto p-3">
      <ul className="space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
