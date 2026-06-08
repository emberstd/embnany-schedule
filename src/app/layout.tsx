import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmiBonnie Schedule",
  description: "All events schedule for EmiBonnie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="h-full antialiased">
      <body className="flex min-h-dvh flex-col font-serif">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
