import { getShops } from "@/lib/queries";
import { ShopsView } from "@/components/shops-view";

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
        рейтингу. Покупайте, общайтесь и становитесь клиентами тех, чьё дело по душе.
      </p>

      <ShopsView shops={shops} />
    </div>
  );
}
