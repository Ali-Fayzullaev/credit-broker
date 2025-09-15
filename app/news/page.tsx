import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { newsMock } from "@/lib/news";
import type { NewsItem } from "@/lib/news";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CalendarDays, Tag, ArrowLeft, ArrowRight, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Новости и события — КАКБ",
  description: "Актуальные новости и анонсы Ассоциации",
  openGraph: {
    title: "Новости и события — КАКБ",
    description: "Актуальные новости и анонсы Ассоциации",
    type: "website",
  },
};

const PAGE_SIZE = 6;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "long", day: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function isNew(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  return now - d < 1000 * 60 * 60 * 24 * 14; // 14 дней
}

export default function NewsPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const q = (searchParams.q ?? "").trim().toLowerCase();

  const filtered = newsMock
    .filter((n) =>
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.excerpt.toLowerCase().includes(q) ||
      (n.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
    )
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

  // Выделим первую новость на первой странице (без union с undefined для rest)
  let featured: NewsItem | undefined = undefined;
  let gridItems: NewsItem[] = list;
  if (page === 1 && list.length > 0) {
    [featured, ...gridItems] = list;
  }

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Новости и события</h1>
            <p className="mt-3 text-muted-foreground">Актуальные новости, анонсы мероприятий и официальные заявления Ассоциации.</p>
          </div>

          {/* Search */}
          <form className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3" action="/news" method="get">
            <div className="md:col-span-4">
              <Label htmlFor="q">Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="q" name="q" defaultValue={q} placeholder="Название, тег или фрагмент текста…" className="pl-9" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Найти</Button>
              {q && (
                <Button asChild variant="outline"><Link href="/news">Сбросить</Link></Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search badge */}
      {q && (
        <div className="rounded-xl border bg-blue-50 text-blue-900 px-4 py-3 flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>
            {total > 0 ? `Найдено ${total} материалов по запросу “${q}”` : `По запросу “${q}” ничего не найдено`}
          </span>
          {total > 0 && (
            <Button asChild variant="ghost" className="ml-auto"><Link href="/news">Очистить</Link></Button>
          )}
        </div>
      )}

      {/* Featured */}
      {featured && (
        <Card className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[260px]">
              {featured.cover ? (
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white" />
              )}
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> {formatDate(featured.date)}
                {isNew(featured.date) && <Badge className="ml-2 bg-emerald-600">Новое</Badge>}
              </div>
              <CardTitle className="mt-2 text-2xl md:text-3xl leading-tight">
                <Link href={`/news/${featured.slug}`} className="hover:underline">
                  {featured.title}
                </Link>
              </CardTitle>
              {featured.excerpt && (
                <CardDescription className="mt-3 text-base">
                  {featured.excerpt}
                </CardDescription>
              )}
              {(featured.tags?.length ?? 0) > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {featured.tags!.slice(0, 6).map((t) => (
                    <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button asChild>
                  <Link href={`/news/${featured.slug}`}>Читать</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid */}
      {(!featured && list.length === 0) ? (
        <EmptyState query={q} />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((n) => (
            <li key={n.id}>
              <Card className="h-full overflow-hidden group">
                {n.cover && (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={n.cover}
                      alt={n.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4" /> {formatDate(n.date)}
                    {isNew(n.date) && <Badge className="ml-2 bg-emerald-600">Новое</Badge>}
                  </div>
                  <CardTitle className="text-lg leading-snug line-clamp-2">
                    <Link href={`/news/${n.slug}`} className="hover:underline">{n.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {n.excerpt && (
                    <CardDescription className="line-clamp-3">{n.excerpt}</CardDescription>
                  )}
                  {(n.tags?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {n.tags!.slice(0, 5).map((t) => (
                        <Badge key={t} variant="outline" className="rounded-full">
                          <Link href={`/news?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {t}
                          </Link>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild variant="ghost" className="gap-1">
                    <Link href={`/news/${n.slug}`}>Читать <ArrowRight className="h-4 w-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6" aria-label="Пагинация">
          <span className="text-sm text-muted-foreground">
            Показано {start + 1}–{Math.min(start + PAGE_SIZE, total)} из {total}
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" disabled={page <= 1}>
              <Link href={makeUrl(page - 1)}><ArrowLeft className="mr-1 h-4 w-4"/> Назад</Link>
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                const active = pageNum === page;
                return (
                  <Link
                    key={pageNum}
                    href={makeUrl(pageNum)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${active ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && <span className="px-2 text-muted-foreground">…</span>}
              {totalPages > 5 && page < totalPages - 2 && (
                <Link href={makeUrl(totalPages)} className="px-3 py-1.5 rounded-md text-sm border hover:bg-blue-50">{totalPages}</Link>
              )}
            </div>
            <Button asChild variant="outline" disabled={page >= totalPages}>
              <Link href={makeUrl(page + 1)}>Вперёд <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>
        </nav>
      )}
    </section>
  );
}

// ---- UI blocks ----
function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5"/> Новостей пока нет</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {query ? (
          <p>По запросу <span className="font-medium text-foreground">“{query}”</span> ничего не найдено. Попробуйте изменить условия.</p>
        ) : (
          <p>Скоро здесь появятся публикации Ассоциации.</p>
        )}
      </CardContent>
    </Card>
  );
}
