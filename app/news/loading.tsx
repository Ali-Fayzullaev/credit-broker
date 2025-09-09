export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <div className="h-48 bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-1/3 bg-gray-100 animate-pulse" />
            <div className="h-6 w-2/3 bg-gray-100 animate-pulse" />
            <div className="h-4 w-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
