"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Minus, MessageCircle, Plus, ShoppingBag } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { notify } from "@/lib/toast-store";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  product: Omit<CartItem, "qty" | "variant">;
  stock: number;
  shopSlug: string;
  variantGroups: { kind: string; values: string[] }[];
}

export function ProductPurchase({ product, stock, shopSlug, variantGroups }: Props) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(variantGroups.map((g) => [g.kind, g.values[0]]))
  );
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () =>
      variantGroups.map((g) => `${g.kind}: ${selected[g.kind]}`).join(", ") || undefined,
    [variantGroups, selected]
  );

  const out = stock <= 0;

  const doAdd = () => {
    add({ ...product, variant }, qty);
    notify(`«${product.title}» — в корзине`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };
  const doBuy = () => {
    add({ ...product, variant }, qty);
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {variantGroups.map((g) => (
        <div key={g.kind}>
          <div className="mb-2 text-sm font-medium text-graphite">
            {g.kind}: <span className="text-muted">{selected[g.kind]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {g.values.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelected((s) => ({ ...s, [g.kind]: v }))}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm transition",
                  selected[g.kind] === v
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-graphite hover:border-accent/50"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!out && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-line">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 place-items-center text-graphite transition hover:bg-cream"
              aria-label="Уменьшить"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              className="grid h-11 w-11 place-items-center text-graphite transition hover:bg-cream"
              aria-label="Увеличить"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-muted">В наличии: {stock} шт.</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" disabled={out} onClick={doBuy}>
          Купить
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={out}
          onClick={doAdd}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" /> Добавлено
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" /> В корзину
            </>
          )}
        </Button>
      </div>

      {out && (
        <p className="rounded-lg bg-cream px-4 py-3 text-sm text-muted">
          Сейчас нет в наличии. Напишите мастеру — возможно изготовление под заказ.
        </p>
      )}

      <div className="flex items-center gap-5 pt-1">
        <Link
          href={`/shop/${shopSlug}`}
          className="inline-flex items-center gap-2 text-sm text-graphite transition hover:text-accent"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.6} /> Спросить продавца
        </Link>
        <FavoriteButton variant="inline" item={{ ...product }} />
      </div>
    </div>
  );
}
