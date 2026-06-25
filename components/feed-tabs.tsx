import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Переключатель «Товары / Магазины» (Aurora). По умолчанию открыты Магазины
 * («в центре внимания — сами магазины»): "/" = магазины, "/?view=products" = товары.
 */
export function FeedTabs({ active }: { active: "products" | "shops" }) {
  const shopsHref = "/";
  const productsHref = "/?view=products";

  return (
    <div
      role="tablist"
      aria-label="Что показывать в ленте"
      className="inline-flex items-center gap-0.5 rounded-full bg-cream p-1"
    >
      <Tab href={productsHref} active={active === "products"}>
        Товары
      </Tab>
      <Tab href={shopsHref} active={active === "shops"}>
        Магазины
      </Tab>
    </div>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      role="tab"
      aria-selected={active}
      href={href}
      className={cn(
        "inline-flex h-9 items-center rounded-full px-5 text-[13px] font-semibold transition-colors duration-300",
        active
          ? "bg-accent text-white shadow-[var(--shadow-accent)]"
          : "text-graphite/70 hover:text-graphite"
      )}
    >
      {children}
    </Link>
  );
}
