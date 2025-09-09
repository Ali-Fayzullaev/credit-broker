import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground grid gap-2 md:flex md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Kazakhstan Association of Credit Brokers</p>
        <div className="flex gap-4">
          <Link href="/legal">Юридическая база</Link>
          <Link href="/contacts">Контакты</Link>
        </div>
      </div>
    </footer>
  );
}
