import { prisma } from "@/lib/prisma";

export const DEMO = {
  buyerEmail: "buyer@volga.market",
  sellerShop: "teplye-lapki",
};

export const ORDER_STATUSES = [
  { code: "ACCEPTED", label: "Принят" },
  { code: "PROCESSING", label: "В обработке" },
  { code: "SHIPPED", label: "Отправлен" },
  { code: "DELIVERED", label: "Доставлен" },
  { code: "COMPLETED", label: "Завершён" },
];

export const orderStatusLabel = (c: string) =>
  ORDER_STATUSES.find((s) => s.code === c)?.label ?? c;
export const orderStatusIndex = (c: string) =>
  Math.max(0, ORDER_STATUSES.findIndex((s) => s.code === c));

export const escrowLabel = (c: string) =>
  ({ HELD: "Удержано (эскроу)", RELEASED: "Выплачено продавцу", REFUNDED: "Возвращено покупателю" }[c] ?? c);

export const disputeStatusLabel = (c: string) =>
  ({ OPEN: "Открыт", IN_REVIEW: "На рассмотрении", RESOLVED: "Решён" }[c] ?? c);

export const productStatusLabel = (c: string) =>
  ({ ACTIVE: "Опубликован", PENDING: "На модерации", REJECTED: "Отклонён", DRAFT: "Черновик" }[c] ?? c);

export const roleLabel = (c: string) =>
  ({ BUYER: "Покупатель", SELLER: "Продавец", ADMIN: "Администратор", MODERATOR: "Модератор" }[c] ?? c);

/** Контекст покупателя. По умолчанию — демо‑покупатель, иначе по id сессии. */
export async function getBuyerContext(userId?: string) {
  const buyer = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findUnique({ where: { email: DEMO.buyerEmail } });
  if (!buyer) return null;
  const orders = await prisma.order.findMany({
    where: { buyerId: buyer.id },
    include: { items: true, shop: true, disputes: true },
    orderBy: { createdAt: "desc" },
  });
  return { buyer, orders };
}

/** Магазин продавца. По умолчанию — демо‑магазин, иначе магазин владельца сессии. */
export async function getSellerContext(ownerId?: string) {
  const include = {
    products: { include: { category: true }, orderBy: { createdAt: "desc" as const } },
    orders: { include: { items: true }, orderBy: { createdAt: "desc" as const } },
    employees: { orderBy: { createdAt: "asc" as const } },
  };
  if (ownerId) {
    return prisma.shop.findFirst({ where: { ownerId }, include });
  }
  return prisma.shop.findUnique({ where: { slug: DEMO.sellerShop }, include });
}

export async function getAdminDashboard() {
  const [users, shops, activeProducts, orders, pending, openDisputes, revenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.product.count({ where: { status: "PENDING" } }),
      prisma.dispute.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);
  return {
    users,
    shops,
    activeProducts,
    orders,
    pending,
    openDisputes,
    revenue: revenue._sum.total ?? 0,
  };
}

export async function getModerationQueue() {
  // Только товары, ожидающие проверки. Отклонённые уходят из очереди
  // (иначе повторное «Отклонить» — пустое действие, а счётчик завышен).
  return prisma.product.findMany({
    where: { status: "PENDING" },
    include: { shop: true, category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDisputes() {
  return prisma.dispute.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    include: { _count: { select: { shops: true, orders: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: { shop: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getChatThread(threadKey: string) {
  return prisma.chatMessage.findMany({
    where: { threadKey },
    orderBy: { createdAt: "asc" },
  });
}

export async function getFirstThreadKey() {
  const m = await prisma.chatMessage.findFirst({ orderBy: { createdAt: "asc" } });
  return m?.threadKey ?? "order:demo";
}
