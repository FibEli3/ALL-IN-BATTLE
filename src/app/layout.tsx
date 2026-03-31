import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALL IN BATTLE | Hip-Hop Event in Krasnodar",
  description:
    "Landing page for the ALL IN BATTLE hip-hop improvisation event in Krasnodar.",
  icons: {
    icon: "/logo/IMG_6184.PNG",
    shortcut: "/logo/IMG_6184.PNG",
    apple: "/logo/IMG_6184.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
