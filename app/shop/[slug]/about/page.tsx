import { notFound } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, MapPin, Package, RotateCcw, Truck } from "lucide-react";
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

  const founder = shop.owner?.name ?? null;
  const years = shop.craftSince ? new Date().getFullYear() - shop.craftSince : null;

  return (
    <article className="grid gap-12 md:grid-cols-[1.6fr_1fr]">
      <div>
        {/* Знакомство с мастером — лицо «канала автора» */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-line bg-accent-soft shadow-[var(--shadow-soft)]">
            {shop.founderPhotoUrl ? (
              <Image
                src={shop.founderPhotoUrl}
                alt={founder ?? shop.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center font-serif text-3xl font-semibold text-accent">
                {(founder ?? shop.name).charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="eyebrow">Знакомьтесь</p>
            {founder && (
              <h2 className="font-serif text-3xl leading-tight text-graphite md:text-[38px]">
                {founder}
              </h2>
            )}
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
              Мастер магазина «{shop.name}»
              {shop.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
            </p>
          </div>
        </div>

        {years != null && (
          <p className="mt-5 inline-flex items-center rounded-full bg-cream px-3.5 py-1.5 text-[13px] font-medium text-graphite">
            В ремесле с {shop.craftSince} года · {years}{" "}
            {pluralize(years, ["год", "года", "лет"])} опыта
          </p>
        )}

        {shop.story && (
          <p className="mt-6 font-serif text-[19px] leading-[1.7] text-graphite/90">
            {shop.story}
          </p>
        )}

        <p className="mt-5 text-[16px] leading-[1.7] text-graphite/80">{shop.description}</p>

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
    <div className="rounded-2xl bg-paper p-5 hairline shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" strokeWidth={1.6} style={{ color: "var(--accent)" }} />
        <span className="eyebrow">{title}</span>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-graphite">{text}</p>
    </div>
  );
}
