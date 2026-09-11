"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { FutbotMark } from "@/components/icons/FutbotMark";
import { IconBell, IconStar } from "@/components/icons/BrandIcons";

export function Sidebar({ seasonDecor }: { seasonDecor?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-line bg-surface p-4 lg:flex">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2.5 px-2">
        <FutbotMark size={32} />
        <span className="font-display text-lg font-bold tracking-tight">Fynd</span>
        {seasonDecor && (
          <span className="text-lg" aria-hidden>
            {seasonDecor}
          </span>
        )}
      </Link>

      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors " +
              (active
                ? "bg-card text-fg font-medium"
                : "text-muted hover:bg-card/60 hover:text-fg")
            }
          >
            <Icon className={"h-5 w-5 shrink-0 " + (active ? "opacity-100" : "opacity-70")} />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col gap-1 pt-4">
        <Link
          href="/dashboard/notifications"
          className={
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors " +
            (pathname.startsWith("/dashboard/notifications")
              ? "bg-card text-fg font-medium"
              : "text-muted hover:bg-card/60 hover:text-fg")
          }
        >
          <IconBell className="h-5 w-5 shrink-0" />
          Notifikácie
        </Link>
        <Link
          href="/pricing"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-card/60 hover:text-fg"
        >
          <IconStar className="h-5 w-5 shrink-0" />
          Fynd+
        </Link>
      </div>
    </aside>
  );
}
