import { Suspense } from "react";
import { RegistryClient } from "@/components/registry-client";

// страница динамическая (не SSG), т.к. зависит от search params
export const dynamic = "force-dynamic";

export default function RegistryPage() {
  return (
    <Suspense
      fallback={
        <section className="space-y-4">
          <div className="h-8 w-64 rounded bg-gray-100 animate-pulse" />   
          <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-64 w-full rounded bg-gray-100 animate-pulse" />
        </section>
      }
    >
      <RegistryClient />
    </Suspense>
  );
}
