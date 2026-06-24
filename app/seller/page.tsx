import { BadgeCheck, MapPin, Plus, UserCheck } from "lucide-react";
import {
  getSellerContext,
  getFirstThreadKey,
  ORDER_STATUSES,
  orderStatusLabel,
  productStatusLabel,
  escrowLabel,
  dailyBuckets,
  trendDelta,
} from "@/lib/demo";
import { getCategories, getShopClientCount } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
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
  { label: "Статистика", href: "#overview" },
  { label: "Товары", href: "#products" },
  { label: "Заказы", href: "#orders" },
  { label: "Сотрудники", href: "#employees" },
  { label: "Доставка и оплата", href: "#delivery" },
  { label: "Магазин", href: "#shop" },
  { label: "Сообщения", href: "#messages" },
];

const field =
  "h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

// Вехи «накопительного эффекта»: владелец видит, как растут реальные клиенты.
const MILESTONES = [50, 100, 250, 500, 1000, 5000, 10000];

function MilestoneCard({ clients }: { clients: number }) {
  const next = MILESTONES.find((m) => m > clients) ?? null;
  const prev = [...MILESTONES].reverse().find((m) => m <= clients) ?? 0;
  const pct = next
    ? Math.max(4, Math.round(((clients - prev) / (next - prev)) * 100))
    : 100;
  return (
    <Card className="mt-4 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-graphite">
            <UserCheck className="h-4 w-4 text-accent" strokeWidth={1.8} /> Клиенты
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold leading-none text-graphite">
            {clients.toLocaleString("ru-RU")}
          </div>
          <div className="mt-1.5 text-xs text-muted">
            Реальные покупатели — те, кто оформил заказ. Не подписки и не накрутка.
          </div>
        </div>
        <div className="text-right text-xs text-muted">
          {next ? (
            <>
              До вехи{" "}
              <span className="font-semibold text-graphite">
                {next.toLocaleString("ru-RU")}
              </span>
              : ещё {(next - clients).toLocaleString("ru-RU")}
            </>
          ) : (
            <>Веха 10 000+ достигнута</>
          )}
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Чем больше реальных клиентов — тем выше доверие к магазину. На вехах 5 000 и
        10 000 клиентов — бонусы и продвижение (готовим).
      </p>
    </Card>
  );
}

export default async function SellerPage() {
  const session = await getSession();
  if (session?.role !== "SELLER") redirect("/login");
  const ownerId = session.id;
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
  const clients = await getShopClientCount(shop.id);
  const recentOrders = shop.orders.slice(0, 12);

  // Тренды для KPI-карточек (спарклайн + дельта неделя-к-неделе)
  const orderDates = shop.orders.map((o) => o.createdAt);
  const orderSpark = dailyBuckets(orderDates, null, 14);
  const revSpark = dailyBuckets(orderDates, shop.orders.map((o) => o.total), 14);
  const orderDelta = trendDelta(orderSpark);
  const revDelta = trendDelta(revSpark);

  return (
    <DashShell title={shop.name} role={`Продавец · ${shop.city}`} nav={nav}>
      <DashSection id="overview" title="Статистика">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Товары" value={active} hint={pending ? `${pending} на модерации` : "все опубликованы"} />
          <Stat label="Заказы" value={shop.orders.length} delta={orderDelta} spark={orderSpark} hint="неделя к неделе" />
          <Stat label="Выручка" value={formatPrice(revenue)} delta={revDelta} spark={revSpark} hint="неделя к неделе" />
          <Stat label="Рейтинг" value={shop.rating.toFixed(1)} hint={`${shop.ratingCount} отзывов`} />
        </div>
        <MilestoneCard clients={clients} />
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
          {shop.products.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted">
              У вас пока нет товаров. Добавьте первый через форму выше.
            </p>
          )}
        </div>
      </DashSection>

      <DashSection id="orders" title="Заказы">
        <div className="space-y-3">
          {recentOrders.map((o) => (
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
          {shop.orders.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line bg-cream px-5 py-10 text-center text-sm text-muted">
              Заказов пока нет — они появятся, когда покупатели оформят покупки.
            </p>
          )}
        </div>
        {shop.orders.length > recentOrders.length && (
          <p className="mt-3 text-center text-sm text-muted">
            Показаны последние {recentOrders.length} из {shop.orders.length} заказов
          </p>
        )}
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
