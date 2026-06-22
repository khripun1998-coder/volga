"use server";

import { revalidatePath } from "next/cache";
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

class OutOfStockError extends Error {
  constructor(public title: string) {
    super("out_of_stock");
  }
}

// Уникальный номер: время (base36) + случайный хвост. Отдельное пространство
// от сид-номеров «В-1001xx», коллизии практически исключены.
function makeNumber() {
  return `В${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
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

  // Строки заказа + проверка остатка (для не-«под заказ»).
  const lines: { product: (typeof products)[number]; qty: number; variant: string | null }[] = [];
  for (const i of payload.items) {
    const p = map.get(i.productId);
    if (!p || p.status !== "ACTIVE") continue;
    const qty = Math.max(1, Math.floor(i.qty));
    if (!p.madeToOrder) {
      if (p.stock <= 0) return { ok: false, error: `«${p.title}» закончился` };
      if (qty > p.stock) return { ok: false, error: `«${p.title}»: доступно ${p.stock} шт.` };
    }
    lines.push({ product: p, qty, variant: i.variant ?? null });
  }
  if (lines.length === 0) return { ok: false, error: "Товары недоступны" };

  // Покупатель (если вошёл) — покупка делает его клиентом магазина.
  const session = await getSession();
  let buyerId: string | null = null;
  if (session?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true },
    });
    buyerId = u?.id ?? null;
  }

  // Группируем по магазину — отдельный заказ на каждый магазин (иначе продажи и
  // счётчик клиентов магазинов считаются неверно).
  const byShop = new Map<string, typeof lines>();
  for (const l of lines) {
    const sid = l.product.shopId;
    if (!byShop.has(sid)) byShop.set(sid, []);
    byShop.get(sid)!.push(l);
  }

  const common = {
    status: "ACCEPTED",
    deliveryMethod: payload.receive === "pickup" ? "Самовывоз" : payload.deliveryMethod,
    paymentMethod: payload.payment,
    address: payload.receive === "pickup" ? null : payload.address?.trim() || null,
    comment: payload.comment?.trim() || null,
    customerName: payload.name.trim(),
    customerPhone: payload.phone.trim(),
    buyerId,
  };

  try {
    const numbers = await prisma.$transaction(async (tx) => {
      const created: string[] = [];
      for (const [sid, group] of byShop) {
        // Атомарное списание остатка с защитой от гонки: updateMany по условию stock>=qty.
        for (const l of group) {
          if (l.product.madeToOrder) continue;
          const dec = await tx.product.updateMany({
            where: { id: l.product.id, stock: { gte: l.qty } },
            data: { stock: { decrement: l.qty } },
          });
          if (dec.count === 0) throw new OutOfStockError(l.product.title);
        }
        const items = group.map((l) => ({
          productId: l.product.id,
          title: l.product.title,
          price: l.product.price,
          qty: l.qty,
          variant: l.variant,
        }));
        const total = items.reduce((s, it) => s + it.price * it.qty, 0);
        const order = await tx.order.create({
          data: { ...common, number: makeNumber(), total, shopId: sid, items: { create: items } },
          select: { number: true },
        });
        created.push(order.number);
      }
      return created;
    });

    revalidatePath("/seller");
    revalidatePath("/account");
    return { ok: true, number: numbers[0] };
  } catch (e) {
    if (e instanceof OutOfStockError)
      return { ok: false, error: `«${e.title}» закончился, пока вы оформляли заказ` };
    console.error("createOrder failed:", e);
    return { ok: false, error: "Не удалось оформить заказ. Попробуйте ещё раз." };
  }
}
