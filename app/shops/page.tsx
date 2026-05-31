import { getShops } from "@/lib/queries";
import { ShopFeedCard } from "@/components/shop-feed-card";

export const metadata = { title: "Магазины — Волга" };

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-graphite md:text-4xl">
        Магазины площадки
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
        Каждый магазин — личный канал мастера. Сначала показываем лучшие по
        рейтингу. Подписывайтесь, общайтесь и поддерживайте тех, чьё дело по душе.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shops.map((s) => (
          <ShopFeedCard key={s.slug} shop={s} />
        ))}
      </div>
    </div>
  );
}
