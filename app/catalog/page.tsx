import Link from "next/link";
import {
  ChevronDown,
  RotateCcw,
  Search,
  SearchX,
  Sparkles,
} from "lucide-react";
import { getCatalog, getCatalogFacets } from "@/lib/queries";
import { ProductsView } from "@/components/products-view";
import { CategoryNav } from "@/components/category-nav";
import { pluralize } from "@/lib/utils";

export const metadata = { title: "Каталог — Волга" };

type SP = { [key: string]: string | string[] | undefined };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const int = (v: string | string[] | undefined) => {
  const s = one(v);
  if (!s) return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : undefined;
};

const fieldClass =
  "h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm text-graphite transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
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
    <div className="container-page py-6">
      {/* Категории-чипсы (клик сохраняет остальные фильтры) */}
      <CategoryNav
        categories={facets.categories}
        active={filters.category}
        params={{
          q: filters.q,
          tag: filters.tag,
          city: filters.city,
          min: filters.min != null ? String(filters.min) : undefined,
          max: filters.max != null ? String(filters.max) : undefined,
          inStock: filters.inStock ? "1" : undefined,
          sort: filters.sort,
        }}
      />

      {/* Заголовок + стеклянный промо-баннер */}
      <div className="mt-6 grid items-center gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h1 className="font-serif text-[40px] leading-none text-[#211c4d] md:text-[52px]">
            Каталог
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {products.length} {pluralize(products.length, ["товар", "товара", "товаров"])} от
            талантливых мастеров
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-white/70 bg-gradient-to-br from-[#EEEBFB]/80 to-[#E7ECFE]/60 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="relative z-10 flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="max-w-[42ch] text-[14.5px] leading-relaxed text-graphite/90">
              Поддерживайте мастеров и находите уникальные вещи, сделанные с душой.
            </p>
          </div>
          {/* мягкий декор */}
          <span className="pointer-events-none absolute right-8 top-5 h-3 w-3 rounded-full bg-white/80 shadow-[0_4px_8px_rgba(120,90,140,0.2)]" />
          <span className="pointer-events-none absolute right-20 bottom-6 h-2.5 w-2.5 rounded-full bg-[#CBBEF6]" />
          <span className="pointer-events-none absolute right-4 bottom-4 h-4 w-4 rounded-full bg-[#F3B6C2]/80" />
          <span
            className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full opacity-50 blur-2xl"
            style={{ background: "#C9BEF5" }}
          />
        </div>
      </div>

      {/* Контент: фильтры + сетка */}
      <div className="mt-7 grid gap-7 lg:grid-cols-[268px_1fr]">
        {/* Фильтры */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="filters overflow-hidden rounded-[24px] border border-line bg-paper shadow-[var(--shadow-soft)]">
            <summary className="flex cursor-pointer items-center justify-between gap-2 px-5 py-4 text-sm font-semibold text-graphite">
              Фильтры
              <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.7} />
            </summary>
          <form
            method="get"
            action="/catalog"
            className="filters-body space-y-5 p-5 pt-0 md:pt-5"
          >
            <FilterGroup label="Поиск">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.7} />
                <input
                  name="q"
                  defaultValue={filters.q ?? ""}
                  placeholder="Название товара или мастера"
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </FilterGroup>

            <FilterGroup label="Категория">
              <div className="relative">
                <select name="category" defaultValue={filters.category ?? ""} className={`${fieldClass} appearance-none pr-9`}>
                  <option value="">Все категории</option>
                  {facets.categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.7} />
              </div>
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
              <div className="relative">
                <select name="city" defaultValue={filters.city ?? ""} className={`${fieldClass} appearance-none pr-9`}>
                  <option value="">Все города</option>
                  {facets.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.7} />
              </div>
            </FilterGroup>

            <FilterGroup label="Цена, ₽">
              <div className="flex items-center gap-2">
                <input type="number" name="min" defaultValue={filters.min ?? ""} placeholder={`от ${facets.minPrice}`} className={fieldClass} />
                <span className="text-muted">—</span>
                <input type="number" name="max" defaultValue={filters.max ?? ""} placeholder={`до ${facets.maxPrice}`} className={fieldClass} />
              </div>
            </FilterGroup>

            <FilterGroup label="В наличии">
              <label className="flex items-center gap-2.5 text-sm text-graphite">
                <input type="checkbox" name="inStock" value="1" defaultChecked={filters.inStock} className="h-4 w-4 accent-accent" />
                Только в наличии
              </label>
            </FilterGroup>

            <FilterGroup label="Сортировка">
              <div className="relative">
                <select name="sort" defaultValue={filters.sort ?? "new"} className={`${fieldClass} appearance-none pr-9`}>
                  {sortOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.7} />
              </div>
            </FilterGroup>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="btn-accent inline-flex h-12 w-full items-center justify-center rounded-2xl bg-accent text-sm font-semibold text-white transition"
              >
                Показать {products.length} {pluralize(products.length, ["товар", "товара", "товаров"])}
              </button>
              <Link
                href="/catalog"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-medium text-muted transition hover:bg-cream hover:text-graphite"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.7} />
                Сбросить фильтры
              </Link>
            </div>
          </form>
          </details>
        </aside>

        {/* Сетка + переключатель вида */}
        <div>
          {products.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-cream py-20 text-center">
              <SearchX className="h-9 w-9 text-muted" strokeWidth={1.4} />
              <p className="mt-4 font-medium text-graphite">Ничего не нашлось</p>
              <p className="mt-1 text-sm text-muted">Попробуйте изменить фильтры или сбросить их.</p>
              <Link
                href="/catalog"
                className="mt-5 inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-medium text-graphite transition hover:border-accent hover:text-accent"
              >
                Сбросить фильтры
              </Link>
            </div>
          ) : (
            <ProductsView products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
