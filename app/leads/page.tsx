import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, Home, Car, Handshake, CheckCircle2, Send, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Купить лиды — КАКБ",
  description: "Заявки на кредитные продукты: ипотека, авто, потребительские, МСБ. Прозрачные источники, фильтры и лимиты.",
  openGraph: {
    title: "Купить лиды — КАКБ",
    description: "Прозрачные источники и фильтры. Лиды для ипотеки, авто, потребкредитов и МСБ.",
    type: "website",
  },
};

// ----- Server Action -----
export async function sendLeadsRequest(formData: FormData) {
  "use server";
  const company = (formData.get("company") || "").toString().trim();
  const contact = (formData.get("contact") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const product = (formData.get("product") || "other").toString();
  const city = (formData.get("city") || "").toString().trim();
  const dailyCap = (formData.get("dailyCap") || "0").toString();
  const budget = (formData.get("budget") || "0").toString();
  const notes = (formData.get("notes") || "").toString().trim();
  const consent = formData.get("consent") === "on";

  // TODO: persist / email to sales
  console.log("LEADS_REQUEST", { company, contact, email, phone, product, city, dailyCap, budget, notes, consent });

  if (!company || !contact || !email || !consent) {
    return redirect("/leads?sent=0");
  }
  return redirect("/leads?sent=1");
}

// ----- Page -----
export default function LeadsPage({ searchParams }: { searchParams?: { sent?: string } }) {
  return (
    <section className="space-y-10">
      {searchParams?.sent === "1" && (
        <div className="rounded-2xl border bg-emerald-50 text-emerald-900 p-4">
          Заявка отправлена. Мы свяжемся с вами для согласования параметров.
        </div>
      )}
      {searchParams?.sent === "0" && (
        <div className="rounded-2xl border bg-amber-50 text-amber-900 p-4">
          Не удалось отправить заявку. Проверьте обязательные поля и согласие на обработку.
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-12 md:px-10 md:py-16 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Лиды для кредитных продуктов</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Прозрачные источники, таргетинг по городам и лимиты. Ипотека, авто, потребительские кредиты и МСБ.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">Проверка качества</Badge>
              <Badge variant="secondary" className="bg-slate-50 text-slate-700 border-0">Без мотивированных заявок</Badge>
              <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 border-0">Фиксация источников</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <Feature icon={<Home className="h-5 w-5"/>} title="Ипотека" desc="Заявки на новостройки и вторичку"/>
            <Feature icon={<Car className="h-5 w-5"/>} title="Авто" desc="Кредиты и рассрочки на авто"/>
            <Feature icon={<CreditCard className="h-5 w-5"/>} title="Потребкредиты" desc="POS и наличные"/>
            <Feature icon={<Handshake className="h-5 w-5"/>} title="МСБ" desc="Оборотные и инвесткредиты"/>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PriceCard title="Ипотека" kzt={3500} note="Валидный контакт, интерес, город" />
        <PriceCard title="Авто" kzt={3000} note="Марка/модель при наличии" />
        <PriceCard title="Потребкредиты" kzt={2200} note="POS/наличные, без карт" />
        <PriceCard title="МСБ" kzt={5000} note="ОКЭД/выручка по возможности" />
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> Как мы работаем</CardTitle>
          <CardDescription>Простой процесс в 3 шага</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <Step n={1} title="Бриф" text="Вы указываете продукт, города, дневной лимит и бюджет."/>
          <Step n={2} title="Запуск" text="Подключаем источники, фильтры и антифрод. Ежедневные отчёты."/>
          <Step n={3} title="Качество" text="Отгружаем только валидные лиды, при браке — замена."/>
        </CardContent>
      </Card>

      {/* Request form */}
      <Card>
        <CardHeader>
          <CardTitle>Заявка на лиды</CardTitle>
          <CardDescription>Укажите параметры — мы подготовим предложение в течение дня</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={sendLeadsRequest} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input id="company" name="company" placeholder="ООО «ФинСервис»" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Контактное лицо</Label>
              <Input id="contact" name="contact" placeholder="Иван Иванов" required />
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
              <Label htmlFor="product">Продукт</Label>
              <select id="product" name="product" defaultValue="mortgage" className="border rounded-md h-10 px-3 text-sm">
                <option value="mortgage">Ипотека</option>
                <option value="auto">Авто</option>
                <option value="consumer">Потребкредит</option>
                <option value="sme">МСБ</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Город(а)</Label>
              <Input id="city" name="city" placeholder="Алматы, Астана" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyCap">Дневной лимит, лидов</Label>
              <Input id="dailyCap" name="dailyCap" type="number" min={0} placeholder="25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Бюджет, ₸/мес</Label>
              <Input id="budget" name="budget" type="number" min={0} placeholder="500000" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes">Дополнительно</Label>
              <Textarea id="notes" name="notes" placeholder="Фильтры, гео, расписание, примеры, KPI…" rows={6} />
            </div>
            <div className="md:col-span-2 flex items-start gap-2 text-sm">
              <input id="consent" name="consent" type="checkbox" className="mt-1" required />
              <Label htmlFor="consent" className="font-normal text-muted-foreground">
                Согласен(а) на обработку персональных данных и получение предложений. Подробнее в {" "}
                <Link className="underline" href="/legal">правилах</Link>.
              </Label>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="mr-2 h-4 w-4"/> Отправить заявку
              </Button>
              <Button type="reset" variant="outline">Сбросить</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur">
        <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Готовы к пилоту?</h2>
            <p className="text-muted-foreground mt-1 max-w-2xl">Начните с 100–300 лидов в неделю — оценим конверсию в продажу и масштабируемся.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="#">Запланировать звонок</Link></Button>
            <Button asChild variant="outline"><Link href="/contacts">Связаться</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- UI bits -----
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">{icon} {title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function PriceCard({ title, kzt, note }: { title: string; kzt: number; note?: string }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Цена за лид</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold">{kzt.toLocaleString("ru-RU")} ₸</CardContent>
      {note && <CardContent className="pt-0 text-sm text-muted-foreground">{note}</CardContent>}
      <CardFooter className="mt-auto">
        <Button asChild variant="ghost" className="gap-1">
          <Link href="#">Подробнее <ArrowRight className="h-4 w-4"/></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-xs text-muted-foreground">Шаг {n}</div>
      <div className="font-medium mt-0.5">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{text}</div>
    </div>
  );
}
