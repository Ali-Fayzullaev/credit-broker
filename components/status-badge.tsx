type Props = { status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" };

export function StatusBadge({ status }: Props) {
  const map = {
    ACTIVE: "bg-green-100 text-green-800",
    EXPIRING_SOON: "bg-yellow-100 text-yellow-800",
    EXPIRED: "bg-red-100 text-red-800",
  } as const;

  const label = {
    ACTIVE: "Действует",
    EXPIRING_SOON: "Скоро истекает",
    EXPIRED: "Истёк",
  }[status];

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${map[status]}`}>{label}</span>
  );
}
