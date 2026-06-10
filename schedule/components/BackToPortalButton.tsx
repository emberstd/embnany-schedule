"use client";

import Image from "next/image";
import Link from "next/link";

export function BackToPortalButton() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link
        href="/"
        className="region-glass-button flex h-11 w-11 items-center justify-center rounded-full"
        aria-label="Back to portal"
        title="Back to portal"
      >
        <Image
          src="/icons/home-portal.png"
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px] object-contain opacity-95 brightness-0 invert"
          aria-hidden
        />
      </Link>
    </div>
  );
}
