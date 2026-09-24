import type { Metadata } from "next";
import "./globals.css";
import "./responsive-polish.css";

export const metadata: Metadata = {
  title: "ALL IN BATTLE 5: ANNIVERSARY | 24–25 октября 2026",
  description:
    "Юбилейный хип-хоп баттл ALL IN BATTLE 5 в Краснодаре. Судьи, программа двух дней и регистрация участников.",
  icons: {
    icon: "/event/logo.png",
    shortcut: "/event/logo.png",
    apple: "/event/logo.png",
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
