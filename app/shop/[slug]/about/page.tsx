import { notFound } from "next/navigation";
import { MapPin, Package, RotateCcw, Truck } from "lucide-react";
import { getShopBySlug } from "@/lib/queries";
import { pluralize } from "@/lib/utils";

const kindLabel: Record<string, string> = {
  workshop: "Мастерская",
  production: "Производство",
  supplier: "Поставщик сырья",
};

export default async function ShopAbout({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  return (
    <article className="grid gap-12 md:grid-cols-[1.6fr_1fr]">
      <div>
        <p className="eyebrow">О мастере</p>
        <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-graphite md:text-4xl">
          История магазина «{shop.name}»
        </h2>
        <p className="mt-6 text-[17px] leading-[1.7] text-graphite/90">
          {shop.description}
        </p>

        <dl className="mt-10 divide-y divide-line border-y border-line">
          <Row label="Формат">{kindLabel[shop.kind] ?? "Магазин"}</Row>
          {shop.city && (
            <Row label="Город">
              {shop.city}
              {shop.region ? `, ${shop.region}` : ""}
            </Row>
          )}
          {shop.address && <Row label="Адрес / самовывоз">{shop.address}</Row>}
          {shop.exportInfo && <Row label="Экспорт">{shop.exportInfo}</Row>}
          <Row label="В каталоге">
            {shop.products.length}{" "}
            {pluralize(shop.products.length, ["изделие", "изделия", "изделий"])}
          </Row>
          <Row label="Рейтинг">
            {shop.rating.toFixed(1)} · {shop.ratingCount}{" "}
            {pluralize(shop.ratingCount, ["отзыв", "отзыва", "отзывов"])}
          </Row>
        </dl>
      </div>

      <aside className="space-y-3 self-start">
        {shop.deliveryInfo && (
          <Info icon={Truck} title="Доставка" text={shop.deliveryInfo} />
        )}
        {shop.returnPolicy && (
          <Info icon={RotateCcw} title="Возврат" text={shop.returnPolicy} />
        )}
        {shop.city && (
          <Info icon={MapPin} title="Где" text={`${shop.city}${shop.region ? `, ${shop.region}` : ""}`} />
        )}
        <Info icon={Package} title="Тип" text={kindLabel[shop.kind] ?? "Магазин"} />
      </aside>
    </article>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 py-4 text-[14px]">
      <dt className="w-44 shrink-0 text-muted">{label}</dt>
      <dd className="text-graphite">{children}</dd>
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-paper p-5">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" strokeWidth={1.6} style={{ color: "var(--accent)" }} />
        <span className="eyebrow">{title}</span>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-graphite">{text}</p>
    </div>
  );
}
