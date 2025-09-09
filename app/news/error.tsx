"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Не удалось загрузить новости</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}
