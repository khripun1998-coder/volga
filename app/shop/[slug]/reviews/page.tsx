import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import { Stars } from "@/components/rating";
import { prisma } from "@/lib/prisma";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function ShopReviews({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  const reviews = await prisma.review.findMany({
    where: { product: { shopId: shop.id } },
    include: { product: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  if (reviews.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-line py-20 text-center">
        <p className="font-display text-xl text-graphite">Отзывов пока нет</p>
        <p className="mt-1 text-sm text-muted">
          Будьте первым покупателем — и расскажите о своём опыте здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[320px_1fr]">
      <aside className="self-start rounded-3xl p-7" style={{ background: "var(--surface-muted)" }}>
        <p className="eyebrow">Рейтинг магазина</p>
        <p className="font-display mt-3 text-6xl font-semibold leading-none text-graphite">
          {shop.rating.toFixed(1)}
        </p>
        <Stars value={shop.rating} className="mt-3" />
        <p className="mt-2 text-[13px] text-muted">{shop.ratingCount} оценок</p>
      </aside>

      <ul className="space-y-5">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-3xl bg-paper p-6 hairline transition hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-graphite">{r.authorName}</span>
              <span className="text-xs text-muted">{dateFmt.format(r.createdAt)}</span>
            </div>
            <Stars value={r.rating} className="mt-2.5" />
            <p className="mt-3 leading-relaxed text-graphite/90">{r.text}</p>
            <a
              href={`/product/${r.product.slug}`}
              className="mt-4 inline-block text-[13px] font-medium"
              style={{ color: "var(--accent)" }}
            >
              {r.product.title} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
