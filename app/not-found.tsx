import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">Страница не найдена</h1>
      <p className="mb-6 text-muted-foreground">Похоже, здесь пусто.</p>
      <Link className="underline text-blue-700" href="/">На главную</Link>
    </div>
  );
}
