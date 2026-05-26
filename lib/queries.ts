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

export async function getShops() {
  return prisma.shop.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ promoted: "desc" }, { rating: "desc" }, { ratingCount: "desc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getTopShops(take = 12) {
  return prisma.shop.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ promoted: "desc" }, { rating: "desc" }, { ratingCount: "desc" }],
    take,
    include: { _count: { select: { products: true } } },
  });
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
      products: {
        where: { status: "ACTIVE" },
        include: cardInclude,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
