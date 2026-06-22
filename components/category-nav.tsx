import Link from "next/link";
import {
  Coffee,
  Flame,
  Gem,
  House,
  Rabbit,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  toys: Rabbit,
  ceramics: Coffee,
  jewelry: Gem,
  textile: Scissors,
  decor: House,
  candles: Flame,
};

export function CategoryNav({
  categories,
  active,
  params,
}: {
  categories: { id: string; slug: string; name: string }[];
  active?: string;
  /** Текущие фильтры (q, tag, city, min, max, inStock, sort), чтобы клик по категории их сохранял. */
  params?: Record<string, string | undefined>;
}) {
  const chip = (isActive: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
      isActive
        ? "border-accent bg-accent-soft text-accent"
        : "border-line bg-paper text-graphite hover:border-accent/50 hover:text-accent"
    );

  // Ссылка категории сохраняет все прочие активные фильтры.
  const hrefFor = (slug?: string) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params ?? {})) {
      if (v && k !== "category") sp.set(k, v);
    }
    if (slug) sp.set("category", slug);
    const qs = sp.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href={hrefFor()} className={chip(!active)}>
        <Sparkles className="h-4 w-4" strokeWidth={1.6} />
        Все товары
      </Link>
      {categories.map((c) => {
        const Icon = icons[c.slug] ?? Sparkles;
        return (
          <Link key={c.id} href={hrefFor(c.slug)} className={chip(active === c.slug)}>
            <Icon className="h-4 w-4" strokeWidth={1.6} />
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
