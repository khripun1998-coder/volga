"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ProductArtwork } from "@/components/product-artwork";
import { useCart, selectTotal } from "@/lib/cart-store";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatPrice, pluralize } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = useCart(selectTotal);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-page min-h-[50vh] py-16" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page grid min-h-[55vh] place-items-center py-16 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream text-muted">
            <ShoppingBag className="h-7 w-7" strokeWidth={1.4} />
          </div>
          <h1 className="font-display mt-6 text-2xl font-semibold text-graphite">
            Корзина пуста
          </h1>
          <p className="mt-2 text-muted">
            Загляните в каталог — там много изделий ручной работы.
          </p>
          <Link href="/catalog" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Корзина" }]}
        className="mb-4"
      />
      <h1 className="font-display text-3xl font-semibold text-graphite md:text-4xl">
        Корзина
      </h1>
      <p className="mt-1.5 text-muted">
        {count} {pluralize(count, ["товар", "товара", "товаров"])}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variant ?? ""}`}
              className="flex gap-4 rounded-xl border border-line p-4"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line"
              >
                <ProductArtwork category={item.category} className="absolute inset-0" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-medium text-graphite transition hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    {item.variant && (
                      <p className="mt-0.5 text-xs text-muted">{item.variant}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted">{item.shopName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId, item.variant)}
                    aria-label="Удалить"
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-graphite"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="inline-flex items-center rounded-lg border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.variant, item.qty - 1)}
                      className="grid h-9 w-9 place-items-center text-graphite transition hover:bg-cream"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.variant, item.qty + 1)}
                      className="grid h-9 w-9 place-items-center text-graphite transition hover:bg-cream"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-graphite">
                      {formatPrice(item.price * item.qty)}
                    </div>
                    {item.qty > 1 && (
                      <div className="text-xs text-muted">{formatPrice(item.price)} / шт.</div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clear}
          className="mt-4 text-sm text-muted transition hover:text-graphite"
        >
          Очистить корзину
        </button>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-line p-6">
            <h2 className="font-medium text-graphite">Итого</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">
                  Товары ({count} {pluralize(count, ["шт", "шт", "шт"])})
                </dt>
                <dd className="text-graphite">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Доставка</dt>
                <dd className="text-graphite">рассчитается при оформлении</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-medium text-graphite">К оплате</span>
              <span className="font-display text-2xl font-semibold text-graphite">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              className={`${buttonVariants({ size: "lg" })} mt-5 w-full`}
            >
              Оформить заказ
            </Link>
            <p className="mt-3 text-center text-xs text-muted">
              Оплата при получении · Перевод · Самовывоз
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
