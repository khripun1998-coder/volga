import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const cardInclude = {
  images: { orderBy: { position: "asc" as const }, take: 1 },
  shop: true,
  category: { select: { slug: true, name: true } },
} satisfies Prisma.ProductInclude;

export type CardProduct = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { position: "asc" } });
}

export async function getFeaturedProducts(take = 8): Promise<CardProduct[]> {
  return prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: cardInclude,
    orderBy: { createdAt: "asc" },
    take,
  });
}

export async function getNewProducts(take = 8): Promise<CardProduct[]> {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export interface CatalogFilters {
  q?: string;
  category?: string;
  tag?: string; // handmade | russia | eco
  city?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  sort?: string; // price_asc | price_desc | new
}

export async function getCatalog(f: CatalogFilters): Promise<CardProduct[]> {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
  if (f.category) where.category = { slug: f.category };
  if (f.tag === "handmade") where.handmade = true;
  if (f.tag === "russia") where.madeInRussia = true;
  if (f.tag === "eco") where.eco = true;
  if (f.city) where.shop = { is: { city: f.city } };
  if (f.inStock) where.stock = { gt: 0 };
  if (f.min != null || f.max != null) {
    where.price = {};
    if (f.min != null) where.price.gte = f.min;
    if (f.max != null) where.price.lte = f.max;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    f.sort === "price_asc"
      ? { price: "asc" }
      : f.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  let products = await prisma.product.findMany({ where, orderBy, include: cardInclude });

  if (f.q) {
    const q = f.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.shop.name.toLowerCase().includes(q)
    );
  }
  return products;
}

export async function getCatalogFacets() {
  const [categories, shops, agg] = await Promise.all([
    prisma.category.findMany({ orderBy: { position: "asc" } }),
    prisma.shop.findMany({ where: { status: "ACTIVE" }, select: { city: true } }),
    prisma.product.aggregate({
      where: { status: "ACTIVE" },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);
  const cities = Array.from(
    new Set(shops.map((s) => s.city).filter((c): c is string => Boolean(c)))
  ).sort();
  return {
    categories,
    cities,
    minPrice: agg._min.price ?? 0,
    maxPrice: agg._max.price ?? 0,
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: true,
      reviews: { orderBy: { createdAt: "desc" } },
      materialSources: { orderBy: { position: "asc" } },
      category: true,
      shop: true,
    },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  take = 4
): Promise<CardProduct[]> {
  return prisma.product.findMany({
    where: { status: "ACTIVE", categoryId, id: { not: excludeId } },
    include: cardInclude,
    take,
  });
}

/**
 * «Клиенты» магазина = РЕАЛЬНЫЕ покупатели (а не накрученные подписчики).
 * Человек становится клиентом сразу, как оформит заказ. Счёт = число уникальных
 * покупателей по заказам магазина и растёт сам при каждой новой покупке.
 * Идентичность покупателя: buyerId (вошёл в аккаунт) → телефон (гость) → сам заказ.
 */
function buyerKey(o: { buyerId: string | null; customerPhone: string | null; id: string }) {
  if (o.buyerId) return `u:${o.buyerId}`;
  if (o.customerPhone) return `t:${o.customerPhone.replace(/\D/g, "")}`;
  return `o:${o.id}`;
}

export async function getClientCounts(): Promise<Map<string, number>> {
  const orders = await prisma.order.findMany({
    where: { shopId: { not: null } },
    select: { shopId: true, buyerId: true, customerPhone: true, id: true },
  });
  const sets = new Map<string, Set<string>>();
  for (const o of orders) {
    if (!o.shopId) continue;
    let set = sets.get(o.shopId);
    if (!set) sets.set(o.shopId, (set = new Set<string>()));
    set.add(buyerKey(o));
  }
  const counts = new Map<string, number>();
  for (const [shopId, set] of sets) counts.set(shopId, set.size);
  return counts;
}

export async function getShopClientCount(shopId: string): Promise<number> {
  const orders = await prisma.order.findMany({
    where: { shopId },
    select: { buyerId: true, customerPhone: true, id: true },
  });
  return new Set(orders.map(buyerKey)).size;
}

/** Реальные показатели площадки для плашки на главной (вместо выдуманных «1200+»). */
export async function getPlatformStats() {
  const [shops, products, agg, clientCounts] = await Promise.all([
    prisma.shop.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.shop.aggregate({ where: { status: "ACTIVE" }, _avg: { rating: true } }),
    getClientCounts(),
  ]);
  let clients = 0;
  for (const n of clientCounts.values()) clients += n;
  return { shops, products, clients, avgRating: agg._avg.rating ?? 0 };
}

/**
 * Магазины ленты — сразу с превью первых 4 товаров и числом реальных клиентов,
 * чтобы карточка-«канал» показывала «обложку + миниатюры» и честное соц-доказательство.
 */
export async function getShops() {
  const [shops, clients] = await Promise.all([
    prisma.shop.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ promoted: "desc" }, { rating: "desc" }, { ratingCount: "desc" }],
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: "ACTIVE" },
          include: cardInclude,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 4,
        },
      },
    }),
    getClientCounts(),
  ]);
  return shops.map((s) => ({ ...s, clients: clients.get(s.id) ?? 0 }));
}

export async function getTopShops(take = 12) {
  const [shops, clients] = await Promise.all([
    prisma.shop.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ promoted: "desc" }, { rating: "desc" }, { ratingCount: "desc" }],
      take,
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: "ACTIVE" },
          include: cardInclude,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 4,
        },
      },
    }),
    getClientCounts(),
  ]);
  return shops.map((s) => ({ ...s, clients: clients.get(s.id) ?? 0 }));
}

export async function getOrderByNumber(number: string) {
  return prisma.order.findUnique({
    where: { number },
    include: { items: true },
  });
}

export async function getShopBySlug(slug: string) {
  return prisma.shop.findUnique({
    where: { slug },
    include: {
      owner: { select: { name: true } },
      products: {
        where: { status: "ACTIVE" },
        include: cardInclude,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/** Записи журнала мастера (посты канала), новые сверху. */
export async function getShopPosts(shopId: string, take?: number) {
  return prisma.post.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    ...(take ? { take } : {}),
  });
}
