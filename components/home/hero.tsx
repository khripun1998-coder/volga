"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductArtwork } from "@/components/product-artwork";
import { formatPrice } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const up: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export type HeroItem = {
  slug: string;
  title: string;
  price: number;
  category: string;
};

const float = {
  animate: { y: [0, -14, 0] },
};

export function Hero({ items }: { items: HeroItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yArt = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const positions = [
    "left-0 top-2 w-40 sm:w-44",
    "right-2 top-24 w-48 sm:w-56",
    "bottom-0 left-20 w-36 sm:w-40",
  ];
  const rotations = ["-3deg", "3.5deg", "-2deg"];

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#F6D6C2] opacity-50 blur-3xl" />
        <div className="animate-blob-slow absolute right-0 top-8 h-80 w-80 rounded-full bg-[#E7DBEF] opacity-50 blur-3xl" />
        <div className="animate-blob absolute -bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#DBE8D4] opacity-50 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span
            variants={up}
            className="inline-flex items-center rounded-full border border-line bg-paper/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted backdrop-blur"
          >
            Маркетплейс ручной работы
          </motion.span>
          <motion.h1
            variants={up}
            className="font-display mt-5 text-5xl font-semibold leading-[1.02] text-graphite md:text-7xl"
          >
            Красота,
            <br />
            созданная
            <span className="italic text-accent"> руками</span>
          </motion.h1>
          <motion.p
            variants={up}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            Керамика, украшения, вязаные игрушки и текстиль от мастеров России.
            Каждая вещь — единственная.
          </motion.p>
          <motion.div variants={up} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/catalog"
              className="btn-glow group inline-flex h-13 items-center gap-2 rounded-full bg-accent px-7 text-base font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              Смотреть каталог
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-13 items-center rounded-full border border-line bg-paper/60 px-7 text-base font-medium text-graphite backdrop-blur transition hover:border-accent hover:text-accent"
            >
              Открыть магазин
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yArt }}
          className="relative hidden h-[440px] md:block"
        >
          {items.slice(0, 3).map((it, i) => (
            <motion.div
              key={it.slug}
              variants={float}
              animate="animate"
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              className={`absolute ${positions[i]}`}
              style={{ rotate: rotations[i] }}
            >
              <Link
                href={`/product/${it.slug}`}
                className="block rounded-3xl border border-line/70 bg-paper/80 p-2.5 shadow-[var(--shadow-lift)] backdrop-blur transition-transform duration-300 hover:scale-[1.03]"
              >
                <ProductArtwork
                  category={it.category}
                  seed={i}
                  className="aspect-square rounded-2xl"
                />
                <div className="px-1.5 pb-1 pt-2.5">
                  <div className="truncate text-sm font-medium text-graphite">
                    {it.title}
                  </div>
                  <div className="text-sm font-semibold text-accent">
                    {formatPrice(it.price)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
