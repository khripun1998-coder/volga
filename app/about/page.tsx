import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "О «Волге» — маркетплейс мастеров" };

export default function AboutPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-serif text-3xl text-[#211c4d] md:text-4xl">О «Волге»</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-graphite/90">
        <p>
          «Волга» — маркетплейс изделий ручной работы и товаров российских мастеров.
          Мы строим площадку как «соцсеть мастеров»: каждый магазин — это личный
          канал автора, где он показывает работы, общается с покупателями и собирает
          реальных клиентов.
        </p>
        <p>
          Наша цель — поддержать локальных производителей и сделать покупки у мастеров
          такими же удобными, как в крупных маркетплейсах, но с теплотой ручной работы.
          «Клиент» здесь — это человек, который реально что-то купил, а не накрученный
          подписчик: так доверие к магазину честное и видно настоящий спрос.
        </p>
        <p>Старт — Краснодарский край, далее — вся Россия и экспорт.</p>
      </div>
      <Link href="/catalog" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Открыть каталог
      </Link>
    </div>
  );
}
