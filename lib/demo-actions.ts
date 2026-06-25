"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession, DEMO_ENABLED } from "@/lib/session";

// Демо-вход одним кликом: ставит НАСТОЯЩУЮ подписанную сессию нужной роли.
// Так демо работает, а реальные проверки доступа (гейты /admin, /seller) проходят.
const DEMO: Record<string, { email: string; home: string }> = {
  buyer: { email: "buyer@volga.market", home: "/account" },
  seller: { email: "marina@teplye-lapki.ru", home: "/seller" },
  admin: { email: "admin@volga.market", home: "/admin" },
};

export async function loginAsDemo(formData: FormData) {
  // Привилегированный вход одним кликом — только в демо-режиме (не в реальном проде).
  if (!DEMO_ENABLED) redirect("/login");
  const demo = DEMO[String(formData.get("role") ?? "")];
  if (!demo) redirect("/");
  const user = await prisma.user.findUnique({ where: { email: demo.email } });
  if (!user) redirect("/login");
  await setSession({ id: user.id, name: user.name, role: user.role });
  redirect(demo.home);
}

export async function exitDemo() {
  await clearSession();
  redirect("/");
}
