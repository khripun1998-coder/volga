"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEMO } from "@/lib/demo";

export async function addProduct(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const price = Number.parseInt(String(formData.get("price") ?? "0"), 10) || 0;
  const category = String(formData.get("category") ?? "toys");
  const description = String(formData.get("description") ?? "").trim();
  if (!title || price <= 0) return;

  const shop = await prisma.shop.findUniqueOrThrow({ where: { slug: DEMO.sellerShop } });
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
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/seller");
  revalidatePath("/account");
}
