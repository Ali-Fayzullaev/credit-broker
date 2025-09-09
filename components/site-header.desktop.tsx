// components/site-header.desktop.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav";
import clsx from "clsx";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Главная навигация">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "relative text-sm px-3 py-2 rounded-xl transition-colors hover:bg-blue-50",
              active && "text-blue-700"
            )}
          >
            <span className="relative z-10">{item.label}</span>
            {active && (
              <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-blue-600" />
            )}
          </Link>
        );
      })}
      <Button className="ml-2 bg-blue-600 hover:bg-blue-700">Вступить</Button>
    </nav>
  );
}
