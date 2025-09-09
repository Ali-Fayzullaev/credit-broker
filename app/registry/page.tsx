import type { Metadata } from "next";
import { RegistryClient } from "@/components/registry-client";

export const metadata: Metadata = {
  title: "Реестр сертифицированных брокеров — КАКБ",
  description: "Публичный поиск по ФИО, городу и номеру сертификата",
};

export default function RegistryPage() {
  return <RegistryClient />;
}
