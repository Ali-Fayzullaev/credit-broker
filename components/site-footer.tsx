// components/site-footer.tsx
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground grid gap-6 md:grid-cols-2">
        <p>© {year} Казахстанская Ассоциация Кредитных Брокеров</p>
        <div className="flex items-center gap-4 md:justify-end">
          <Link className="hover:text-foreground" href="/legal">Юридическая база</Link>
          <Link className="hover:text-foreground" href="/contacts">Контакты</Link>
        </div>
      </div>
    </footer>
  );
}
