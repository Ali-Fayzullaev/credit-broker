"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav";
import clsx from "clsx";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DesktopNav() {
  const pathname = usePathname();

  const primary = navItems
    .filter(i => i.desktop)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const more = navItems.filter(i => !i.desktop);

  return (
    <nav className="hidden md:flex items-center gap-3" aria-label="Главная навигация">
      {primary.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "relative text-[15px] px-4 py-2 rounded-xl transition-colors hover:bg-blue-50",
              active && "text-blue-700"
            )}
          >
            {item.short ?? item.label}
            {active && (
              <span className="pointer-events-none absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-blue-600" />
            )}
          </Link>
        );
      })}

      {/* «Вступить» — отдельной кнопкой */}
      <Button className="ml-1 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700" asChild>
        <Link href="/membership">Вступить</Link>
      </Button>

      {/* «Ещё» со второстепенными ссылками */}
      {more.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 rounded-xl">Ещё</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {more.map((m) => (
              <DropdownMenuItem key={m.href} asChild>
                <Link href={m.href}>{m.short ?? m.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}
