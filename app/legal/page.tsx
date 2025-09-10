import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Shield, Scale, BookOpen, ClipboardList, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Документы — КАКБ",
  description: "Правила, устав, стандарты, политика персональных данных и другие официальные документы Ассоциации.",
  openGraph: {
    title: "Документы — КАКБ",
    description: "Официальные документы КАЗ Ассоциации Кредитных Брокеров: устав, стандарты, политика персональных данных.",
    type: "website",
  },
};

// ----- Types -----
export type DocCategory = "LEGAL" | "STANDARDS" | "DATA" | "AGREEMENTS" | "FORMS";

export type DocItem = {
  id: string;
  title: string;
  category: DocCategory;
  url: string; // /public/docs/...
  updated: string; // ISO
  sizeKB?: number;
  version?: string;
  tags?: string[];
  description?: string;
};

// ----- Mock docs (замените на реальные файлы в /public/docs) -----
const docs: DocItem[] = [
  {
    id: "charter",
    title: "Устав Ассоциации",
    category: "LEGAL",
    url: "/docs/charter.pdf",
    updated: "2025-08-15T00:00:00.000Z",
    sizeKB: 742,
    version: "1.2",
    tags: ["основание", "статус"],
    description: "Правовая форма, цели, органы управления и порядок принятия решений.",
  },
  {
    id: "membership-rules",
    title: "Положение о членстве",
    category: "LEGAL",
    url: "/docs/membership.pdf",
    updated: "2025-07-20T00:00:00.000Z",
    sizeKB: 268,
    version: "1.0",
    tags: ["вступление", "взносы"],
  },
  {
    id: "standards",
    title: "Профессиональные стандарты и этический кодекс",
    category: "STANDARDS",
    url: "/docs/standards-code.pdf",
    updated: "2025-09-01T00:00:00.000Z",
    sizeKB: 980,
    version: "0.9-draft",
    tags: ["этика", "качество"],
  },
  {
    id: "registry-regulation",
    title: "Регламент ведения реестра сертифицированных брокеров",
    category: "STANDARDS",
    url: "/docs/registry.pdf",
    updated: "2025-08-28T00:00:00.000Z",
    sizeKB: 356,
    version: "1.0",
    tags: ["реестр", "сертификат"],
  },
  {
    id: "privacy",
    title: "Политика обработки персональных данных",
    category: "DATA",
    url: "/docs/privacy.pdf",
    updated: "2025-07-05T00:00:00.000Z",
    sizeKB: 201,
    version: "1.0",
    tags: ["персональные данные"],
  },
  {
    id: "cookies",
    title: "Политика cookie",
    category: "DATA",
    url: "/docs/cookies.pdf",
    updated: "2025-07-05T00:00:00.000Z",
    sizeKB: 96,
    version: "1.0",
    tags: ["cookie"],
  },
  {
    id: "partner-agreement",
    title: "Типовое партнёрское соглашение",
    category: "AGREEMENTS",
    url: "/docs/partner-agreement.pdf",
    updated: "2025-08-10T00:00:00.000Z",
    sizeKB: 433,
    version: "1.1",
    tags: ["партнёры"],
  },
  {
    id: "form-consent",
    title: "Согласие на обработку персональных данных (форма)",
    category: "FORMS",
    url: "/docs/consent-form.pdf",
    updated: "2025-06-12T00:00:00.000Z",
    sizeKB: 57,
    version: "1.0",
    tags: ["форма", "персональные данные"],
  },
];

// ----- Helpers -----
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return iso;
  }
}

function formatSize(kb?: number) {
  if (!kb) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function byQuery(d: DocItem, q?: string) {
  if (!q) return true;
  const s = q.trim().toLowerCase();
  return (
    d.title.toLowerCase().includes(s) ||
    (d.description?.toLowerCase().includes(s) ?? false) ||
    (d.tags?.some((t) => t.toLowerCase().includes(s)) ?? false)
  );
}

function sortDocs(list: DocItem[], mode?: string) {
  const arr = [...list];
  switch (mode) {
    case "name_asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    case "name_desc":
      return arr.sort((a, b) => b.title.localeCompare(a.title, "ru"));
    case "date_asc":
      return arr.sort((a, b) => +new Date(a.updated) - +new Date(b.updated));
    case "date_desc":
    default:
      return arr.sort((a, b) => +new Date(b.updated) - +new Date(a.updated));
  }
}

const CATEGORY_META: Record<DocCategory, { label: string; Icon: React.ComponentType<any>; tone: string }> = {
  LEGAL: { label: "Правовые", Icon: Scale, tone: "bg-slate-50 text-slate-700" },
  STANDARDS: { label: "Стандарты", Icon: BookOpen, tone: "bg-blue-50 text-blue-700" },
  DATA: { label: "Персональные данные", Icon: Shield, tone: "bg-emerald-50 text-emerald-700" },
  AGREEMENTS: { label: "Соглашения", Icon: ClipboardList, tone: "bg-purple-50 text-purple-700" },
  FORMS: { label: "Формы", Icon: FileText, tone: "bg-amber-50 text-amber-700" },
};

// ----- Page -----
export default async function LegalPage({
  searchParams,
}: {
  searchParams?: { q?: string; cat?: DocCategory | "ALL"; sort?: string };
}) {
  const q = searchParams?.q ?? "";
  const catParam = (searchParams?.cat as DocCategory | "ALL" | undefined) ?? "ALL";
  const cat = catParam !== "ALL" ? (catParam as DocCategory) : undefined;
  const sort = searchParams?.sort ?? "date_desc";

  const filtered = sortDocs(
    docs.filter((d) => byQuery(d, q)).filter((d) => (cat ? d.category === cat : true)),
    sort
  );

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Документы</h1>
            <p className="mt-3 text-muted-foreground">Правовые документы, стандарты и политики. Актуальные версии доступны для просмотра и скачивания.</p>
          </div>

          {/* Filters */}
          <form className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3" action="/legal" method="get">
            <div className="md:col-span-3">
              <Label htmlFor="q">Поиск</Label>
              <Input id="q" name="q" defaultValue={q} placeholder="Название, тег, фрагмент текста…" />
            </div>
            <div>
              <Label htmlFor="cat">Категория</Label>
              <select id="cat" name="cat" defaultValue={catParam} className="border rounded-md h-10 px-3 text-sm">
                <option value="ALL">Все</option>
                <option value="LEGAL">Правовые</option>
                <option value="STANDARDS">Стандарты</option>
                <option value="DATA">Персональные данные</option>
                <option value="AGREEMENTS">Соглашения</option>
                <option value="FORMS">Формы</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sort">Сортировка</Label>
              <select id="sort" name="sort" defaultValue={sort} className="border rounded-md h-10 px-3 text-sm">
                <option value="date_desc">Сначала новые</option>
                <option value="date_asc">Сначала старые</option>
                <option value="name_asc">По названию (А→Я)</option>
                <option value="name_desc">По названию (Я→А)</option>
              </select>
            </div>
            <div className="md:col-span-5 flex gap-2 pt-1.5">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Применить</Button>
              <Button type="reset" variant="outline" asChild>
                <Link href="/legal">Сбросить</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Список документов</CardTitle>
            <CardDescription>Нажмите «Просмотр» для открытия в браузере или «Скачать» для загрузки PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Обновлено</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const Meta = CATEGORY_META[d.category];
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white"><FileText className="h-4 w-4"/></span>
                          <div>
                            <div>{d.title}</div>
                            {d.description && (
                              <div className="text-xs text-muted-foreground line-clamp-2">{d.description}</div>
                            )}
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(d.tags ?? []).map((t) => (
                                <Badge key={t} variant="outline" className="rounded-full text-[11px] py-0">{t}</Badge>
                              ))}
                              {d.version && (
                                <Badge variant="secondary" className="rounded-full text-[11px] py-0">v{d.version}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${Meta.tone} border-0`}>
                          <Meta.Icon className="mr-1 h-3.5 w-3.5"/> {Meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(d.updated)}</TableCell>
                      <TableCell>{formatSize(d.sizeKB)}</TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={d.url} target="_blank" rel="noopener"><Eye className="h-4 w-4 mr-1"/> Просмотр</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href={d.url} download>
                            <Download className="h-4 w-4 mr-1"/> Скачать
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card>
        <CardHeader>
          <CardTitle>Не нашли нужный документ?</CardTitle>
          <CardDescription>Напишите нам — вышлем актуальную версию или укажем ссылку</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="/contacts">Запросить документ</Link></Button>
        </CardContent>
      </Card>
    </section>
  );
}

// ----- UI blocks -----
function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Документы не найдены</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {query ? (
          <p>
            По запросу <span className="font-medium text-foreground">“{query}”</span> ничего не найдено. Попробуйте изменить фильтры.
          </p>
        ) : (
          <p>Здесь будут размещены официальные документы Ассоциации.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline"><Link href="/legal">Сбросить фильтры</Link></Button>
      </CardFooter>
    </Card>
  );
}
