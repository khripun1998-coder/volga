"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export interface CheckoutItem {
  productId: string;
  qty: number;
  variant?: string;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  name: string;
  phone: string;
  receive: "delivery" | "pickup";
  address?: string;
  deliveryMethod: string;
  payment: string;
  comment?: string;
}

export type CheckoutResult =
  | { ok: true; number: string }
  | { ok: false; error: string };

function orderNumber() {
  return `В-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createOrder(payload: CheckoutPayload): Promise<CheckoutResult> {
  if (!payload.items?.length) return { ok: false, error: "Корзина пуста" };
  if (!payload.name?.trim() || !payload.phone?.trim())
    return { ok: false, error: "Укажите имя и телефон" };
  if (payload.receive === "delivery" && !payload.address?.trim())
    return { ok: false, error: "Укажите адрес доставки" };

  const ids = [...new Set(payload.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const map = new Map(products.map((p) => [p.id, p]));

  const orderItems = [];
  for (const i of payload.items) {
    const p = map.get(i.productId);
    if (!p) continue;
    orderItems.push({
      productId: p.id,
      title: p.title,
      price: p.price,
      qty: Math.max(1, Math.floor(i.qty)),
      variant: i.variant ?? null,
    });
  }
  if (orderItems.length === 0) return { ok: false, error: "Товары недоступны" };

  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Привязываем заказ к магазину товаров и к покупателю (если он вошёл) —
  // чтобы покупка сразу делала человека «клиентом» магазина.
  const firstProduct = map.get(orderItems[0].productId);
  const shopId = firstProduct?.shopId ?? null;

  const session = await getSession();
  let buyerId: string | null = null;
  if (session?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true },
    });
    buyerId = u?.id ?? null;
  }

  const order = await prisma.order.create({
    data: {
      number: orderNumber(),
      status: "ACCEPTED",
      total,
      deliveryMethod:
        payload.receive === "pickup" ? "Самовывоз" : payload.deliveryMethod,
      paymentMethod: payload.payment,
      address: payload.receive === "pickup" ? null : payload.address?.trim(),
      comment: payload.comment?.trim() || null,
      customerName: payload.name.trim(),
      customerPhone: payload.phone.trim(),
      shopId,
      buyerId,
      items: { create: orderItems },
    },
  });

  return { ok: true, number: order.number };
}
