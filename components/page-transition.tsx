"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Плавное появление контента при переходе между страницами.
 * Анимируем ТОЛЬКО opacity — translate/scale на обёртке всего <main> создал бы
 * containing block и сломал бы `position: sticky` у дочерних блоков (кабинет, галерея).
 * Уважает prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
