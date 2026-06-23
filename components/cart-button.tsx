"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, selectCount } from "@/lib/cart-store";

/** Корзина в глобальном хроме со счётчиком (восстановление воронки). */
export function CartButton() {
  const count = useCart(selectCount);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      aria-label={mounted && count > 0 ? `Корзина: ${count}` : "Корзина"}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-graphite hairline transition hover:bg-cream"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.7} />
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
