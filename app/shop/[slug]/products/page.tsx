import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import { ProductsView } from "@/components/products-view";

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
      <h2 className="mb-5 font-display text-2xl font-semibold text-graphite">
        Все работы мастера
      </h2>
      <ProductsView products={shop.products} cardLayout="channel" showRating={false} />
    </div>
  );
}
