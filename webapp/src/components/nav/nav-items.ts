export type NavItem = {
  href: string;
  label: string;
  icon: string; // emoji — jednoduché, bez extra ikon-balíka
  mobile?: boolean; // zobraziť aj v spodnej mobilnej lište
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Domov", icon: "🏠", mobile: true },
  { href: "/dashboard/calendar", label: "Kalendár", icon: "📅", mobile: true },
  { href: "/dashboard/chat", label: "Chat", icon: "💬", mobile: true },
  { href: "/dashboard/matches", label: "Zápasy", icon: "⚽", mobile: true },
  { href: "/dashboard/leaderboards", label: "Rebríčky", icon: "🏆" },
  { href: "/dashboard/rewards", label: "Odmeňovňa", icon: "🎁" },
  { href: "/dashboard/clubs", label: "Kluby", icon: "🛡️" },
  { href: "/dashboard/announcements", label: "Oznamy", icon: "📣" },
  { href: "/dashboard/lost-found", label: "Straty a nálezy", icon: "🔎" },
  { href: "/dashboard/profile", label: "Profil", icon: "👤", mobile: true },
];
