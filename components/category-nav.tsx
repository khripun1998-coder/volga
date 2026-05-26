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
}: {
  categories: { id: string; slug: string; name: string }[];
  active?: string;
}) {
  const chip = (isActive: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
      isActive
        ? "border-accent bg-accent-soft text-accent"
        : "border-line bg-paper text-graphite hover:border-accent/50 hover:text-accent"
    );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href="/catalog" className={chip(!active)}>
        <Sparkles className="h-4 w-4" strokeWidth={1.6} />
        Все товары
      </Link>
      {categories.map((c) => {
        const Icon = icons[c.slug] ?? Sparkles;
        return (
          <Link key={c.id} href={`/catalog?category=${c.slug}`} className={chip(active === c.slug)}>
            <Icon className="h-4 w-4" strokeWidth={1.6} />
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
