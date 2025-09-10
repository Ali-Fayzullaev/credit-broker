import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Newspaper, ArrowRight } from "lucide-react";
import { newsMock } from "@/lib/news";

export const metadata: Metadata = {
  title: "Аналитика — КАКБ",
  description: "Исследования и аналитика рынка кредитного брокеринга: тренды, кейсы, дайджесты.",
  openGraph: {
    title: "Аналитика — КАКБ",
    description: "Исследования, обзоры и аналитические материалы Ассоциации.",
    type: "website",
  },
};

// ---- types & mock (перенесём в lib позже) ----
export type Post = {
  id: string;
  title: string;
  slug: string;
  date: string; // ISO
  excerpt: string;
  cover?: string; // /public/images/...
  tags?: string[];
};

const posts: Post[] = [
  {
    id: "p3",
    title: "Ипотека 2025: ключевые драйверы спроса",
    slug: "mortgage-2025-demand-drivers",
    date: "2025-09-03T08:00:00.000Z",
    excerpt:
      "Разбираем влияние ставок, субсидий и предложения застройщиков на спрос. Что важно учитывать брокеру при консультации?",
    cover: "/not-found.png",
    tags: ["ипотека", "рынок", "тренды"],
  },
  {
    id: "p2",
    title: "Скоринг МФО: как объяснять клиенту отказ",
    slug: "mfo-scoring-client-communication",
    date: "2025-08-21T10:00:00.000Z",
    excerpt:
      "От простого к понятному: язык объяснений, работа с альтернативными данными и сценарии повышения одобрения.",
    tags: ["МФО", "скоринг", "этика"],
  },
  {
    id: "p1",
    title: "POS‑кредитование и маркетплейсы: что меняется",
    slug: "pos-credit-marketplaces-2025",
    date: "2025-07-30T09:30:00.000Z",
    excerpt:
      "Комиссии, конверсия и риски. Какую ценность создаёт брокер в новых онлайновых цепочках продаж?",
    cover: "/not-found.png",
    tags: ["POS", "финтех", "практика"],
  },
];

// ---- helpers ----
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function uniqueTags(list: Post[]): string[] {
  return Array.from(new Set(list.flatMap((p) => p.tags ?? [])));
}

function sortPosts(list: Post[], mode?: string) {
  const arr = [...list];
  switch (mode) {
    case "date_asc":
      return arr.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    case "date_desc":
    default:
      return arr.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
}

// ---- page ----
export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string; sort?: string; page?: string };
}) {
  const q = searchParams?.q?.trim() ?? "";
  const tag = searchParams?.tag ?? "";
  const sort = searchParams?.sort ?? "date_desc";
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const perPage = 9;

  const filtered = sortPosts(
    newsMock.filter((p) => {
      const passQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.excerpt?.toLowerCase().includes(q.toLowerCase()) ?? false);
      const passTag = !tag || (p.tags ?? []).includes(tag);
      return passQ && passTag;
    }),
    sort
  );

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);
  const tags = uniqueTags(posts);

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Аналитика</h1>
            <p className="mt-3 text-muted-foreground">Исследования рынка, практические разборы и обзоры инструментов для кредитных брокеров.</p>
          </div>

          {/* Filters */}
          <form className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3" action="/blog" method="get">
            <div className="md:col-span-3">
              <Label htmlFor="q">Поиск</Label>
              <Input id="q" name="q" defaultValue={q} placeholder="Название или фрагмент текста…" />
            </div>
            <div>
              <Label htmlFor="tag">Тег</Label>
              <select id="tag" name="tag" defaultValue={tag} className="border rounded-md h-10 px-3 text-sm">
                <option value="">Все</option>
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sort">Сортировка</Label>
              <select id="sort" name="sort" defaultValue={sort} className="border rounded-md h-10 px-3 text-sm">
                <option value="date_desc">Сначала новые</option>
                <option value="date_asc">Сначала старые</option>
              </select>
            </div>
            <div className="md:col-span-5 flex gap-2 pt-1.5">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Применить</Button>
              <Button type="reset" variant="outline" asChild>
                <Link href="/blog">Сбросить</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => (
            <li key={p.id}>
              <PostCard p={p} />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Пагинация">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
            const sp = new URLSearchParams();
            if (q) sp.set("q", q);
            if (tag) sp.set("tag", tag);
            if (sort) sp.set("sort", sort);
            sp.set("page", String(n));
            const href = `/blog?${sp.toString()}`;
            const active = n === page;
            return (
              <Link key={n} href={href} className={`px-3 py-1.5 rounded-md text-sm border ${active ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}`}>{n}</Link>
            );
          })}
        </nav>
      )}

      {/* CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5"/> Предложить тему</CardTitle>
          <CardDescription>Есть идея для исследования или кейса? Напишите нам.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="/contacts">Отправить предложение</Link></Button>
        </CardContent>
      </Card>
    </section>
  );
}

// ---- UI blocks ----
function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Материалы не найдены</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {query ? (
          <p>По запросу <span className="font-medium text-foreground">“{query}”</span> ничего не найдено. Попробуйте изменить критерии.</p>
        ) : (
          <p>Скоро здесь появятся аналитические материалы и обзоры.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline"><Link href="/blog">Сбросить фильтры</Link></Button>
      </CardFooter>
    </Card>
  );
}

function PostCard({ p }: { p: Post }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg leading-snug line-clamp-2">
          <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
        </CardTitle>
        <div className="text-xs text-muted-foreground">{formatDate(p.date)}</div>
      </CardHeader>
      {p.cover && (
        <div className="mx-4 rounded-xl overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt="" className="h-36 w-full object-cover" loading="lazy" />
        </div>
      )}
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
        {(p.tags?.length ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {p.tags!.slice(0, 5).map((t) => (
              <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild variant="ghost" className="gap-1">
          <Link href={`/blog/${p.slug}`}>Читать <ArrowRight className="h-4 w-4"/></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
