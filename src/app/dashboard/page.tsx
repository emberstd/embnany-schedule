import Link from "next/link";
import { VideoBackground } from "@/components/VideoBackground";

export default function DashboardPage() {
  return (
    <>
      <VideoBackground overlayClassName="bg-black/45" />
      <main className="portal-page relative flex min-h-dvh flex-col items-center justify-center px-4 py-16">
        <div className="portal-glass-card w-full max-w-lg flex-col rounded-3xl p-8 text-center">
          <span className="text-4xl" aria-hidden>
            📊
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-wide text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/65">
            Coming Soon
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Analytics and trend insights are in development. Stay tuned.
          </p>
          <Link
            href="/"
            className="glass-button mt-8 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
