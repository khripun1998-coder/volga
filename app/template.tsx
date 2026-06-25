import { PageTransition } from "@/components/page-transition";

/**
 * template.tsx ремонтируется на каждом переходе → даёт enter-анимацию страниц.
 * Остаётся серверным компонентом; вся клиентская логика — в PageTransition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
