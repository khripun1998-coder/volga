"use server";

import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession, DEMO_ENABLED } from "@/lib/session";

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

  if (user.passwordHash) {
    // Обычный путь: проверяем пароль по хэшу.
    if (!verifyPassword(password, user.passwordHash)) redirect("/login?error=1");
  } else if (!DEMO_ENABLED) {
    // Аккаунт без пароля (засеянный демо-профиль) вне демо-режима — вход запрещён.
    redirect("/login?error=1");
  }

  await setSession({ id: user.id, name: user.name, role: user.role });
  redirect(homeFor(user.role));
}

export async function register(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  // Базовая валидация: имя, корректный e-mail (линейный, без катастрофического
  // бэктрекинга) и пароль не короче 8 символов — чтобы у самостоятельно
  // зарегистрированных всегда был хэш пароля.
  if (!name || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 8) {
    redirect("/login?error=reg");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/login?error=exists");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: "BUYER",
      passwordHash: hashPassword(password),
    },
  });

  await setSession({ id: user.id, name: user.name, role: user.role });
  redirect("/account");
}

export async function logout() {
  await clearSession();
  redirect("/");
}
