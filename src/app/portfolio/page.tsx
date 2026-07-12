import Link from "next/link";
import { VideoBackground } from "@/components/VideoBackground";
import { portalIcon } from "@/portal/portalAssets";

export default function PortfolioPage() {
  return (
    <>
      <VideoBackground overlayClassName="bg-black/45" />
      <main className="portal-page relative flex min-h-dvh flex-col items-center justify-center px-4 py-16">
        <div className="portal-glass-card w-full max-w-lg flex-col rounded-3xl p-8 text-center">
          <img
            src={portalIcon("/icons/portfolio-sparkle.png")}
            alt=""
            width={40}
            height={40}
            className="mx-auto brightness-0 invert"
            aria-hidden
            draggable={false}
          />
          <h1 className="mt-4 text-2xl font-bold tracking-wide text-white">
            Portfolio
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/65">
            Coming Soon
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Creative works and highlights are in development. Stay tuned.
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
