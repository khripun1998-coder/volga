import Link from "next/link";
import { MapPin, Package, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  getBuyerContext,
  getFirstThreadKey,
  orderStatusLabel,
  escrowLabel,
} from "@/lib/demo";
import { DashShell, DashSection, StatusPill, Card } from "@/components/dashboard";
import { OrderStatusBar } from "@/components/order-status-bar";
import { ChatPanel } from "@/components/chat-panel";
import { AccountFavorites } from "@/components/account-favorites";
import { Stars } from "@/components/rating";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Кабинет покупателя — Волга" };

const df = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

const statusTone = (s: string) =>
  s === "COMPLETED" ? "green" : s === "DELIVERED" ? "green" : "blue";
const escrowTone = (s: string) =>
  s === "RELEASED" ? "green" : s === "REFUNDED" ? "blue" : "amber";

const nav = [
  { label: "Заказы", href: "#orders" },
  { label: "Избранное", href: "#favorites" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Сообщения", href: "#messages" },
  { label: "Профиль", href: "#profile" },
];

export default async function AccountPage() {
  const ctx = await getBuyerContext();
  const [reviews, threadKey] = await Promise.all([
    prisma.review.findMany({ take: 3, include: { product: true }, orderBy: { createdAt: "desc" } }),
    getFirstThreadKey(),
  ]);

  const orders = ctx?.orders ?? [];

  return (
    <DashShell title="Кабинет покупателя" role="Покупатель · Анна Воронова" nav={nav}>
      <DashSection id="orders" title={`Заказы (${orders.length})`}>
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-graphite">Заказ {o.number}</span>
                  <span className="ml-3 text-sm text-muted">{df.format(o.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone={statusTone(o.status)}>{orderStatusLabel(o.status)}</StatusPill>
                  <StatusPill tone={escrowTone(o.escrowStatus)}>{escrowLabel(o.escrowStatus)}</StatusPill>
                  {o.disputes.length > 0 && <StatusPill tone="red">Спор</StatusPill>}
                </div>
              </div>

              <p className="mt-1 text-sm text-muted">{o.shop?.name}</p>

              <div className="mt-4">
                <OrderStatusBar status={o.status} />
                <div className="mt-1.5 flex justify-between text-[11px] text-muted">
                  <span>Принят</span>
                  <span>Завершён</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-3">
                    <span className="text-graphite">
                      {it.title}
                      {it.variant && <span className="text-muted"> · {it.variant}</span>}
                      <span className="text-muted"> × {it.qty}</span>
                    </span>
                    <span className="text-muted">{formatPrice(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-4 w-4" strokeWidth={1.6} /> {o.deliveryMethod}
                  </span>
                  {o.trackingNumber && (
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="h-4 w-4" strokeWidth={1.6} /> Трек: {o.trackingNumber}
                    </span>
                  )}
                  <span>{o.paymentMethod}</span>
                </div>
                <span className="font-semibold text-graphite">{formatPrice(o.total)}</span>
              </div>
            </Card>
          ))}
        </div>
      </DashSection>

      <DashSection id="favorites" title="Избранное">
        <AccountFavorites />
      </DashSection>

      <DashSection id="reviews" title="Мои отзывы">
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between">
                <Link href={`/product/${r.product.slug}`} className="font-medium text-graphite hover:text-accent">
                  {r.product.title}
                </Link>
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-graphite/90">{r.text}</p>
            </Card>
          ))}
        </div>
      </DashSection>

      <DashSection id="messages" title="Сообщения с продавцом">
        <ChatPanel threadKey={threadKey} as="buyer" />
      </DashSection>

      <DashSection id="profile" title="Профиль">
        <Card className="max-w-md p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Имя</dt><dd className="text-graphite">Анна Воронова</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Email</dt><dd className="text-graphite">buyer@volga.market</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Телефон</dt><dd className="text-graphite">+7 918 000-00-00</dd></div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted">Адрес</dt>
              <dd className="inline-flex items-center gap-1.5 text-right text-graphite">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.6} /> г. Краснодар, ул. Красная, 1
              </dd>
            </div>
          </dl>
        </Card>
      </DashSection>
    </DashShell>
  );
}
