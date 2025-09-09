import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Контакты — КАКБ",
  description: "Связаться с Казахстанской Ассоциацией Кредитных Брокеров: адрес, email, телефон и форма обратной связи.",
  openGraph: {
    title: "Контакты — КАКБ",
    description: "Адрес, телефон, email и форма обратной связи.",
    type: "website",
  },
};

const CONTACT = {
  address: "Алматы, пр. Абая, 10",
  email: "info@kacb.kz",
  phone: "+7 701 000 00 00",
  hours: "Пн–Пт, 10:00–18:00",
  mapEmbed: "https://maps.google.com/maps?q=Almaty%20Kazakhstan&t=&z=12&ie=UTF8&iwloc=&output=embed",
};

// Server Action — простая обработка формы с редиректом
export async function sendMessage(formData: FormData) {
  "use server";
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const topic = (formData.get("topic") || "other").toString();
  const message = (formData.get("message") || "").toString().trim();
  const consent = formData.get("consent") === "on";

  // TODO: здесь можно отправить письмо / записать в БД
  console.log("CONTACT_FORM", { name, email, phone, topic, message, consent });

  if (!name || !email || !message || !consent) {
    return redirect("/contacts?sent=0");
  }
  return redirect("/contacts?sent=1");
}

export default function ContactsPage({ searchParams }: { searchParams?: { sent?: string } }) {
  return (
    <section className="space-y-10">
      {searchParams?.sent === "1" && (
        <div className="rounded-2xl border bg-emerald-50 text-emerald-900 p-4">
          Сообщение отправлено. Мы свяжемся с вами по указанным контактам.
        </div>
      )}
      {searchParams?.sent === "0" && (
        <div className="rounded-2xl border bg-amber-50 text-amber-900 p-4">
          Не удалось отправить сообщение. Проверьте корректность полей и повторите попытку.
        </div>
      )} 
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Контакты</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Напишите нам по вопросам членства, реестра, партнёрств и организации мероприятий.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ассоциация</CardTitle>
            <CardDescription>Контактные данные</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4"/> {CONTACT.address}</div>
            <div className="flex items-center gap-3"><Mail className="h-4 w-4"/> <a className="hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4"/> <a className="hover:underline" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></div>
            <div className="flex items-center gap-3"><Clock className="h-4 w-4"/> {CONTACT.hours}</div>
            <div className="pt-2 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4"/>
              <span>Сообщения обрабатываются в порядке очереди. Перед отправкой ознакомьтесь с <Link className="underline" href="/legal">правилами</Link>.</span>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Форма обратной связи</CardTitle>
            <CardDescription>Мы ответим на ваш запрос по email или телефону</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={sendMessage} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input id="name" name="name" placeholder="Иван Иванов" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+7 7xx xxx xx xx" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Тема</Label>
                <select id="topic" name="topic" defaultValue="membership" className="border rounded-md h-10 px-3 text-sm">
                  <option value="membership">Членство</option>
                  <option value="registry">Реестр</option>
                  <option value="partnership">Партнёрство</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea id="message" name="message" placeholder="Опишите вопрос" rows={6} minLength={10} required />
              </div>

              <div className="md:col-span-2 flex items-start gap-2 text-sm">
                <input id="consent" name="consent" type="checkbox" className="mt-1" required />
                <Label htmlFor="consent" className="font-normal text-muted-foreground">
                  Я даю согласие на обработку персональных данных и подтверждаю правильность сведений. Подробнее в
                  {" "}
                  <Link className="underline" href="/legal">правилах</Link>.
                </Label>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4"/> Отправить
                </Button>
                <Button type="reset" variant="outline">Сбросить</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Как нас найти</CardTitle>
            <CardDescription>Офис Ассоциации на карте</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border">
              <iframe
                title="KACB Map"
                src={CONTACT.mapEmbed}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ (light, без зависимостей) */}
      <div className="rounded-3xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold">Частые вопросы</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">Как подать заявку на членство?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Заполните форму на странице <Link className="underline" href="/membership">«Членство»</Link>. Мы свяжемся с вами для подтверждения.</p>
          </details>
          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">Как попасть в реестр сертифицированных брокеров?</summary>
            <p className="mt-2 text-sm text-muted-foreground">После аттестации сертификат попадает в публичный реестр автоматически.</p>
          </details>
        </div>
      </div>
    </section>
  );
}


