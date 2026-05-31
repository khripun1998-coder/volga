import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export default async function ShopAllProducts({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  if (shop.products.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-line py-20 text-center">
        <p className="font-display text-xl text-graphite">Пока пусто</p>
        <p className="mt-1 text-sm text-muted">
          Мастер скоро добавит первые работы.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-graphite">
          Все работы мастера
        </h2>
        <span className="text-[13px] text-muted">
          {shop.products.length} в каталоге
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {shop.products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} layout="channel" />
        ))}
      </div>
    </div>
  );
}
