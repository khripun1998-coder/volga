import Link from "next/link";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { getCatalog, getCatalogFacets } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { CategoryNav } from "@/components/category-nav";
import { buttonVariants } from "@/components/ui/button";
import { pluralize } from "@/lib/utils";

export const metadata = { title: "Каталог — Волга" };

type SP = { [key: string]: string | string[] | undefined };

const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;
const int = (v: string | string[] | undefined) => {
  const s = one(v);
  if (!s) return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : undefined;
};

const fieldClass =
  "h-10 w-full rounded-lg border border-line bg-paper px-3 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      {children}
    </div>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const filters = {
    q: one(sp.q),
    category: one(sp.category),
    tag: one(sp.tag),
    city: one(sp.city),
    min: int(sp.min),
    max: int(sp.max),
    inStock: one(sp.inStock) === "1",
    sort: one(sp.sort),
  };

  const [products, facets] = await Promise.all([
    getCatalog(filters),
    getCatalogFacets(),
  ]);

  const activeCategory = facets.categories.find((c) => c.slug === filters.category);
  const title = filters.q
    ? `Поиск: «${filters.q}»`
    : activeCategory
      ? activeCategory.name
      : filters.tag === "handmade"
        ? "Ручная работа"
        : filters.tag === "russia"
          ? "Сделано в России"
          : filters.tag === "eco"
            ? "Эко-товары"
            : "Каталог";

  const tagOptions = [
    { value: "", label: "Любые" },
    { value: "handmade", label: "Ручная работа" },
    { value: "russia", label: "Сделано в России" },
    { value: "eco", label: "Эко" },
  ];
  const sortOptions = [
    { value: "new", label: "Сначала новые" },
    { value: "price_asc", label: "Сначала дешевле" },
    { value: "price_desc", label: "Сначала дороже" },
  ];

  return (
    <div className="container-page py-8">
      <CategoryNav categories={facets.categories} active={filters.category} />
      <h1 className="font-display mt-7 text-3xl font-semibold text-graphite md:text-4xl">
        {title}
      </h1>
      <p className="mt-1.5 text-muted">
        {products.length} {pluralize(products.length, ["товар", "товара", "товаров"])}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-28 md:self-start">
          <details className="filters overflow-hidden rounded-xl border border-line bg-paper" open>
            <summary className="flex items-center gap-2 px-4 py-3 font-medium text-graphite">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.6} /> Фильтры
            </summary>
            <form
              method="get"
              action="/catalog"
              className="filters-body space-y-5 px-4 pb-5 pt-1"
            >
              <FilterGroup label="Поиск">
                <input
                  name="q"
                  defaultValue={filters.q ?? ""}
                  placeholder="Название изделия…"
                  className={fieldClass}
                />
              </FilterGroup>

              <FilterGroup label="Категория">
                <select name="category" defaultValue={filters.category ?? ""} className={fieldClass}>
                  <option value="">Все категории</option>
                  {facets.categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Особенности">
                <div className="space-y-2">
                  {tagOptions.map((t) => (
                    <label key={t.value} className="flex items-center gap-2.5 text-sm text-graphite">
                      <input
                        type="radio"
                        name="tag"
                        value={t.value}
                        defaultChecked={(filters.tag ?? "") === t.value}
                        className="h-4 w-4 accent-accent"
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Город">
                <select name="city" defaultValue={filters.city ?? ""} className={fieldClass}>
                  <option value="">Все города</option>
                  {facets.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Цена, ₽">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="min"
                    defaultValue={filters.min ?? ""}
                    placeholder={String(facets.minPrice)}
                    className={fieldClass}
                  />
                  <span className="text-muted">—</span>
                  <input
                    type="number"
                    name="max"
                    defaultValue={filters.max ?? ""}
                    placeholder={String(facets.maxPrice)}
                    className={fieldClass}
                  />
                </div>
              </FilterGroup>

              <label className="flex items-center gap-2.5 text-sm text-graphite">
                <input
                  type="checkbox"
                  name="inStock"
                  value="1"
                  defaultChecked={filters.inStock}
                  className="h-4 w-4 accent-accent"
                />
                Только в наличии
              </label>

              <FilterGroup label="Сортировка">
                <select name="sort" defaultValue={filters.sort ?? "new"} className={fieldClass}>
                  {sortOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <div className="flex gap-2 pt-1">
                <button type="submit" className={buttonVariants({ size: "sm" })}>
                  Показать
                </button>
                <Link href="/catalog" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Сбросить
                </Link>
              </div>
            </form>
          </details>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-line bg-cream py-20 text-center">
              <SearchX className="h-9 w-9 text-muted" strokeWidth={1.4} />
              <p className="mt-4 font-medium text-graphite">Ничего не нашлось</p>
              <p className="mt-1 text-sm text-muted">
                Попробуйте изменить фильтры или сбросить их.
              </p>
              <Link
                href="/catalog"
                className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-5`}
              >
                Сбросить фильтры
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
