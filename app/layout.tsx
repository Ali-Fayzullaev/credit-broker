import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-1 w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 2xl:px-16 py-8">
          {children}
        </main>
        <SiteFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
