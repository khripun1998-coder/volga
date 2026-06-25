import { notFound } from "next/navigation";
import { getShopBySlug, getShopClientCount } from "@/lib/queries";
import { ChannelHeader } from "@/components/channel-header";
import { ChannelTabs } from "@/components/channel-tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getShopTheme, themeVars } from "@/lib/shop-theme";

export default async function ShopLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop || shop.status !== "ACTIVE") notFound();

  const theme = getShopTheme(shop.slug);
  // «Клиенты» = РЕАЛЬНЫЕ покупатели: уникальные заказчики по заказам магазина.
  // Без накрутки — счёт растёт сам при каждой новой покупке.
  const clients = await getShopClientCount(shop.id);

  return (
    <div style={themeVars(theme)}>
      <div className="container-page pt-3">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Магазины", href: "/shops" },
            { label: shop.name },
          ]}
        />
      </div>
      <ChannelHeader
        shop={shop}
        theme={theme}
        productsCount={shop.products.length}
        clients={clients}
        founderName={shop.owner?.name ?? null}
      />
      <div className="container-page">
        <ChannelTabs slug={shop.slug} />
        <div className="pb-16 pt-8">{children}</div>
      </div>
    </div>
  );
}
