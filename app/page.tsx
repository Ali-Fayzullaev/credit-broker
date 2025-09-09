// app/[locale]/page.tsx
"use client";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold">{t("home.title")}</h1>
    </main>
  );
}
