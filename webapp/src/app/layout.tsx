import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Fynd — Beyond the Score",
  description:
    "Digitálny domov pre športové kluby a ich komunity — tréningové streaky, XP, live výsledky a klubový chat.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fynd",
  },
};

export const viewport: Viewport = {
  themeColor: "#06101e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink text-fg font-sans">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
