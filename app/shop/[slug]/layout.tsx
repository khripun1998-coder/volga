import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { ChannelHeader } from "@/components/channel-header";
import { ChannelTabs } from "@/components/channel-tabs";
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
  // «Клиенты» = реальные покупатели (уникальные buyer'ы по заказам) + база для соц-доказательства.
  const buyers = await prisma.order.findMany({
    where: { shopId: shop.id, buyerId: { not: null } },
    select: { buyerId: true },
    distinct: ["buyerId"],
  });
  const clients =
    Math.max(36, Math.round(shop.ratingCount * 11 + shop.rating * 22)) + buyers.length;

  return (
    <div style={themeVars(theme)}>
      <ChannelHeader
        shop={shop}
        theme={theme}
        productsCount={shop.products.length}
        clients={clients}
      />
      <div className="container-page">
        <ChannelTabs slug={shop.slug} />
        <div className="pb-16 pt-8">{children}</div>
      </div>
    </div>
  );
}
