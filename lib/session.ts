import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface Session {
  id: string;
  name: string;
  role: string;
}

const COOKIE = "volga_session";
// На проде задайте SESSION_SECRET в окружении (Render → Environment).
// Дев-фолбэк позволяет работать локально; для боевой защиты от подделки нужен свой секрет.
const SECRET = process.env.SESSION_SECRET || "volga-dev-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function serialize(s: Session): string {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Читает и ПРОВЕРЯЕТ подпись сессии. Подделанная/битая кука → null. */
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

/** Ставит подписанную сессию. Вызывать только из Server Action / Route Handler. */
export async function setSession(s: Session): Promise<void> {
  (await cookies()).set(COOKIE, serialize(s), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Возвращает сессию, если роль входит в allowed, иначе null. */
export async function requireRole(allowed: string | string[]): Promise<Session | null> {
  const s = await getSession();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  return s && roles.includes(s.role) ? s : null;
}
