"use client";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Broker } from "@/lib/brokers";
import { StatusBadge } from "@/components/status-badge";

export const brokerColumns: ColumnDef<Broker>[] = [
  {
    accessorKey: "fullName",
    header: "ФИО",
    cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
  },
  { accessorKey: "city", header: "Город" },
  { accessorKey: "organization", header: "Организация",
    cell: ({ getValue }) => getValue<string>() || "—",
  },
  { accessorKey: "certificateNo", header: "№ сертификата" },
  {
    id: "dates",
    header: "Выдан / Истекает",
    sortingFn: (a, b) => {
      const ax = new Date(a.original.expiresAt).getTime();
      const bx = new Date(b.original.expiresAt).getTime();
      return ax - bx;
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>выдан: {new Date(row.original.issuedAt).toLocaleDateString("ru-RU")}</span>
        <span>истекает: {new Date(row.original.expiresAt).toLocaleDateString("ru-RU")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ getValue }) => <StatusBadge status={getValue<any>()} />,
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.original.status);
    },
  },
  {
    id: "cert",
    header: "Сертификат",
    cell: ({ row }) =>
      row.original.certificateUrl ? (
        <Link className="text-blue-700 underline" href={row.original.certificateUrl} target="_blank">
          PDF
        </Link>
      ) : "—",
    enableSorting: false,
  },
  {
    id: "contacts",
    header: "Контакты",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.email ?? "—"}</span>
        <span>{row.original.phone ?? "—"}</span>
      </div>
    ),
    enableSorting: false,
  },
];
