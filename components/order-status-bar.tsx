import { ORDER_STATUSES, orderStatusIndex } from "@/lib/demo";

export function OrderStatusBar({ status }: { status: string }) {
  const active = orderStatusIndex(status);
  return (
    <div className="flex items-center gap-1">
      {ORDER_STATUSES.map((s, i) => (
        <div
          key={s.code}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= active ? "bg-accent" : "bg-line"
          }`}
          title={s.label}
        />
      ))}
    </div>
  );
}
