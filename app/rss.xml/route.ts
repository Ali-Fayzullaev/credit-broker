import { NextResponse } from "next/server";
import { newsMock } from "@/lib/news";

export async function GET() {
  const site = "https://example.kz"; // замени на домен
  const items = [...newsMock].sort((a,b)=>+new Date(b.date)-+new Date(a.date)).map(n => `
    <item>
      <title><![CDATA[${n.title}]]></title>
      <link>${site}/news/${n.slug}</link>
      <guid>${site}/news/${n.slug}</guid>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
      <description><![CDATA[${n.excerpt}]]></description>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>КАКБ — Новости</title>
      <link>${site}/news</link>
      <description>Лента новостей Ассоциации</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
