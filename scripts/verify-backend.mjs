import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const log = (k, v) => console.log(`${k}: ${v}`);

  const user = await prisma.user.findFirst({ where: { role: "BUYER" } });
  const shop = await prisma.shop.findFirst();
  const product = await prisma.product.findFirst({ where: { shopId: shop.id } });
  log("user", user?.email);
  log("shop", shop?.slug);
  log("product", product?.slug);

  // --- Follow: создать → посчитать → удалить ---
  const f = await prisma.follow.create({ data: { userId: user.id, shopId: shop.id } });
  const cnt = await prisma.follow.count({ where: { shopId: shop.id } });
  log("follow.created+count", cnt);
  await prisma.follow.delete({ where: { id: f.id } });
  log("follow.deleted", (await prisma.follow.count({ where: { shopId: shop.id } })));

  // --- Review: добавить → пересчитать рейтинг магазина → откатить ---
  const before = await prisma.shop.findUnique({ where: { id: shop.id }, select: { rating: true, ratingCount: true } });
  const rev = await prisma.review.create({ data: { productId: product.id, rating: 5, text: "[TEST] авто-проверка", authorName: "QA" } });
  const agg = await prisma.review.aggregate({ where: { product: { shopId: shop.id } }, _avg: { rating: true }, _count: true });
  await prisma.shop.update({ where: { id: shop.id }, data: { rating: Math.round((agg._avg.rating ?? 0) * 10) / 10, ratingCount: agg._count } });
  const after = await prisma.shop.findUnique({ where: { id: shop.id }, select: { rating: true, ratingCount: true } });
  log("review.recompute", `${before.rating}(${before.ratingCount}) -> ${after.rating}(${after.ratingCount})`);
  // откат
  await prisma.review.delete({ where: { id: rev.id } });
  await prisma.shop.update({ where: { id: shop.id }, data: { rating: before.rating, ratingCount: before.ratingCount } });
  log("review.rolledback", "ok");

  // --- Chat (Спросить о товаре) ---
  const m = await prisma.chatMessage.create({ data: { threadKey: `shop:${shop.slug}`, sender: "buyer", authorName: "QA", text: "[TEST] вопрос" } });
  log("inquiry.created", m.id.slice(0, 8));
  await prisma.chatMessage.delete({ where: { id: m.id } });

  console.log("ALL OK");
  await prisma.$disconnect();
}

main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
