import Link from "next/link";
import Image from "next/image";
import { newsMock } from "@/lib/news";

export const metadata = {
  title: "Новости и события — КАКБ",
  description: "Актуальные новости и анонсы Ассоциации",
};

const PAGE_SIZE = 6;

export default function NewsPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const q = (searchParams.q ?? "").trim().toLowerCase();

  const filtered = newsMock
    .filter(n => !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q) || n.tags?.some(t => t.toLowerCase().includes(q)))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const list = filtered.slice(start, start + PAGE_SIZE);

  const makeUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `/news?${s}` : "/news";
  };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Новости и события</h1>
        <form className="ml-auto">
          <input
            name="q"
            defaultValue={q}
            placeholder="Поиск по новостям…"
            className="border rounded-md px-3 py-2"
          />
        </form>
      </div>

      {list.length === 0 ? (
        <p className="text-muted-foreground">Ничего не найдено.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <article key={n.id} className="border rounded-xl overflow-hidden bg-white">
              {n.cover && (
                <Image src={n.cover} alt="" width={800} height={450} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <time className="text-xs text-muted-foreground">
                  {new Date(n.date).toLocaleDateString("ru-RU")}
                </time>
                <h2 className="text-xl font-semibold mt-1">{n.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{n.excerpt}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {n.tags?.map(t => (
                    <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="text-xs px-2 py-1 rounded bg-blue-50">
                      #{t}
                    </Link>
                  ))}
                </div>
                <Link className="inline-block mt-3 text-blue-700 underline" href={`/news/${n.slug}`}>
                  Читать далее
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Пагинация */}
      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">
          Стр. {page} из {totalPages} — всего {total}
        </span>
        <div className="flex gap-2">
          <Link aria-disabled={page<=1} className={`px-3 py-2 border rounded ${page<=1 ? "pointer-events-none opacity-50":""}`} href={makeUrl(page-1)}>Назад</Link>
          <Link aria-disabled={page>=totalPages} className={`px-3 py-2 border rounded ${page>=totalPages ? "pointer-events-none opacity-50":""}`} href={makeUrl(page+1)}>Вперёд</Link>
        </div>
      </div>
    </section>
  );
}
