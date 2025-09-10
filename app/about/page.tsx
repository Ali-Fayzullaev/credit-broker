import type { Metadata } from "next";
import Link from "next/link";
import { brokersMock } from "@/lib/brokers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, ShieldCheck, Handshake, BookOpen, Scale, Users2, Award, ArrowRight, CalendarDays, Building2 } from "lucide-react";
import { timeline, values } from "@/lib/about";

export const metadata: Metadata = {
  title: "О нас — КАКБ",
  description: "Казахстанская Ассоциация Кредитных Брокеров: миссия, цели, стандарты и партнёрства.",
  openGraph: {
    title: "О нас — КАКБ",
    description: "Миссия, цели и стандарты Ассоциации кредитных брокеров Казахстана.",
    type: "website",
  },
};

// helpers
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return iso;
  }
}

const totalBrokers = brokersMock.length;
const activeBrokers = brokersMock.filter(b => b.status === "ACTIVE").length;

const features = [
  {
    icon: <Target className="h-5 w-5"/>,
    title: "Развитие рынка",
    desc: "Формируем прозрачные правила и улучшаем качество сервиса для заёмщиков и партнёров.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5"/>,
    title: "Стандарты и сертификация",
    desc: "Единые профессиональные стандарты и публичный реестр сертифицированных брокеров.",
  },
  {
    icon: <Handshake className="h-5 w-5"/>,
    title: "Партнёрства",
    desc: "Сотрудничество с банками, МФО, финтехом, страховыми и образовательными организациями.",
  },
  {
    icon: <BookOpen className="h-5 w-5"/>,
    title: "Обучение",
    desc: "Повышение квалификации, обмен практиками и доступ к методическим материалам.",
  },
];



export default function AboutPage() {
  return (
    <section className="space-y-10 ">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-12 md:px-10 md:py-16 grid gap-6 md:grid-cols-2 md:items-end">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">О Казахстанской Ассоциации Кредитных Брокеров</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Мы объединяем профессиональных кредитных брокеров для развития отрасли, защиты клиентов и построения партнёрств с финансовыми организациями.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">{activeBrokers}+ сертификатов действует</Badge>
              <Badge variant="secondary" className="bg-slate-50 text-slate-700 border-0">{totalBrokers} в реестре</Badge>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="/membership">Стать членом</Link></Button>
              <Button asChild variant="outline"><Link href="/registry">Открыть реестр</Link></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {features.map((f) => (
              <Card key={f.title} className="h-full">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">{f.icon}{f.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5"/> Миссия</CardTitle>
            <CardDescription>Зачем существует Ассоциация</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>Создавать прозрачный и эффективный рынок кредитного брокеринга в Казахстане: повышать качество консультаций, продвигать стандарты, расширять доступ к финансовым продуктам и защищать интересы клиентов.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Выработка отраслевых стандартов и этического кодекса.</li>
              <li>Сертификация брокеров и прозрачный публичный реестр.</li>
              <li>Обучение и повышение квалификации участников.</li>
              <li>Взаимодействие с банками, МФО, регуляторами и СМИ.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5"/> Ценности</CardTitle>
            <CardDescription>То, что нас определяет</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {values.map((v) => (
              <div key={v.label}>
                <div className="font-medium">{v.label}</div>
                <div className="text-muted-foreground">{v.desc}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Профессиональные стандарты</CardTitle>
          <CardDescription>Базовые принципы работы кредитного брокера</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border p-4">
            <div className="font-medium flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Этика и прозрачность</div>
            <p className="mt-1 text-muted-foreground">Корректное раскрытие условий, отсутствие скрытых комиссий, соблюдение конфиденциальности.</p>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium flex items-center gap-2"><Users2 className="h-4 w-4"/> Клиентоориентированность</div>
            <p className="mt-1 text-muted-foreground">Подбор продуктов под цели и профиль риска клиента, недопустимость навязывания услуг.</p>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium flex items-center gap-2"><Award className="h-4 w-4"/> Квалификация</div>
            <p className="mt-1 text-muted-foreground">Регулярное обучение и подтверждение компетенций участников рынка.</p>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium flex items-center gap-2"><Building2 className="h-4 w-4"/> Взаимодействие с партнёрами</div>
            <p className="mt-1 text-muted-foreground">Единые процедуры коммуникации с банками и МФО, стандарты сервисного уровня.</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5"/> Хронология</CardTitle>
          <CardDescription>Ключевые этапы развития</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative border-s pl-6 space-y-6">
            {timeline.map((t) => (
              <li key={t.title} className="ms-4">
                <span className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border bg-background"/>
                <div className="text-xs text-muted-foreground">{formatDate(t.date)}</div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.text}</div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Documents & CTA */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Документы</CardTitle>
            <CardDescription>Правила и регламент</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><Link className="hover:underline" href="/legal">Правила и юридическая база</Link></li>
              <li><Link className="hover:underline" href="/registry">Публичный реестр сертификатов</Link></li>
              <li><Link className="hover:underline" href="/membership">Положение о членстве</Link></li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Присоединиться</CardTitle>
            <CardDescription>Станьте частью профессионального сообщества</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href="/membership">Подать заявку</Link></Button>
            <Button asChild variant="outline"><Link href="/contacts">Связаться с нами</Link></Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
        Есть предложения по стандартам или хотите вступить в рабочую группу? Напишите нам — мы открыты к диалогу.
        <Separator className="my-3"/>
        <Button asChild variant="ghost" className="gap-1"><Link href="/contacts">Написать <ArrowRight className="h-4 w-4"/></Link></Button>
      </div>
    </section>
  );
}
