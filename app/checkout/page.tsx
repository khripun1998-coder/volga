"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, selectTotal } from "@/lib/cart-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn, formatPrice } from "@/lib/utils";
import { createOrder } from "./actions";

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-sm text-graphite transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

const deliveryMethods = ["СДЭК", "Почта России", "Курьер по городу"];
const paymentMethods = ["Банковская карта", "СБП", "Электронный кошелёк", "При получении"];

function Radio({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition",
        checked ? "border-accent bg-accent-soft" : "border-line hover:border-accent/50"
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-accent"
      />
      <span className="text-graphite">{label}</span>
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const total = useCart(selectTotal);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [receive, setReceive] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0]);
  const [payment, setPayment] = useState(paymentMethods[0]);
  const [comment, setComment] = useState("");
  const [gift, setGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [hidePrice, setHidePrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <div className="container-page min-h-[50vh] py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-page grid min-h-[55vh] place-items-center py-16 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-graphite">
            Корзина пуста
          </h1>
          <p className="mt-2 text-muted">Добавьте товары, чтобы оформить заказ.</p>
          <Link href="/catalog" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          variant: i.variant,
        })),
        name,
        phone,
        receive,
        address,
        deliveryMethod,
        payment,
        comment,
        giftWrap: gift,
        giftMessage,
        hidePrice,
      });
      if (res.ok) {
        clear();
        router.push(`/checkout/success?order=${encodeURIComponent(res.number)}`);
        return; // не снимаем «Оформляем…» — уходим на страницу успеха
      }
      setError(res.error);
    } catch {
      setError("Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз.");
    }
    setSubmitting(false);
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Корзина", href: "/cart" },
          { label: "Оформление" },
        ]}
        className="mb-4"
      />
      <h1 className="font-display text-3xl font-semibold text-graphite md:text-4xl">
        Оформление заказа
      </h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Контакты */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Контакты
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                className={fieldClass}
                placeholder="Имя и фамилия"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className={fieldClass}
                placeholder="Телефон"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </section>

          {/* Получение */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Получение
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Radio
                name="receive"
                checked={receive === "delivery"}
                onChange={() => setReceive("delivery")}
                label="Доставка"
              />
              <Radio
                name="receive"
                checked={receive === "pickup"}
                onChange={() => setReceive("pickup")}
                label="Самовывоз"
              />
            </div>

            {receive === "delivery" ? (
              <div className="mt-4 space-y-3">
                <input
                  className={fieldClass}
                  placeholder="Адрес доставки"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  {deliveryMethods.map((m) => (
                    <Radio
                      key={m}
                      name="delivery-method"
                      checked={deliveryMethod === m}
                      onChange={() => setDeliveryMethod(m)}
                      label={m}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-cream px-4 py-3 text-sm text-muted">
                Самовывоз из мастерской в Краснодарском крае. Адрес и время продавец
                сообщит после подтверждения.
              </p>
            )}
          </section>

          {/* Оплата */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Оплата
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <Radio
                  key={m}
                  name="payment"
                  checked={payment === m}
                  onChange={() => setPayment(m)}
                  label={m}
                />
              ))}
            </div>
          </section>

          {/* Комментарий */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Комментарий к заказу
            </h2>
            <textarea
              className={cn(fieldClass, "mt-3 h-24 resize-none py-3")}
              placeholder="Пожелания к заказу (необязательно)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </section>

          {/* В подарок */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              В подарок
            </h2>
            <label
              className={cn(
                "mt-3 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition",
                gift ? "border-accent bg-accent-soft" : "border-line hover:border-accent/50"
              )}
            >
              <input
                type="checkbox"
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-graphite">Подарочная упаковка и открытка от мастера</span>
            </label>
            {gift && (
              <div className="mt-3 space-y-3">
                <textarea
                  className={cn(fieldClass, "h-20 resize-none py-3")}
                  placeholder="Текст открытки (необязательно)"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  maxLength={300}
                />
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-graphite">
                  <input
                    type="checkbox"
                    checked={hidePrice}
                    onChange={(e) => setHidePrice(e.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  Скрыть цену в чеке для получателя
                </label>
              </div>
            )}
          </section>
        </div>

        {/* Итого */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-line p-6">
            <h2 className="font-medium text-graphite">Ваш заказ</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li
                  key={`${i.productId}-${i.variant ?? ""}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-graphite">
                    {i.title}
                    <span className="text-muted"> × {i.qty}</span>
                  </span>
                  <span className="shrink-0 text-graphite">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-medium text-graphite">К оплате</span>
              <span className="font-display text-2xl font-semibold text-graphite">
                {formatPrice(total)}
              </span>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Оформляем…" : "Подтвердить заказ"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Нажимая кнопку, вы соглашаетесь с условиями площадки.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
