import type { ComponentType, SVGProps } from "react";
import {
  IconHome,
  IconCalendar,
  IconChat,
  IconMatches,
  IconTrophy,
  IconGift,
  IconShield,
  IconMegaphone,
  IconSearch,
  IconJersey,
} from "@/components/icons/BrandIcons";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  mobile?: boolean; // zobraziť aj v spodnej mobilnej lište
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Domov", icon: IconHome, mobile: true },
  { href: "/dashboard/calendar", label: "Kalendár", icon: IconCalendar, mobile: true },
  { href: "/dashboard/chat", label: "Chat", icon: IconChat, mobile: true },
  { href: "/dashboard/matches", label: "Zápasy", icon: IconMatches, mobile: true },
  { href: "/dashboard/leaderboards", label: "Rebríčky", icon: IconTrophy },
  { href: "/dashboard/rewards", label: "Odmeňovňa", icon: IconGift },
  { href: "/dashboard/clubs", label: "Kluby", icon: IconShield },
  { href: "/dashboard/announcements", label: "Oznamy", icon: IconMegaphone },
  { href: "/dashboard/lost-found", label: "Straty a nálezy", icon: IconSearch },
  { href: "/dashboard/profile", label: "Profil", icon: IconJersey, mobile: true },
];
