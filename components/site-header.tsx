"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import clsx from "clsx";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>КАКБ</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-sm px-2 py-1 rounded-md hover:bg-blue-50",
                  active && "text-blue-700 font-medium"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Button className="bg-blue-600 hover:bg-blue-700">Вступить</Button>
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Открыть меню">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader><SheetTitle>Меню</SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "px-3 py-2 rounded-md hover:bg-blue-50",
                        active && "text-blue-700 font-medium"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Вступить</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
