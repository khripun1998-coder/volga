"use server";

import { prisma } from "@/lib/prisma";

export type SuggestResult = {
  products: { slug: string; title: string; price: number; image: string | null; shop: string }[];
  shops: { slug: string; name: string; rating: number; avatar: string | null }[];
  categories: { slug: string; name: string }[];
};

// Подсказки поиска. Демо-данные небольшие — фильтруем в JS (регистронезависимо,
// SQLite contains чувствителен к регистру). На боевом объёме — индекс/полнотекст.
export async function searchSuggest(q: string): Promise<SuggestResult> {
  const term = q.trim().toLowerCase();
  if (term.length < 2) return { products: [], shops: [], categories: [] };

  const [products, shops, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        title: true,
        shortDescription: true,
        price: true,
        images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
        shop: { select: { name: true } },
      },
      take: 300,
    }),
    prisma.shop.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, name: true, rating: true, avatarUrl: true },
    }),
    prisma.category.findMany({ select: { slug: true, name: true } }),
  ]);

  return {
    products: products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.shop.name.toLowerCase().includes(term)
      )
      .slice(0, 6)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        price: p.price,
        image: p.images[0]?.url ?? null,
        shop: p.shop.name,
      })),
    shops: shops
      .filter((s) => s.name.toLowerCase().includes(term))
      .slice(0, 4)
      .map((s) => ({ slug: s.slug, name: s.name, rating: s.rating, avatar: s.avatarUrl })),
    categories: categories
      .filter((c) => c.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map((c) => ({ slug: c.slug, name: c.name })),
  };
}
