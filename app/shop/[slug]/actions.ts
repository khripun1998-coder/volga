"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type FollowResult = {
  ok: boolean;
  following?: boolean;
  needAuth?: boolean;
};

/** Подписка/отписка на магазин. Требует сессии; иначе needAuth. */
export async function toggleFollow(shopSlug: string): Promise<FollowResult> {
  const session = await getSession();
  if (!session) return { ok: false, needAuth: true };

  const shop = await prisma.shop.findUnique({
    where: { slug: shopSlug },
    select: { id: true },
  });
  if (!shop) return { ok: false };

  const existing = await prisma.follow.findUnique({
    where: { userId_shopId: { userId: session.id, shopId: shop.id } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    revalidatePath(`/shop/${shopSlug}`);
    return { ok: true, following: false };
  }

  await prisma.follow.create({ data: { userId: session.id, shopId: shop.id } });
  revalidatePath(`/shop/${shopSlug}`);
  return { ok: true, following: true };
}
