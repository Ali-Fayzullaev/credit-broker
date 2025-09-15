import type { Metadata } from "next";
import Link from "next/link";
import { brokersMock } from "@/lib/brokers";
import { newsMock } from "@/lib/news";
import { partners } from "@/lib/partners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Search,
  Newspaper,
  ArrowRight,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "КАКБ — Казахстанская Ассоциация Кредитных Брокеров",
  description:
    "Официальный сайт Ассоциации: члены, реестр сертифицированных брокеров, новости и партнёры.",
  openGraph: {
    title: "КАКБ — Казахстанская Ассоциация Кредитных Брокеров",
    description: "Реестр брокеров, новости Ассоциации, партнёрства и членство.",
    type: "website",
  },
};

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


const total = brokersMock.length;
const active = brokersMock.filter((b) => b.status === "ACTIVE").length;
const expired = brokersMock.filter((b) => b.status === "EXPIRED").length;
const expSoon = brokersMock.filter((b) => b.status === "EXPIRING_SOON").length;

const latestNews = [...newsMock]
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  .slice(0, 3);

export default function HomePage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-12 md:px-10 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Казахстанская Ассоциация Кредитных Брокеров
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Объединяем профессиональных кредитных брокеров, развиваем
              стандарты рынка и повышаем финансовую грамотность.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/membership">Вступить в Ассоциацию</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/registry">Перейти к реестру</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/about">О нас</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Сертификаты действуют"
          value={active}
          tone="text-emerald-700 bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          title="Скоро истекают"
          value={expSoon}
          tone="text-amber-700 bg-amber-50"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Истёкшие"
          value={expired}
          tone="text-rose-700 bg-rose-50"
        />
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          title="Всего в реестре"
          value={total}
        />
      </div>

      {/* Quick search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> Быстрый поиск по реестру
          </CardTitle>
          <CardDescription>
            Найдите брокера по ФИО, городу или номеру сертификата
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/registry"
            method="get"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2 lg:col-span-3 space-y-2">
              <Label htmlFor="query">Запрос</Label>
              <Input
                id="query"
                name="query"
                placeholder="ФИО, город, № сертификата…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                name="status"
                className="border h-10 rounded-md px-3 text-sm"
              >
                <option value="">Все</option>
                <option value="ACTIVE">Действует</option>
                <option value="EXPIRING_SOON">Скоро истекает</option>
                <option value="EXPIRED">Истёк</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Искать
              </Button>
              <Button type="reset" variant="outline" asChild>
                <Link href="/registry">Сбросить</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* News & Partners */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* News */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" /> Последние новости
            </CardTitle>
            <CardDescription>
              Анонсы, события и важные обновления
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {latestNews.map((n) => (
                <li key={n.id} className="py-3 flex gap-4 items-start">
                  <div className="w-24 shrink-0 text-sm text-muted-foreground">
                    {formatDate(n.date)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium leading-tight truncate">
                      <Link
                        href={`/news/${n.slug}`}
                        className="hover:underline"
                      >
                        {n.title}
                      </Link>
                    </div>
                    {n.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {n.excerpt}
                      </p>
                    )}
                    {(n.tags?.length ?? 0) > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.tags!.slice(0, 4).map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="rounded-full"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/news">
                Все новости <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Partners strip */}
        <Card>
          <CardHeader>
            <CardTitle>Партнёры</CardTitle>
            <CardDescription>
              Организации, с которыми мы работаем
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {partners.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border bg-white overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xs font-semibold">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium truncate" title={p.name}>
                    {p.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/partners">
                Все партнёры <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent" />
        <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              Присоединяйтесь к Ассоциации
            </h2>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Получайте поддержку сообщества, доступ к партнёрским программам и
              участвуйте в развитии отрасли.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/membership">Подать заявку</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">Подробнее</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- small UI ---
function StatCard({
  icon,
  title,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  title: string;
  value: number | string;
  tone?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-xs">
          {icon} {title}
        </CardDescription>
        <CardTitle className={`text-2xl ${tone ?? ""}`}>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
