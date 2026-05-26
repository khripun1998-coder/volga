import { cookies } from "next/headers";

export interface Session {
  id: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const raw = c.get("volga_session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}
