"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ вместо useToast
import { PhoneInput } from "@/components/ui/phone-input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Clock, Upload } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  fullName: z.string().min(3, "Укажите ФИО"),
  orgType: z.enum(["ip", "too", "ao", "other"]),
  orgName: z.string().min(2, "Укажите организацию"),
  email: z.string().email("Невалидный email"),
  phone: z.string().min(10, "Укажите телефон"),
  city: z.string().min(2, "Укажите город"),
  message: z.string().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Нужно согласие" }),
  file: z
    .any()
    .refine((f) => !f || (f instanceof FileList && f.length <= 1), "Загрузите один файл")
    .refine((f) => !f || ((f as FileList)[0]?.size ?? 0) <= 5 * 1024 * 1024, "Размер файла до 5 МБ")
    .optional(),
});

// Типы
type FormValues = z.infer<typeof formSchema>;

export default function MembershipPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      orgType: "ip",
      orgName: "",
      email: "",
      phone: "",
      city: "",
      message: "",
      agree: false,
      file: undefined, // важно для file input
    },
  });

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (k === "file" && v && (v as FileList)[0]) {
        fd.append("file", (v as FileList)[0]);
      } else {
        fd.append(k, String(v ?? ""));
      }
    });

    try {
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Заявка отправлена");
      form.reset({
        fullName: "",
        orgType: "ip",
        orgName: "",
        email: "",
        phone: "",
        city: "",
        message: "",
        agree: false,
        file: undefined,
      });
      router.push("/membership?submitted=1");
    } catch {
      toast.error("Не удалось отправить заявку");
    }
  };

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_0%,#000_30%,transparent_70%)] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Вступить в Ассоциацию</h1>
            <p className="mt-3 text-muted-foreground">Заполните форму — это займёт 2–3 минуты. После отправки вы получите подтверждение на email.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0"><ShieldCheck className="mr-1 h-3.5 w-3.5"/> Проверка заявки</Badge>
              <Badge variant="secondary" className="bg-slate-50 text-slate-700 border-0"><Clock className="mr-1 h-3.5 w-3.5"/> Ответ в течение дня</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: форма + инфо */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Заявка на членство</CardTitle>
            <CardDescription>Укажите контактные данные и информацию об организации</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {/* ФИО */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ФИО</FormLabel>
                      <FormControl>
                        <Input placeholder="Иванов Иван Иванович" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Организация */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="orgType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип организации</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ip">ИП</SelectItem>
                            <SelectItem value="too">ТОО</SelectItem>
                            <SelectItem value="ao">АО</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название организации</FormLabel>
                        <FormControl>
                          <Input placeholder='Напр. "ТОО КредитПро"' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Контакты */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <PhoneInput {...field} placeholder="+7 7__ ___ __ __" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Город */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Город</FormLabel>
                      <FormControl>
                        <Input placeholder="Алматы" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Сообщение */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Комментарий (необязательно)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Коротко о себе и опыте" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Файл */}
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Приложение (PDF/JPG, до 5 МБ) — при необходимости</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm hover:file:bg-accent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Согласие */}
                <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="!m-0 text-sm">Я согласен(а) с обработкой персональных данных</FormLabel>
                          <p className="text-xs text-muted-foreground">Данные используются только для связи и верификации. Подробнее см. в разделе <Link href="/legal" className="underline">Документы</Link>.</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => form.reset({ orgType: "ip", agree: false })} className="w-full sm:w-auto">
                    Сбросить
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Боковой инфо-блок */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> Почему это важно</CardTitle>
            <CardDescription>Преимущества членства</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/> Доступ к реестру и стандартам, участие в рабочей группе</div>
            <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/> Обучающие материалы и практики, обмен опытом</div>
            <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/> Публичный профиль и подтверждённый статус</div>
            <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/> Информация о партнёрах и программах</div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost"><Link href="/registry">Посмотреть реестр</Link></Button>
          </CardFooter>
        </Card>
      </div>

      {/* Мобильный CTA снизу для длинных форм */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="rounded-2xl border bg-white/95 shadow-lg backdrop-blur p-3 flex gap-2">
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {form.formState.isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset({ orgType: "ip", agree: false })} className="flex-1">Сбросить</Button>
        </div>
      </div>
    </section>
  );
}
