import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Package, RotateCcw, Truck } from "lucide-react";
import { getShopBySlug } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { Rating } from "@/components/rating";
import { pluralize } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  return { title: shop ? `${shop.name} — Волга` : "Магазин — Волга" };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop || shop.status !== "ACTIVE") notFound();

  return (
    <div className="pb-6">
      {/* Обложка */}
      <div className="relative h-44 bg-cream md:h-64">
        {shop.coverUrl && (
          <Image
            src={shop.coverUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/20 to-transparent" />
      </div>

      <div className="container-page">
        {/* Шапка магазина */}
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-paper bg-cream shadow-[var(--shadow-soft)]">
            {shop.avatarUrl && (
              <Image src={shop.avatarUrl} alt={shop.name} fill sizes="96px" className="object-cover" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-semibold text-graphite">
                {shop.name}
              </h1>
              {shop.verified && <BadgeCheck className="h-6 w-6 text-accent" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted">
              <Rating value={shop.rating} count={shop.ratingCount} />
              {shop.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.6} /> {shop.city}, {shop.region}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-4 w-4" strokeWidth={1.6} /> {shop.products.length}{" "}
                {pluralize(shop.products.length, ["товар", "товара", "товаров"])}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-relaxed text-graphite/90">
          {shop.description}
        </p>

        {(shop.deliveryInfo || shop.returnPolicy) && (
          <div className="mt-6 grid gap-3 rounded-xl border border-line bg-cream p-5 text-sm sm:grid-cols-2">
            {shop.deliveryInfo && (
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                <span className="text-graphite">{shop.deliveryInfo}</span>
              </div>
            )}
            {shop.returnPolicy && (
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                <span className="text-graphite">{shop.returnPolicy}</span>
              </div>
            )}
          </div>
        )}

        {/* Товары */}
        <h2 className="font-display mt-12 text-2xl font-semibold text-graphite">
          Товары магазина
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {shop.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
