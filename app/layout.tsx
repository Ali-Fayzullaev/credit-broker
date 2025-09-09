import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-6xl px-4 py-8">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
