import { portalOrbitron } from "@/portal/portalFont";

export function PortalHeader() {
  return (
    <header className="portal-header">
      <h1
        className={`portal-brand ${portalOrbitron.className}`}
        aria-label="EmiBonnie and Any"
      >
        <span className="portal-brand-word portal-brand-word-top">EMIBONNIE</span>
        <span className="portal-brand-amp" aria-hidden="true">
          &amp;
        </span>
        <span className="portal-brand-word portal-brand-word-bottom">ANY</span>
      </h1>
    </header>
  );
}
