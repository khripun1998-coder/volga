"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function moderateProduct(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return;
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!id) return;
  await prisma.product.update({
    where: { id },
    data: { status: decision === "approve" ? "ACTIVE" : "REJECTED" },
  });
  revalidatePath("/admin");
  revalidatePath("/seller");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function resolveDispute(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return;
  const id = String(formData.get("id") ?? "");
  const resolution =
    String(formData.get("resolution") ?? "").trim() || "Решение арбитра вынесено.";
  if (!id) return;
  await prisma.dispute.update({
    where: { id },
    data: { status: "RESOLVED", resolution },
  });
  revalidatePath("/admin");
}
