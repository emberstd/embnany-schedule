import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col font-serif">{children}</body>
    </html>
  );
}
