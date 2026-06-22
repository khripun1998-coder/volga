"use server";

import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession } from "@/lib/session";

function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const orig = Buffer.from(hash, "hex");
  return orig.length === test.length && timingSafeEqual(orig, test);
}

function homeFor(role: string) {
  return role === "SELLER" ? "/seller" : role === "ADMIN" ? "/admin" : "/account";
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=1");

  // Если у пользователя задан пароль — проверяем. Демо‑аккаунты без хэша пускаем с любым паролем.
  if (user.passwordHash && !verifyPassword(password, user.passwordHash)) {
    redirect("/login?error=1");
  }

  await setSession({ id: user.id, name: user.name, role: user.role });
  redirect(homeFor(user.role));
}

export async function register(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !email) redirect("/login?error=reg");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/login?error=exists");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: "BUYER",
      passwordHash: password ? hashPassword(password) : null,
    },
  });

  await setSession({ id: user.id, name: user.name, role: user.role });
  redirect("/account");
}

export async function logout() {
  await clearSession();
  redirect("/");
}
