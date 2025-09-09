import Link from "next/link";
import { DesktopNav } from "./site-header.desktop";
import { MobileNav } from "./site-header.mobile";

const BRAND = "КАКБ" as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* широкий центровщик */}
      <div className="w-full mx-auto h-16 max-w-[1600px] px-4 sm:px-6 lg:px-10 2xl:px-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="text-base sm:text-lg">{BRAND}</span>
        </Link>

        {/* Desktop nav (client island) */}
        <DesktopNav />

        {/* Mobile nav (client island) */}
        <MobileNav />
      </div>
    </header>
  );
}
