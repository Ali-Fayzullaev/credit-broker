import type { Metadata } from "next";
import Link from "next/link";
import { brokersMock, type Broker } from "@/lib/brokers";
import { newsMock } from "@/lib/news";
import { partners } from "@/lib/partners";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, FileDown, ShieldCheck, Clock, Mail, Phone, MapPin, Building2, Newspaper, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Личный кабинет — КАКБ",
  description: "Панель участника Ассоциации: статус сертификата, профиль, документы и новости.",
};

// ---- helpers ----
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return iso;
  }
}

function daysBetween(a: string, b: string) {
  const A = new Date(a).getTime();
  const B = new Date(b).getTime();
  const ms = Math.max(0, B - A);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function calcProgress(issuedAt: string, expiresAt: string) {
  const start = new Date(issuedAt).getTime();
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  const total = Math.max(1, end - start);
  const passed = Math.min(Math.max(0, now - start), total);
  return Math.round((passed / total) * 100);
}

function daysLeft(expiresAt: string) {
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}

const STATUS_META: Record<Broker["status"], { label: string; tone: string }> = {
  ACTIVE: { label: "Действует", tone: "bg-emerald-50 text-emerald-700" },
  EXPIRING_SOON: { label: "Скоро истекает", tone: "bg-amber-50 text-amber-700" },
  EXPIRED: { label: "Истёк", tone: "bg-rose-50 text-rose-700" },
};

export default async function CabinetPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  // MVP: берём брокера по id из query (?id=b1) или первого из моков
  const current: Broker | undefined = brokersMock.find((b) => b.id === searchParams?.id) ?? brokersMock[0];

  if (!current) {
    return (
      <section className="space-y-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Личный кабинет</CardTitle>
            <CardDescription>Данные участника не найдены.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Похоже, у вас пока нет профиля. Вы можете подать заявку на членство.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="/membership">Подать заявку</Link></Button>
          </CardFooter>
        </Card>
      </section>
    );
  }

  const meta = STATUS_META[current.status];
  const left = daysLeft(current.expiresAt);
  const progress = calcProgress(current.issuedAt, current.expiresAt);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border bg-white/80 backdrop-blur p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Личный кабинет</h1>
            <p className="text-muted-foreground">Здравствуйте, {current.fullName}. Здесь отображается статус сертификата и ваши данные участника.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${meta.tone} border-0`}>{meta.label}</Badge>
            <Badge variant="outline" className="rounded-full"><ShieldCheck className="mr-1 h-3.5 w-3.5"/> № {current.certificateNo}</Badge>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Certificate card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Сертификат</CardTitle>
            <CardDescription>Действителен с {formatDate(current.issuedAt)} по {formatDate(current.expiresAt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat title="Статус" value={meta.label} icon={<ShieldCheck className="h-4 w-4"/>} tone={meta.tone} />
              <Stat title="Осталось дней" value={left > 0 ? left : 0} icon={<Clock className="h-4 w-4"/>} />
              <Stat title="Город" value={current.city} icon={<MapPin className="h-4 w-4"/>} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Срок действия</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {current.certificateUrl && (
              <Button asChild variant="outline">
                <Link href={current.certificateUrl} target="_blank" rel="noopener">
                  <FileDown className="mr-2 h-4 w-4"/> Скачать сертификат (PDF)
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link href={`/membership?renew=${current.certificateNo}`}>
                Продлить сертификат
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Profile card */}
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Контактные данные и организация</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4"/> {current.organization ?? "—"}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4"/> {current.email ?? "—"}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4"/> {current.phone ?? "—"}</div>
            <Separator />
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Выдан: {formatDate(current.issuedAt)}</div>
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Истекает: {formatDate(current.expiresAt)}</div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline"><Link href="/contacts">Обновить данные</Link></Button>
          </CardFooter>
        </Card>

        {/* News card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5"/> Новости Ассоциации</CardTitle>
            <CardDescription>Последние объявления и события</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Теги</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsMock.slice(0, 5).map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(n.date)}</TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/news/${n.slug}`} className="hover:underline">{n.title}</Link>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <div className="flex flex-wrap gap-1">
                        {(n.tags ?? []).map((t) => (
                          <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/news">Все новости <ArrowRight className="h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Partners highlight */}
        <Card>
          <CardHeader>
            <CardTitle>Партнёры</CardTitle>
            <CardDescription>Полезные контакты</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {partners.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-muted-foreground truncate">{p.description ?? "—"}</div>
                  </div>
                  {p.siteUrl && (
                    <Button asChild size="sm" variant="outline"><Link href={p.siteUrl} target="_blank" rel="noopener">Сайт</Link></Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/partners">Все партнёры <ArrowRight className="h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

// --- small UI ---
function Stat({ title, value, icon, tone }: { title: string; value: string | number; icon?: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">{icon} {title}</div>
      <div className={`mt-1.5 text-lg font-semibold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
