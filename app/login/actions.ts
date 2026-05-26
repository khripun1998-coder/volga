"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=1");

  const c = await cookies();
  c.set("volga_session", JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(user.role === "SELLER" ? "/seller" : user.role === "ADMIN" ? "/admin" : "/account");
}

export async function logout() {
  const c = await cookies();
  c.delete("volga_session");
  redirect("/");
}
