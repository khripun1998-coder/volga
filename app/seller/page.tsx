import { BadgeCheck, MapPin, Plus } from "lucide-react";
import {
  getSellerContext,
  getFirstThreadKey,
  ORDER_STATUSES,
  orderStatusLabel,
  productStatusLabel,
  escrowLabel,
} from "@/lib/demo";
import { getCategories } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { DashShell, DashSection, Stat, StatusPill, Card } from "@/components/dashboard";
import { ProductArtwork } from "@/components/product-artwork";
import { ChatPanel } from "@/components/chat-panel";
import { formatPrice } from "@/lib/utils";
import { addProduct, setOrderStatus } from "./actions";

export const metadata = { title: "Кабинет продавца — Волга" };

const df = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const prodTone = (s: string) =>
  s === "ACTIVE" ? "green" : s === "PENDING" ? "amber" : s === "REJECTED" ? "red" : "default";

const nav = [
  { label: "Обзор", href: "#overview" },
  { label: "Товары", href: "#products" },
  { label: "Заказы", href: "#orders" },
  { label: "Сотрудники", href: "#employees" },
  { label: "Доставка и оплата", href: "#delivery" },
  { label: "Магазин", href: "#shop" },
  { label: "Сообщения", href: "#messages" },
];

const field =
  "h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

export default async function SellerPage() {
  const session = await getSession();
  const ownerId = session?.role === "SELLER" ? session.id : undefined;
  const [shop, categories, threadKey] = await Promise.all([
    getSellerContext(ownerId),
    getCategories(),
    getFirstThreadKey(),
  ]);

  if (!shop) {
    return <div className="container-page py-20 text-center text-muted">Магазин не найден.</div>;
  }

  const active = shop.products.filter((p) => p.status === "ACTIVE").length;
  const pending = shop.products.filter((p) => p.status === "PENDING").length;
  const revenue = shop.orders.reduce((s, o) => s + o.total, 0);

  return (
    <DashShell title={shop.name} role={`Продавец · ${shop.city}`} nav={nav}>
      <DashSection id="overview" title="Обзор">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Товары" value={active} hint={pending ? `${pending} на модерации` : "все опубликованы"} />
          <Stat label="Заказы" value={shop.orders.length} />
          <Stat label="Выручка" value={formatPrice(revenue)} />
          <Stat label="Рейтинг" value={shop.rating.toFixed(1)} hint={`${shop.ratingCount} отзывов`} />
        </div>
      </DashSection>

      <DashSection id="products" title="Товары">
        <Card className="mb-5 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-graphite">
            <Plus className="h-4 w-4 text-accent" /> Добавить товар
          </div>
          <form action={addProduct} className="grid gap-3 sm:grid-cols-2">
            <input name="title" placeholder="Название изделия" required className={field} />
            <input name="price" type="number" min="1" placeholder="Цена, ₽" required className={field} />
            <select name="category" className={field} defaultValue="toys">
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <input name="description" placeholder="Краткое описание" className={field} />
            <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover sm:col-span-2 sm:justify-self-start">
              Добавить — на модерацию
            </button>
          </form>
        </Card>

        <div className="overflow-hidden rounded-2xl border border-line">
          {shop.products.map((p, i) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 border-b border-line p-3 last:border-0">
              <ProductArtwork category={p.category.slug} seed={i} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-graphite">{p.title}</div>
                <div className="text-xs text-muted">{p.category.name} · {p.stock} шт.</div>
              </div>
              <span className="text-sm font-semibold text-graphite">{formatPrice(p.price)}</span>
              <StatusPill tone={prodTone(p.status)}>{productStatusLabel(p.status)}</StatusPill>
            </div>
          ))}
        </div>
      </DashSection>

      <DashSection id="orders" title="Заказы">
        <div className="space-y-3">
          {shop.orders.map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-graphite">
                  {o.number}
                  <span className="ml-2 text-xs text-muted">{df.format(o.createdAt)}</span>
                </div>
                <div className="truncate text-xs text-muted">
                  {o.items.map((it) => `${it.title} × ${it.qty}`).join(", ")}
                </div>
              </div>
              <span className="text-sm font-semibold text-graphite">{formatPrice(o.total)}</span>
              <StatusPill tone={o.escrowStatus === "RELEASED" ? "green" : "amber"}>
                {escrowLabel(o.escrowStatus)}
              </StatusPill>
              <form action={setOrderStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="h-9 rounded-lg border border-line bg-paper px-2 text-sm">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.code} value={s.code}>{s.label}</option>
                  ))}
                </select>
                <button className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-graphite transition hover:border-accent hover:text-accent">
                  Обновить
                </button>
              </form>
            </Card>
          ))}
        </div>
      </DashSection>

      <DashSection id="employees" title="Сотрудники магазина">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shop.employees.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="font-medium text-graphite">{e.name}</div>
              <div className="mt-0.5 text-sm text-accent">{e.role}</div>
              {e.email && <div className="mt-1 text-xs text-muted">{e.email}</div>}
            </Card>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Владелец приглашает сотрудников и назначает права: менеджер заказов,
          контент-менеджер, бухгалтер, помощник.
        </p>
      </DashSection>

      <DashSection id="delivery" title="Доставка и оплата">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm font-medium text-graphite">Доставка</div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{shop.deliveryInfo}</p>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-medium text-graphite">Оплата</div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Карты, перевод, при получении. Средства удерживаются по эскроу до
              подтверждения доставки.
            </p>
          </Card>
        </div>
      </DashSection>

      <DashSection id="shop" title="Магазин">
        <Card className="max-w-md p-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-graphite">{shop.name}</span>
            {shop.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" strokeWidth={1.6} /> {shop.city}, {shop.region}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{shop.description}</p>
        </Card>
      </DashSection>

      <DashSection id="messages" title="Сообщения с покупателем">
        <ChatPanel threadKey={threadKey} as="seller" />
      </DashSection>
    </DashShell>
  );
}
