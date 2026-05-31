"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ───────── Базовое появление вверх ───────── */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Stagger‑контейнер ───────── */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/* ───────── Slide‑in с заданной стороны ─────────
   Чередуем направление вьезда в ленте — карточки «приплывают» по очереди слева/справа. */
export function SlideIn({
  children,
  className,
  from = "left",
  delay = 0,
  distance = 60,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right" | "top" | "bottom";
  delay?: number;
  distance?: number;
}) {
  const offset =
    from === "left"
      ? { x: -distance, y: 0 }
      : from === "right"
        ? { x: distance, y: 0 }
        : from === "top"
          ? { x: 0, y: -distance }
          : { x: 0, y: distance };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Параллакс блока относительно скролла страницы ───────── */
export function Parallax({
  children,
  className,
  speed = 30,
}: {
  children: React.ReactNode;
  className?: string;
  /** в пикселях — насколько блок «отстаёт» от скролла */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ───────── Появление букв «вверх» ─────────
   Используется для заголовков. Принимает строку и сам разбивает её на спаны. */
export function LetterReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const letters = Array.from(text);
  return (
    <span
      className={`letter-up inline-block ${className ?? ""}`}
      aria-label={text}
      role="text"
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{ animationDelay: `${delay + i * 0.025}s` }}
          aria-hidden
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/* ───────── Magnetic hover — лёгкое притяжение элемента к курсору ─────────
   Удобно для кнопок «Открыть канал», «Подписаться». */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      {children}
    </div>
  );
}
