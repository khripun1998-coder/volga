import {
  getAdminDashboard,
  getModerationQueue,
  getDisputes,
  getAdminUsers,
  getAdminOrders,
  disputeStatusLabel,
  productStatusLabel,
  roleLabel,
  escrowLabel,
  orderStatusLabel,
} from "@/lib/demo";
import { DashShell, DashSection, Stat, StatusPill, Card } from "@/components/dashboard";
import { ProductArtwork } from "@/components/product-artwork";
import { formatPrice } from "@/lib/utils";
import { moderateProduct, resolveDispute } from "./actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Админ-панель — Волга" };

const nav = [
  { label: "Дашборд", href: "#dashboard" },
  { label: "Модерация", href: "#moderation" },
  { label: "Споры", href: "#disputes" },
  { label: "Пользователи", href: "#users" },
  { label: "Финансы", href: "#finances" },
  { label: "Логистика", href: "#logistics" },
  { label: "Безопасность", href: "#audit" },
  { label: "Настройки", href: "#settings" },
];

const field =
  "h-10 w-full rounded-lg border border-line bg-paper px-3 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/login");

  const [kpi, queue, disputes, users, orders] = await Promise.all([
    getAdminDashboard(),
    getModerationQueue(),
    getDisputes(),
    getAdminUsers(),
    getAdminOrders(),
  ]);

  const df = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const auditFeed = [
    ...queue.map((p) => ({
      at: p.createdAt,
      actor: `Продавец · ${p.shop.name}`,
      action: `добавил товар «${p.title}» → на модерацию`,
    })),
    ...disputes.map((d) => ({
      at: d.createdAt,
      actor: "Покупатель",
      action: `открыл спор по заказу ${d.order.number}`,
    })),
    ...orders.slice(0, 6).map((o) => ({
      at: o.createdAt,
      actor: "Система",
      action: `заказ ${o.number} → «${orderStatusLabel(o.status)}», эскроу «${escrowLabel(o.escrowStatus)}»`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 10);

  return (
    <DashShell title="Панель платформы" role="Администратор" nav={nav}>
      <DashSection id="dashboard" title="Дашборд">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Stat label="Оборот" value={formatPrice(kpi.revenue)} delta={kpi.revDelta} spark={kpi.revSpark} hint="неделя к неделе" />
          <Stat label="Заказы" value={kpi.orders} delta={kpi.orderDelta} spark={kpi.orderSpark} hint="неделя к неделе" />
          <Stat label="Удержано в эскроу" value={formatPrice(kpi.escrowHeld)} hint="ожидает выплаты продавцам" />
          <Stat label="Магазины" value={kpi.shops} />
          <Stat label="Активные товары" value={kpi.activeProducts} />
          <Stat label="Пользователи" value={kpi.users} />
          <Stat label="На модерации" value={kpi.pending} hint="товаров в очереди" />
          <Stat label="Открытые споры" value={kpi.openDisputes} />
        </div>
      </DashSection>

      <DashSection id="moderation" title={`Модерация товаров (${queue.length})`}>
        <p className="-mt-2 mb-4 text-sm text-muted">
          Низкорисковые товары публикуются автоматически; подозрительные попадают
          в эту очередь на ручную проверку.
        </p>
        <div className="space-y-3">
          {queue.map((p, i) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-4 p-3">
              <ProductArtwork category={p.category.slug} seed={i} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-graphite">{p.title}</div>
                <div className="text-xs text-muted">{p.shop.name} · {p.category.name} · {formatPrice(p.price)}</div>
              </div>
              <StatusPill tone={p.status === "PENDING" ? "amber" : "red"}>
                {productStatusLabel(p.status)}
              </StatusPill>
              <form action={moderateProduct} className="flex gap-2">
                <input type="hidden" name="id" value={p.id} />
                <button name="decision" value="approve" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover">
                  Одобрить
                </button>
                <button name="decision" value="reject" className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-graphite transition hover:border-red-300 hover:text-red-600">
                  Отклонить
                </button>
              </form>
            </Card>
          ))}
          {queue.length === 0 && <p className="text-sm text-muted">Очередь пуста.</p>}
        </div>
      </DashSection>

      <DashSection id="disputes" title="Споры и арбитраж">
        <div className="space-y-3">
          {disputes.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-graphite">Заказ {d.order.number}</span>
                <StatusPill tone={d.status === "RESOLVED" ? "green" : "amber"}>
                  {disputeStatusLabel(d.status)}
                </StatusPill>
              </div>
              <p className="mt-2 text-sm text-graphite/90">{d.reason}</p>
              {d.status === "RESOLVED" ? (
                <p className="mt-2 rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">
                  Решение: {d.resolution}
                </p>
              ) : (
                <form action={resolveDispute} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="id" value={d.id} />
                  <input name="resolution" placeholder="Решение арбитра (напр. возврат 30%)" className={field} />
                  <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover">
                    Вынести решение
                  </button>
                </form>
              )}
            </Card>
          ))}
          {disputes.length === 0 && (
            <p className="text-sm text-muted">Открытых споров нет — все вопросы урегулированы.</p>
          )}
        </div>
      </DashSection>

      <DashSection id="users" title="Пользователи">
        <div className="overflow-hidden rounded-2xl border border-line">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-4 border-b border-line p-3 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-graphite">{u.name}</div>
                <div className="truncate text-xs text-muted">{u.email}</div>
              </div>
              <StatusPill tone="blue">{roleLabel(u.role)}</StatusPill>
              <span className="text-xs text-muted">{u._count.shops} маг. · {u._count.orders} зак.</span>
              <button className="rounded-lg border border-line px-3 py-1.5 text-sm text-graphite transition hover:border-red-300 hover:text-red-600">
                Заблокировать
              </button>
            </div>
          ))}
        </div>
      </DashSection>

      <DashSection id="finances" title="Заказы и финансы">
        <div className="overflow-x-auto rounded-2xl border border-line">
          <div className="grid min-w-[460px] grid-cols-[1fr_1fr_auto_auto] gap-3 border-b border-line bg-cream px-4 py-2.5 text-xs font-medium text-muted">
            <span>Заказ</span><span>Магазин</span><span>Сумма</span><span>Эскроу</span>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="grid min-w-[460px] grid-cols-[1fr_1fr_auto_auto] items-center gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0">
              <span className="text-graphite">{o.number}</span>
              <span className="truncate text-muted">{o.shop?.name ?? "—"}</span>
              <span className="text-graphite">{formatPrice(o.total)}</span>
              <StatusPill tone={o.escrowStatus === "RELEASED" ? "green" : "amber"}>
                {escrowLabel(o.escrowStatus)}
              </StatusPill>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Выплаты продавцам производятся после перехода эскроу в статус «Выплачено».
        </p>
      </DashSection>

      <DashSection id="logistics" title="Логистика">
        <div className="grid gap-4 sm:grid-cols-3">
          {["СДЭК", "Почта России", "Курьер по городу"].map((p) => (
            <Card key={p} className="p-5">
              <div className="font-medium text-graphite">{p}</div>
              <div className="mt-1 text-sm text-muted">Интеграция по API · расчёт по весу/региону</div>
            </Card>
          ))}
        </div>
      </DashSection>

      <DashSection id="audit" title="Безопасность и аудит">
        <p className="-mt-2 mb-4 text-sm text-muted">
          Журнал действий (аудит-лог) и антифрод. Все ключевые операции фиксируются.
        </p>
        <div className="overflow-hidden rounded-2xl border border-line">
          {auditFeed.map((e, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-line px-4 py-2.5 text-sm last:border-0"
            >
              <span className="w-28 shrink-0 text-xs text-muted">{df.format(e.at)}</span>
              <span className="font-medium text-graphite">{e.actor}</span>
              <span className="text-muted">{e.action}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <StatusPill tone="green">Антифрод: норма</StatusPill>
          <span className="text-muted">подозрительных транзакций не обнаружено</span>
        </div>
      </DashSection>

      <DashSection id="settings" title="Настройки платформы">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="font-medium text-graphite">Тарифы</div>
            <p className="mt-1 text-sm text-muted">Бесплатный старт · комиссия с продаж · подписка.</p>
          </Card>
          <Card className="p-5">
            <div className="font-medium text-graphite">Правила и безопасность</div>
            <p className="mt-1 text-sm text-muted">Антифрод-правила, аудит-логи, шаблоны уведомлений.</p>
          </Card>
        </div>
      </DashSection>
    </DashShell>
  );
}
