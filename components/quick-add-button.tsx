"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { notify } from "@/lib/toast-store";

export function QuickAddButton({
  product,
}: {
  product: Omit<CartItem, "qty">;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label="Добавить в корзину"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product);
        notify(`«${product.title}» — в корзине`);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="grid h-9 w-9 place-items-center rounded-full bg-paper text-graphite opacity-100 shadow-[var(--shadow-soft)] transition hover:bg-accent hover:text-white md:opacity-0 md:group-hover:opacity-100"
    >
      {added ? <Check className="h-4 w-4" strokeWidth={2} /> : <Plus className="h-4 w-4" strokeWidth={2} />}
    </button>
  );
}
