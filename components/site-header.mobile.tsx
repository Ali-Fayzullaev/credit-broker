// components/site-header.mobile.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navItems } from "@/lib/nav";
import clsx from "clsx";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Открыть меню">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 mt-4" aria-label="Главная навигация">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "px-3 py-2 rounded-lg transition-colors hover:bg-blue-50",
                    active && "text-blue-700 font-medium"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button onClick={() => setOpen(false)} className="mt-2 bg-blue-600 hover:bg-blue-700">
              Вступить
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
