"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.mobile);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/95 backdrop-blur lg:hidden">
      {items.map((item) => {
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
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] " +
              (active ? "text-green" : "text-muted")
            }
          >
            <Icon className={"h-5 w-5 " + (active ? "opacity-100" : "opacity-70")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
