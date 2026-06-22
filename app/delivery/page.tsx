export const metadata = { title: "Доставка и оплата — Волга" };

const blocks = [
  {
    h: "Способы доставки",
    items: [
      "СДЭК и Почта России — по всей стране, обычно 3–9 дней.",
      "Курьер по городу — в ряде регионов присутствия мастера.",
      "Самовывоз — из мастерской мастера (адрес и время согласует продавец).",
    ],
  },
  {
    h: "Оплата",
    items: [
      "Банковская карта, СБП и электронные кошельки.",
      "Оплата при получении — где доступно у мастера.",
      "Средства удерживаются по эскроу до подтверждения получения заказа.",
    ],
  },
  {
    h: "Сроки изготовления",
    items: [
      "Товары в наличии отправляются после подтверждения заказа.",
      "Изделия «под заказ» изготавливаются индивидуально — срок указан в карточке.",
    ],
  },
];

export default function DeliveryPage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-serif text-3xl text-[#211c4d] md:text-4xl">Доставка и оплата</h1>
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
