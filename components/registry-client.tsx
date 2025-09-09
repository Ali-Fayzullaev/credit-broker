"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Papa from "papaparse";
import { brokersMock, Broker } from "@/lib/brokers";
import { brokerColumns } from "@/components/registry/columns";
import { DataTable } from "@/components/registry/table";

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function RegistryClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // 1) начальные значения из URL
  const initialQuery = params.get("query") ?? "";
  const initialStatus = params.get("status") ?? "";

  const [rows, setRows] = React.useState<Broker[]>(brokersMock);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus);

  // 2) дебаунс для query (чтоб не спамить URL)
  const q = useDebounced(query);

  // 3) записываем текущие фильтры в URL (replace, без перезагрузки)
  React.useEffect(() => {
    const sp = new URLSearchParams(Array.from(params.entries())); // сохраняем прочие параметры
    // query
    if (q) sp.set("query", q);
    else sp.delete("query");
    // status
    if (statusFilter) sp.set("status", statusFilter);
    else sp.delete("status");

    const search = sp.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, statusFilter]); // завязка только на наши фильтры

  // 4) когда URL меняется извне (напр. по истории/ссылке), подхватываем значения
  React.useEffect(() => {
    const uQuery = params.get("query") ?? "";
    const uStatus = params.get("status") ?? "";
    if (uQuery !== query) setQuery(uQuery);
    if (uStatus !== statusFilter) setStatusFilter(uStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]); // слушаем параметры URL

  const data = React.useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((b) => {
      const hit =
        !ql ||
        b.fullName.toLowerCase().includes(ql) ||
        b.city.toLowerCase().includes(ql) ||
        b.certificateNo.toLowerCase().includes(ql);
      const ok = !statusFilter || b.status === statusFilter;
      return hit && ok;
    });
  }, [rows, q, statusFilter]);

  const exportCsv = () => {
    const csv = Papa.unparse(
      data.map(({ id, ...rest }) => rest),
      { delimiter: ";" }
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const suffix =
      (statusFilter ? `_${statusFilter.toLowerCase()}` : "") +
      (q ? `_q_${q.replace(/\s+/g, "-")}` : "");
    a.href = url;
    a.download = `brokers${suffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("");
    router.replace(pathname); // чистый URL без параметров
  };

  return (
    <section className="space-y-6">
      <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Реестр сертифицированных брокеров</h1>
          <p className="text-sm text-muted-foreground">Публичный поиск и фильтрация</p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded" onClick={exportCsv}>Экспорт CSV</button>
          <label className="px-3 py-2 border rounded cursor-pointer">
            Импорт CSV
            <input type="file" accept=".csv" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              Papa.parse<Partial<Broker>>(file, {
                header: true, delimiter: ";", skipEmptyLines: true,
                complete: (res) => {
                  const cleaned: Broker[] = res.data
                    .map((r, i) => ({
                      id: `imp-${Date.now()}-${i}`,
                      fullName: (r.fullName ?? "").toString().trim(),
                      city: (r.city ?? "").toString().trim(),
                      certificateNo: (r.certificateNo ?? "").toString().trim(),
                      issuedAt: r.issuedAt ? new Date(r.issuedAt).toISOString() : new Date().toISOString(),
                      expiresAt: r.expiresAt ? new Date(r.expiresAt).toISOString() : new Date().toISOString(),
                      organization: r.organization?.toString().trim() || undefined,
                      email: r.email?.toString().trim() || undefined,
                      phone: r.phone?.toString().trim() || undefined,
                      status: (r.status as Broker["status"]) || "ACTIVE",
                      certificateUrl: r.certificateUrl?.toString().trim() || undefined,
                    }))
                    .filter((b) => b.fullName && b.certificateNo);
                  if (cleaned.length) setRows((prev) => [...cleaned, ...prev]);
                  e.target.value = "";
                },
                error: () => alert("Не удалось импортировать CSV"),
              });
            }} className="hidden" />
          </label>
          <button className="px-3 py-2 border rounded" onClick={resetFilters}>Сбросить</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: ФИО, город, № сертификата…"
          className="w-full md:w-96 border rounded-md px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Все статусы</option>
          <option value="ACTIVE">Действует</option>
          <option value="EXPIRING_SOON">Скоро истекает</option>
          <option value="EXPIRED">Истёк</option>
        </select>
      </div>

      <DataTable columns={brokerColumns} data={data} />
      <p className="text-xs text-muted-foreground">
        Легенда статусов: «Действует» — зелёный, «Скоро истекает» — жёлтый, «Истёк» — красный.
      </p>
    </section>
  );
}
