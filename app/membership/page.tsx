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

const formSchema = z.object({
  fullName: z.string().min(3, "Укажите ФИО"),
  orgType: z.enum(["ip", "too", "ao", "other"]),
  orgName: z.string().min(2, "Укажите организацию"),
  email: z.string().email("Невалидный email"),
  phone: z.string().min(10, "Укажите телефон"),
  city: z.string().min(2, "Укажите город"),
  message: z.string().optional(),
  agree: z.boolean().refine(v => v === true, { message: "Нужно согласие" }),
  file: z.any()
    .refine((f) => !f || (f instanceof FileList && f.length <= 1), "Загрузите один файл")
    .refine((f) => !f || (f[0]?.size ?? 0) <= 5 * 1024 * 1024, "Размер файла до 5 МБ")
    .optional(),
});


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
    // Сформируем FormData (на будущее — отправка на API)
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
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Вступить в Ассоциацию</h1>
        <p className="text-muted-foreground">
          Заполните форму — это займёт 2–3 минуты.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="orgType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип организации</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
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

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Комментарий (необязательно)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Коротко о себе и опыте"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Приложение (PDF/JPG, до 5 МБ) — при необходимости
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!m-0 text-sm">
                  Я согласен(а) с обработкой персональных данных
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset({ orgType: "ip", agree: false })}
            >
              Сбросить
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
