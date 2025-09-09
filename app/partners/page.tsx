import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Globe, MapPin, Mail, Phone, Building2, Landmark, Shield, Cpu, GraduationCap, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Partner, PartnerCategory, partners } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Партнёры — КАКБ",
  description: "Официальные партнёры Казахстанской Ассоциации Кредитных Брокеров. Банки, финтех, МФО, страховые и образовательные организации.",
  openGraph: {
    title: "Партнёры — КАКБ",
    description: "Официальные партнёры Казахстанской Ассоциации Кредитных Брокеров.",
    type: "website",
  },
};


// ----- Helpers -----
const CATEGORY_META: Record<PartnerCategory, { label: string; Icon: React.ComponentType<any>; tone: string }> = {
  BANK: { label: "Банк", Icon: Building2, tone: "bg-blue-50 text-blue-700" },
  MFO: { label: "МФО", Icon: Landmark, tone: "bg-amber-50 text-amber-700" },
  INSURANCE: { label: "Страхование", Icon: Shield, tone: "bg-emerald-50 text-emerald-700" },
  FINTECH: { label: "Финтех", Icon: Cpu, tone: "bg-purple-50 text-purple-700" },
  EDU: { label: "Обучение", Icon: GraduationCap, tone: "bg-cyan-50 text-cyan-700" },
  ASSOCIATION: { label: "Объединение", Icon: Tag, tone: "bg-slate-50 text-slate-700" },
};

function initials(name: string) {
  const m = name.match(/[A-Za-zА-Яа-яЁё]+/g) ?? [];
  const i = m.slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return i || name.slice(0, 2).toUpperCase();
}

function byQuery(p: Partner, q?: string) {
  if (!q) return true;
  const s = q.trim().toLowerCase();
  return (
    p.name.toLowerCase().includes(s) ||
    (p.description?.toLowerCase().includes(s) ?? false) ||
    (p.city?.toLowerCase().includes(s) ?? false) ||
    (p.tags?.some((t) => t.toLowerCase().includes(s)) ?? false)
  );
}

function byCategory(p: Partner, cat?: string) {
  if (!cat) return true;
  return p.category === cat;
}

function sortPartners(list: Partner[], mode?: string) {
  const arr = [...list];
  switch (mode) {
    case "name_desc":
      return arr.sort((a, b) => b.name.localeCompare(a.name, "ru"));
    case "name_asc":
    default:
      return arr.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }
}

// ----- Page -----
export default async function PartnersPage({
  searchParams,
}: {
  searchParams?: { q?: string; cat?: PartnerCategory | "ALL"; sort?: string };
}) {
  const q = searchParams?.q ?? "";
  const catParam = (searchParams?.cat as PartnerCategory | "ALL" | undefined) ?? "ALL";
  const cat = catParam !== "ALL" ? (catParam as PartnerCategory) : undefined;
  const sort = searchParams?.sort ?? "name_asc";

  const filtered = sortPartners(
    partners.filter((p) => byQuery(p, q)).filter((p) => byCategory(p, cat)),
    sort
  );

  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Партнёры Ассоциации</h1>
            <p className="mt-3 text-muted-foreground">
              Мы развиваем рынок кредитного брокеринга совместно с банками, финтех-компаниями, МФО,
              страховыми и образовательными организациями.
            </p>
          </div>

          {/* Filters */}
          <form className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3" action="/partners" method="get">
            <div className="md:col-span-2">
              <Label htmlFor="q">Поиск</Label>
              <Input id="q" name="q" defaultValue={q} placeholder="Название, тег, город…" />
            </div>
            <div>
              <Label htmlFor="cat">Категория</Label>
              <Select name="cat" defaultValue={catParam}>
                <SelectTrigger id="cat"><SelectValue placeholder="Все категории" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все категории</SelectItem>
                  <SelectItem value="BANK">Банки</SelectItem>
                  <SelectItem value="MFO">МФО</SelectItem>
                  <SelectItem value="INSURANCE">Страхование</SelectItem>
                  <SelectItem value="FINTECH">Финтех</SelectItem>
                  <SelectItem value="EDU">Обучение</SelectItem>
                  <SelectItem value="ASSOCIATION">Объединения</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Сортировать</Label>
              <Select name="sort" defaultValue={sort}>
                <SelectTrigger id="sort"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">По названию (А→Я)</SelectItem>
                  <SelectItem value="name_desc">По названию (Я→А)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-4 flex gap-2 pt-1.5">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Применить</Button>
              <Button type="reset" variant="outline" asChild>
                <Link href="/partners">Сбросить</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <PartnerCard p={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ----- UI blocks -----
function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Ничего не найдено</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {query ? (
          <p>
            По запросу <span className="font-medium text-foreground">“{query}”</span> партнёры не найдены. Попробуйте
            изменить критерии поиска.
          </p>
        ) : (
          <p>Партнёры отсутствуют. Скоро здесь появятся новые организации.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline"><Link href="/partners">Сбросить фильтры</Link></Button>
      </CardFooter>
    </Card>
  );
}

function PartnerCard({ p }: { p: Partner }) {
  const Meta = CATEGORY_META[p.category];
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white overflow-hidden">
            {p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="text-sm font-semibold">{initials(p.name)}</span>
            )}
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{p.name}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className={`${Meta.tone} border-0`}> 
                <Meta.Icon className="mr-1 h-3.5 w-3.5" /> {Meta.label}
              </Badge>
              {p.city && (
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.city}</span>
              )}
            </div>
          </div>
        </div>
        {p.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
        )}
      </CardHeader>

      {p.tags && p.tags.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
            ))}
          </div>
        </CardContent>
      )}

      <CardFooter className="mt-auto flex flex-wrap gap-2">
        {p.siteUrl && (
          <Button asChild variant="outline">
            <Link href={p.siteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" /> Сайт <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
        {p.phone && (
          <Button asChild variant="ghost">
            <a href={`tel:${p.phone}`}>
              <Phone className="mr-2 h-4 w-4" /> {p.phone}
            </a>
          </Button>
        )}
        {p.email && (
          <Button asChild variant="ghost">
            <a href={`mailto:${p.email}`}>
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
