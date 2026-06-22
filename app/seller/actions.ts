"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/demo";
import { getSession } from "@/lib/session";

export async function addProduct(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const price = Number.parseInt(String(formData.get("price") ?? "0"), 10) || 0;
  const category = String(formData.get("category") ?? "toys");
  const description = String(formData.get("description") ?? "").trim();
  if (!title || price <= 0) return;

  // Только продавец и только в СВОЙ магазин (без подмены на демо-магазин).
  const session = await getSession();
  if (session?.role !== "SELLER") return;
  const shop = await prisma.shop.findFirst({ where: { ownerId: session.id } });
  if (!shop) return;
  const cat = await prisma.category.findUniqueOrThrow({ where: { slug: category } });

  await prisma.product.create({
    data: {
      slug: `p-${Date.now().toString(36)}`,
      title,
      shortDescription: description.slice(0, 90) || "Изделие ручной работы",
      description: description || "Новое изделие, добавлено продавцом.",
      price,
      stock: 10,
      handmade: true,
      madeInRussia: true,
      status: "PENDING",
      shopId: shop.id,
      categoryId: cat.id,
    },
  });

  revalidatePath("/seller");
  revalidatePath("/admin");
}

export async function setOrderStatus(formData: FormData) {
  // Только продавец и только по СВОИМ заказам; статус — из белого списка.
  const session = await getSession();
  if (session?.role !== "SELLER") return;
  const shop = await prisma.shop.findFirst({
    where: { ownerId: session.id },
    select: { id: true },
  });
  if (!shop) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !ORDER_STATUSES.some((s) => s.code === status)) return;

  // Эскроу следует за статусом: доставлен/завершён → средства выплачены продавцу.
  const escrowStatus =
    status === "DELIVERED" || status === "COMPLETED" ? "RELEASED" : undefined;

  const res = await prisma.order.updateMany({
    where: { id, shopId: shop.id },
    data: escrowStatus ? { status, escrowStatus } : { status },
  });
  if (res.count === 0) return;

  revalidatePath("/seller");
  revalidatePath("/account");
}
