import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="h-4 w-4 fill-graphite text-graphite" strokeWidth={0} />
      <span className="font-medium text-graphite">{value.toFixed(1)}</span>
      {count != null && <span className="text-muted">· {count} отз.</span>}
    </span>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i <= Math.round(value)
              ? "fill-graphite text-graphite"
              : "fill-line text-line"
          )}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}
