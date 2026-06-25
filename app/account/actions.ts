"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function sendMessage(formData: FormData) {
  // Личность отправителя берём из сессии — клиенту не доверяем (защита от подмены автора).
  const session = await getSession();
  if (!session) return;
  const threadKey = String(formData.get("threadKey") ?? "");
  const text = String(formData.get("text") ?? "").trim();
  if (!threadKey || !text) return;
  const sender = session.role === "SELLER" ? "seller" : "buyer";
  await prisma.chatMessage.create({
    data: { threadKey, sender, authorName: session.name, text },
  });
  revalidatePath("/account");
  revalidatePath("/seller");
}
