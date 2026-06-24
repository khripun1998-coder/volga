import { notFound } from "next/navigation";
import Image from "next/image";
import { getShopBySlug, getShopPosts } from "@/lib/queries";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function ShopJournal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  const posts = await getShopPosts(shop.id);
  const founder = shop.owner?.name ?? null;
  const initial = (founder ?? shop.name).charAt(0);

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-cream py-20 text-center">
        <p className="font-display text-xl font-semibold text-graphite">Журнал пока пуст</p>
        <p className="mt-2 text-sm text-muted">
          {founder ?? "Мастер"} ещё не публиковал записей — заглядывайте позже.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Журнал мастерской</p>
      <h2 className="font-serif mt-2 text-3xl leading-tight text-graphite md:text-[34px]">
        Как это делается
      </h2>

      <div className="mt-8 space-y-8">
        {posts.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-3xl bg-paper hairline shadow-[var(--shadow-soft)]"
          >
            {p.imageUrl && (
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.imageUrl}
                  alt={p.title ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {initial}
                </span>
                <span className="font-medium text-graphite">{founder ?? shop.name}</span>
                <span aria-hidden>·</span>
                <time>{dateFmt.format(p.createdAt)}</time>
              </div>
              {p.title && (
                <h3 className="font-serif mt-3 text-xl text-graphite">{p.title}</h3>
              )}
              <p className="mt-2 leading-relaxed text-graphite/90">{p.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
