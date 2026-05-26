import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <div className="font-display text-7xl font-semibold text-accent">404</div>
        <h1 className="font-display mt-4 text-2xl font-semibold text-graphite">
          Страница не найдена
        </h1>
        <p className="mt-2 text-muted">
          Возможно, раздел ещё в разработке или ссылка устарела.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            На главную
          </Link>
          <Link
            href="/catalog"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
