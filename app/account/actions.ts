"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function sendMessage(formData: FormData) {
  const threadKey = String(formData.get("threadKey") ?? "");
  const sender = String(formData.get("sender") ?? "buyer");
  const text = String(formData.get("text") ?? "").trim();
  if (!threadKey || !text) return;
  await prisma.chatMessage.create({
    data: {
      threadKey,
      sender,
      authorName: sender === "buyer" ? "Анна Воронова" : "Тёплые лапки",
      text,
    },
  });
  revalidatePath("/account");
  revalidatePath("/seller");
}
