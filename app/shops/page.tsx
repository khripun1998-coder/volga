import { getShops } from "@/lib/queries";
import { ShopRankCard } from "@/components/shop-rank-card";

export const metadata = { title: "Магазины — Волга" };

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-graphite md:text-4xl">
        Топ магазинов площадки
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
        Рейтинг «по версии Волги»: учитываются оценки и активность. Чем выше место
        в топе — тем больше показов и продвижение. В перспективе верхние места —
        платное размещение и аукцион.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shops.map((s, i) => (
          <ShopRankCard key={s.slug} shop={s} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
