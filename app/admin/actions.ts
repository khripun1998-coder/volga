"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function moderateProduct(formData: FormData) {
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
