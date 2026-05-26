import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Заказ оформлен — Волга" };

const steps = [
  { code: "ACCEPTED", label: "Принят" },
  { code: "PROCESSING", label: "В обработке" },
  { code: "SHIPPED", label: "Отправлен" },
  { code: "DELIVERED", label: "Доставлен" },
  { code: "COMPLETED", label: "Завершён" },
];

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;
  const order = number ? await getOrderByNumber(number) : null;

  if (!order) {
    return (
      <div className="container-page grid min-h-[55vh] place-items-center py-16 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-graphite">
            Заказ не найден
          </h1>
          <p className="mt-2 text-muted">Возможно, ссылка устарела.</p>
          <Link href="/catalog" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.code === order.status)
  );

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.6} />
        </div>
        <h1 className="font-display mt-6 text-3xl font-semibold text-graphite">
          Заказ оформлен
        </h1>
        <p className="mt-2 text-muted">
          Номер заказа <span className="font-medium text-graphite">{order.number}</span>.
          Мы передали его продавцу — он свяжется с вами для подтверждения.
        </p>
      </div>

      {/* Статусы */}
      <div className="mt-10 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.code} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : i <= activeIndex ? "bg-accent" : "bg-line"}`}
              />
              <div
                className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                  i <= activeIndex ? "bg-accent" : "bg-line"
                }`}
              />
              <div
                className={`h-0.5 flex-1 ${i === steps.length - 1 ? "bg-transparent" : i < activeIndex ? "bg-accent" : "bg-line"}`}
              />
            </div>
            <span
              className={`mt-2 text-xs ${i <= activeIndex ? "font-medium text-graphite" : "text-muted"}`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Состав заказа */}
      <div className="mt-10 rounded-xl border border-line p-6">
        <h2 className="font-medium text-graphite">Состав заказа</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div>
                <span className="text-graphite">{it.title}</span>
                {it.variant && <span className="text-muted"> · {it.variant}</span>}
                <span className="text-muted"> × {it.qty}</span>
              </div>
              <span className="shrink-0 text-graphite">{formatPrice(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-medium text-graphite">Итого</span>
          <span className="font-display text-2xl font-semibold text-graphite">
            {formatPrice(order.total)}
          </span>
        </div>

        <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Получение</dt>
            <dd className="text-right text-graphite">
              {order.deliveryMethod}
              {order.address ? ` · ${order.address}` : ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Оплата</dt>
            <dd className="text-graphite">{order.paymentMethod}</dd>
          </div>
          {order.comment && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Комментарий</dt>
              <dd className="text-right text-graphite">{order.comment}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8 text-center">
        <Link href="/catalog" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Продолжить покупки
        </Link>
      </div>
    </div>
  );
}
