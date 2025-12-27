import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Platform | MDX + Prisma",
  description: "Plataforma de blogs moderna con MDX, Prisma y PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(96,165,250,0.08),transparent_25%),radial-gradient(circle_at_50%_50%,rgba(248,250,252,0.04),transparent_35%)]" />
        <div className="min-h-screen">
          <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur sm:px-10">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
              <span>Blog Platform</span>
            </div>
            <div className="flex gap-3 text-sm text-zinc-200">
              <Link className="rounded-full px-3 py-1 transition hover:bg-white/5" href="/">
                Inicio
              </Link>
              <Link className="rounded-full px-3 py-1 transition hover:bg-white/5" href="/editor">
                Editor
              </Link>
              <Link className="rounded-full px-3 py-1 transition hover:bg-white/5" href="/api/posts">
                API
              </Link>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
