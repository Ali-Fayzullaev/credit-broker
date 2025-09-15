import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { newsMock } from "@/lib/news";
import { CalendarDays, Tag, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return newsMock.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = newsMock.find((n) => n.slug === params.slug);
  if (!item) return {};
  return {
    title: `${item.title} — КАКБ`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      type: "article",
      publishedTime: item.date,
      images: item.cover ? [{ url: item.cover }] : undefined,
    },
  };
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "long", day: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function readingMinutes(markdown: string) {
  const words = markdown.replace(/[#*_>`\-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180)); // ~180 wpm
}

export default function NewsItemPage({ params }: { params: { slug: string } }) {
  const item = newsMock.find((n) => n.slug === params.slug);
  if (!item) return notFound();

  // prev/next по дате (новые вперёд)
  const sorted = [...newsMock].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const idx = sorted.findIndex((n) => n.slug === item.slug);
  const prev = sorted[idx - 1];
  const next = sorted[idx + 1];

  const minutes = readingMinutes(item.content);

  return (
    <article className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <Link href="/news" className="hover:underline">Новости</Link>
            <span className="opacity-60">/</span>
            <span className="text-foreground line-clamp-1">{item.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-3xl">{item.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4"/> {formatDate(item.date)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4"/> {minutes} мин чтения</span>
            {(item.tags?.length ?? 0) > 0 && (
              <span className="inline-flex items-center gap-2">
                <Tag className="h-4 w-4"/>
                <span className="flex flex-wrap gap-1">
                  {item.tags!.slice(0, 4).map((t) => (
                    <Badge key={t} variant="outline" className="rounded-full"><Link href={`/news?q=${encodeURIComponent(t)}`}>{t}</Link></Badge>
                  ))}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover */}
      {item.cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border">
          <Image src={item.cover} alt="" fill sizes="100vw" className="object-cover" priority />
        </div>
      )}

      {/* Content */}
      <Card>
        <CardContent className="prose max-w-none prose-headings:scroll-mt-20 prose-a:underline-offset-4 md:prose-lg dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
        </CardContent>
      </Card>

      {/* Tags */}
      {(item.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags!.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full"><Link href={`/news?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1"><Tag className="h-3 w-3"/> {t}</Link></Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Prev / Next */}
      {(prev || next) && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center justify-start">
            {prev && (
              <Button asChild variant="outline" className="max-w-full truncate">
                <Link href={`/news/${prev.slug}`} className="inline-flex items-center gap-2 truncate">
                  <ArrowLeft className="h-4 w-4"/> <span className="truncate">{prev.title}</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="flex items-center justify-end">
            {next && (
              <Button asChild variant="outline" className="max-w-full truncate">
                <Link href={`/news/${next.slug}`} className="inline-flex items-center gap-2 truncate">
                  <span className="truncate">{next.title}</span> <ArrowRight className="h-4 w-4"/>
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
