// components/site-header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { navItems } from "@/lib/nav";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import clsx from "clsx";

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const base = pathname.replace(/^\/(ru|kk|en)/, "");
  const mk = (l: string) => `/${l}${base || ""}` || `/${l}`;
  return (
    <div className="flex items-center gap-2">
      {["ru","kk","en"].map(l => (
        <Link key={l}
          className={clsx("text-xs px-2 py-1 rounded", l===locale && "bg-blue-50 text-blue-700")}
          href={mk(l)}
        >{l.toUpperCase()}</Link>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const pathname = usePathname();

  const withLocale = (slug: string) => `/${currentLocale}/${slug}`.replace(/\/$/, "");

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2 font-semibold">
          <span>KAofCB</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map(item => {
            const href = withLocale(item.href);
            const active = pathname === href;
            return (
              <Link key={item.href} href={href}
                className={clsx("text-sm px-2 py-1 rounded-md hover:bg-blue-50",
                  active && "text-blue-700 font-medium")}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Button className="bg-blue-600 hover:bg-blue-700">{t("cta.join")}</Button>
          <LocaleSwitcher />
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <LocaleSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Открыть меню"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader><SheetTitle>Меню</SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
                {navItems.map(item => {
                  const href = withLocale(item.href);
                  const active = pathname === href;
                  return (
                    <Link key={item.href} href={href}
                      className={clsx("px-3 py-2 rounded-md hover:bg-blue-50",
                        active && "text-blue-700 font-medium")}
                    >
                      {t(item.key)}
                    </Link>
                  );
                })}
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700">{t("cta.join")}</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
