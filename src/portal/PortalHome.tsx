import Link from "next/link";
import { SiteFooter } from "@schedule/components/SiteFooter";
import { VideoBackground } from "@/components/VideoBackground";
import { PortalHeader } from "@/portal/PortalHeader";
import { portalIcon } from "@/portal/portalAssets";
import { portalOrbitron } from "@/portal/portalFont";

const PORTAL_CARDS = [
  {
    href: "/schedule",
    label: "Schedule",
    icon: portalIcon("/icons/schedule-megaphone.png"),
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: portalIcon("/icons/dashboard-chart.png"),
  },
] as const;

export function PortalHome() {
  return (
    <>
      <VideoBackground />
      <main className="portal-page relative flex min-h-dvh flex-col">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className={`portal-shell ${portalOrbitron.className}`}>
            <PortalHeader />

            <nav className="portal-nav" aria-label="Modules">
              {PORTAL_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="portal-glass-card group"
                >
                  <img
                    src={card.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="portal-glass-card-icon brightness-0 invert"
                    aria-hidden
                    draggable={false}
                  />
                  <span className="portal-glass-card-label">{card.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
