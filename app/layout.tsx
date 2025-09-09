// app/[locale]/layout.tsx
import {NextIntlClientProvider} from 'next-intl';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {Toaster} from 'sonner';
import ru from '@/messages/ru.json';
import kk from '@/messages/kk.json';
import en from '@/messages/en.json';

const DICT: Record<string, any> = {ru, kk, en};

export function generateStaticParams() {
  return [{locale: 'ru'}, {locale: 'kk'}, {locale: 'en'}];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: 'ru'|'kk'|'en'}>;
}) {
  const {locale} = await params;
  const messages = DICT[locale] ?? DICT['ru'];
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">{children}</main>
      <SiteFooter />
      <Toaster richColors position="top-right" />
    </NextIntlClientProvider>
  );
}
