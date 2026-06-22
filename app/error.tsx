"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <div className="font-display text-6xl font-semibold text-accent">Упс</div>
        <h1 className="font-display mt-4 text-2xl font-semibold text-graphite">
          Что-то пошло не так
        </h1>
        <p className="mt-2 max-w-md text-muted">
          Произошла ошибка при загрузке раздела. Попробуйте обновить — обычно
          этого достаточно.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className={buttonVariants({ size: "lg" })}>
            Обновить
          </button>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
