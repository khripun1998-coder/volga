export const metadata = { title: "Возврат и гарантии — Волга" };

const blocks = [
  {
    h: "Возврат",
    items: [
      "Возврат в течение 14 дней при сохранении товарного вида и упаковки.",
      "Изделия, изготовленные под заказ, возвращаются по согласованию с мастером.",
    ],
  },
  {
    h: "Если товар повреждён",
    items: [
      "Бой или повреждение при доставке компенсируются — приложите фото при обращении.",
      "Эскроу: деньги переводятся продавцу только после подтверждения, что заказ получен и в порядке.",
    ],
  },
  {
    h: "Как оформить",
    items: [
      "Напишите продавцу в чат заказа в кабинете покупателя.",
      "Если не удаётся договориться — откройте спор, его рассмотрит арбитраж площадки.",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-serif text-3xl text-[#211c4d] md:text-4xl">Возврат и гарантии</h1>
      <div className="mt-8 space-y-8">
        {blocks.map((b) => (
          <section key={b.h}>
            <h2 className="font-display text-xl font-semibold text-graphite">{b.h}</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-graphite/90">
              {b.items.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {it}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
