import { cn } from "@/lib/utils";

/**
 * Универсальная заглушка карточки 1:1 со скрином клиента:
 * белый квадрат с тонкой обводкой и круг по центру.
 * Никаких реальных фото.
 */
export function TilePlaceholder({
  className,
  size = "lg",
  seed = 0,
  label,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  seed?: number;
  label?: string;
}) {
  const inner =
    size === "sm" ? "h-8 w-8" : size === "md" ? "h-14 w-14" : "h-24 w-24";

  // Чуть-чуть «дышащий» оттенок круга, но в пределах серого — никакого цвета
  const tones = ["bg-[#ECECEC]", "bg-[#E4E4E4]", "bg-[#F0F0F0]", "bg-[#E8E8E8]"];
  const tone = tones[seed % tones.length];

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden bg-paper hairline rounded-[20px]",
        className
      )}
      aria-hidden
    >
      {/* мягкая «бумажная» подложка */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#fafafa] to-white" />

      <div className={cn("relative rounded-full", inner, tone)} />

      {label && (
        <span className="absolute bottom-3 left-3 right-3 truncate text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
      )}
    </div>
  );
}
