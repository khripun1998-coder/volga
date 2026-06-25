"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function addReview(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const rating = Math.min(
    5,
    Math.max(1, Number.parseInt(String(formData.get("rating") ?? "5"), 10) || 5)
  );
  const text = String(formData.get("text") ?? "").trim();
  if (!productId || !text) return;

  // Отзыв может оставить только авторизованный пользователь (защита от спама/накрутки).
  const session = await getSession();
  if (!session) return;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, shopId: true, shop: { select: { rating: true, ratingCount: true } } },
  });
  if (!product) return;

  await prisma.review.create({
    data: { productId, rating, text, authorName: session.name },
  });

  // Вплетаем новую оценку в текущий рейтинг магазина (счётчик растёт, не сбрасывается).
  const prevCount = product.shop.ratingCount;
  const prevRating = product.shop.rating;
  const nextCount = prevCount + 1;
  const nextRating = Math.round(((prevRating * prevCount + rating) / nextCount) * 10) / 10;
  await prisma.shop.update({
    where: { id: product.shopId },
    data: { rating: nextRating, ratingCount: nextCount },
  });

  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/account");
  revalidatePath("/");
}

/** «Спросить о товаре» — сохраняем вопрос в чат продавца. */
export async function askAboutProduct(
  shopSlug: string,
  productTitle: string,
  text: string
) {
  const t = (text ?? "").trim();
  if (!shopSlug || !t) return;
  const session = await getSession();
  await prisma.chatMessage.create({
    data: {
      threadKey: `shop:${shopSlug}`,
      sender: "buyer",
      authorName: session?.name ?? "Покупатель",
      text: `Вопрос о «${productTitle}»: ${t}`,
    },
  });
  revalidatePath("/account");
  revalidatePath("/seller");
}
