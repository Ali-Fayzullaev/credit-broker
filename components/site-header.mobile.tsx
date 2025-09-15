// ===============================
// components/site-header.mobile.tsx
// ===============================
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { navItems } from "@/lib/nav";
import clsx from "clsx";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Открыть меню">
            <Menu />
          </Button>
        </SheetTrigger>
        {/* Широкий, комфортный лист с собственным хедером и фикс-CTA снизу */}
        <SheetContent side="right" className="w-full max-w-[360px] sm:max-w-[420px] p-0">
          <div className="border-b bg-gradient-to-b from-blue-50 to-white px-4 py-4 flex items-center justify-between">
            <SheetHeader className="p-0 m-0">
              <SheetTitle className="text-base">Меню</SheetTitle>
            </SheetHeader>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Закрыть">
              </Button>
            </SheetClose>
          </div>

          <nav className="px-2 py-2" aria-label="Главная навигация">
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
                    "block rounded-xl px-3 py-3 text-[15px] transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "hover:bg-blue-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="sticky bottom-0 inset-x-0 border-t bg-white/90 backdrop-blur px-3 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/membership" onClick={() => setOpen(false)}>
                Вступить <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

