import Image from "next/image";
import { BadgeCheck, MapPin, MessageCircle, Share2, UserCheck } from "lucide-react";
import { themeVars, type ShopTheme } from "@/lib/shop-theme";
import { pluralize } from "@/lib/utils";

const kindLabel: Record<string, string> = {
  workshop: "Мастерская",
  production: "Производство",
  supplier: "Поставщик сырья",
};

export interface ChannelShop {
  slug: string;
  name: string;
  description: string;
  kind: string;
  city?: string | null;
  region?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  rating: number;
  ratingCount: number;
  verified: boolean;
  promoted: boolean;
}

export function ChannelHeader({
  shop,
  theme,
  productsCount,
  clients,
}: {
  shop: ChannelShop;
  theme: ShopTheme;
  productsCount: number;
  clients: number;
}) {
  return (
    <header style={themeVars(theme)}>
      {/* Обложка — огромная, как у YT-канала */}
      <div
        className="relative h-56 w-full overflow-hidden md:h-80 lg:h-[26rem]"
        style={{ background: "var(--cover)" }}
      >
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
        {/* Лёгкая виньетка снизу, чтобы плавно перешло в светлый ниже */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
      </div>

      {/* Тело шапки */}
      <div className="container-page">
        <div className="-mt-16 flex flex-col gap-7 md:-mt-20 md:flex-row md:items-end">
          {/* Аватар: большой, скруглённый — как у крупного канала */}
          <div
            className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-[6px] border-paper shadow-[0_24px_48px_-24px_rgba(20,20,20,0.18)] md:h-40 md:w-40"
            style={{
              background: shop.avatarUrl ? undefined : "var(--accent-soft)",
            }}
          >
            {shop.avatarUrl ? (
              <Image
                src={shop.avatarUrl}
                alt={shop.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <span
                className="grid h-full w-full place-items-center font-display text-5xl font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {shop.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Имя + мета */}
          <div className="flex-1 md:pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="channel-title text-graphite">{shop.name}</h1>
              {shop.verified && (
                <BadgeCheck
                  className="h-7 w-7"
                  strokeWidth={1.4}
                  style={{ color: "var(--accent)" }}
                />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] text-muted">
              <span className="font-medium text-graphite">@{shop.slug}</span>
              <span aria-hidden>·</span>
              <span>{kindLabel[shop.kind] ?? "Магазин"}</span>
              {shop.city && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    {shop.city}
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[14px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <UserCheck
                  className="h-4 w-4"
                  strokeWidth={1.6}
                  style={{ color: "var(--accent)" }}
                />
                <span className="font-medium text-graphite">
                  {clients.toLocaleString("ru-RU")}
                </span>{" "}
                {pluralize(clients, ["клиент", "клиента", "клиентов"])}
              </span>
              <span aria-hidden>·</span>
              <span>
                <span className="font-medium text-graphite">{productsCount}</span>{" "}
                {pluralize(productsCount, ["изделие", "изделия", "изделий"])}
              </span>
              <span aria-hidden>·</span>
              <span>
                <span className="font-medium" style={{ color: "var(--accent)" }}>
                  {shop.rating.toFixed(1)}
                </span>
                <span className="text-muted"> · {shop.ratingCount}</span>
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-2 md:pb-3">
            <a
              href={`/account#chat-${shop.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.25)] transition hover:brightness-105 active:scale-[0.98]"
              style={{ background: theme.accent }}
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              Написать
            </a>
            <button
              type="button"
              aria-label="Поделиться"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-graphite transition hover:bg-cream"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
