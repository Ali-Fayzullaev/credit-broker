import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { newsMock } from "@/lib/news";

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

export default function NewsItemPage({ params }: { params: { slug: string } }) {
  const item = newsMock.find((n) => n.slug === params.slug);
  if (!item) return notFound();

  return (
    <article className="max-w-3xl">
      {/* Хлебные крошки */}
      <nav className="text-sm mb-4 text-muted-foreground">
        <Link href="/news" className="hover:underline">Новости</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{item.title}</span>
      </nav>

      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p className="text-sm text-muted-foreground">
        {new Date(item.date).toLocaleString("ru-RU")}
      </p>

      {item.cover && (
        <div className="my-4">
          <Image src={item.cover} alt="" width={1200} height={630} className="w-full rounded-lg object-cover" />
        </div>
      )}

      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.content}
        </ReactMarkdown>
      </div>

      {item.tags?.length ? (
        <div className="mt-6 flex gap-2 flex-wrap">
          {item.tags.map(t => (
            <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="text-xs px-2 py-1 rounded bg-blue-50">
              #{t}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
