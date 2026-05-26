import fs from "node:fs";
import path from "node:path";

// Запрос реальных тематических фото из Openverse (открытые лицензии, без API-ключа)
// и сохранение их локально в public/products/.

const productQueries: Record<string, string> = {
  "myagkiy-mishka-toptyzhka": "amigurumi teddy bear",
  "zayka-sonya-amigurumi": "amigurumi bunny",
  "slonenok-timka": "amigurumi elephant",
  "nabor-zveryata-3": "amigurumi toys",
  "keramicheskaya-kruzhka": "handmade ceramic mug",
  "tarelka-kuban-22": "handmade ceramic plate",
  "kuvshin-dlya-vody": "ceramic pitcher jug",
  "lnyanaya-skatert-vyshivka": "linen tablecloth",
  "sherstyanoy-pled-tuman": "wool knitted blanket",
  "korzina-iz-lozy": "wicker basket",
  "serebryanoe-kolco-volna": "silver ring jewelry",
  "sergi-kapli-serebro": "silver earrings",
  "kulon-pshenica": "silver pendant necklace",
  "soevaya-svecha-step": "soy candle jar",
  "aromadiffuzor-more": "reed diffuser",
  "derevyannyy-podsvechnik": "wooden candle holder",
  "kulon-yantar-baltika": "amber pendant necklace",
  "braslet-yantar": "amber bracelet",
  "sergi-yantar": "amber earrings",
  "figurka-yantar-obereg": "amber figurine",
};

const shopQueries: Record<string, string> = {
  "teplye-lapki": "crochet toys",
  "kubanskaya-glina": "pottery ceramics workshop",
  "loza-i-nit": "weaving textile",
  "serebro-kubani": "jewelry silver workshop",
  "svet-v-dome": "candles home decor",
  "baltiyskiy-yantar": "amber jewelry",
};

const UA = "volga-mvp/1.0 (demo)";
const outDir = path.join(process.cwd(), "public", "products");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

async function search(q: string): Promise<{ url?: string; thumbnail?: string }[]> {
  try {
    const res = await fetch(
      `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=16&mature=false`,
      { headers: { "User-Agent": UA } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

async function download(url: string): Promise<Buffer | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return null;
    const len = Number(r.headers.get("content-length") || "0");
    if (len > 6_000_000) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 4000) return null;
    return buf;
  } catch {
    return null;
  }
}

async function fetchInto(prefix: string, q: string, max: number): Promise<string[]> {
  const results = await search(q);
  const saved: string[] = [];
  for (const r of results) {
    if (saved.length >= max) break;
    let buf: Buffer | null = null;
    for (const c of [r.url, r.thumbnail].filter(Boolean) as string[]) {
      buf = await download(c);
      if (buf) break;
    }
    if (!buf) continue;
    const file = `${prefix}-${saved.length}.jpg`;
    fs.writeFileSync(path.join(outDir, file), buf);
    saved.push(`/products/${file}`);
  }
  return saved;
}

async function main() {
  const manifest: { products: Record<string, string[]>; shops: Record<string, string> } = {
    products: {},
    shops: {},
  };

  for (const [slug, q] of Object.entries(productQueries)) {
    manifest.products[slug] = await fetchInto(slug, q, 3);
    console.log(`product ${slug} → ${manifest.products[slug].length}`);
  }

  for (const [slug, q] of Object.entries(shopQueries)) {
    const imgs = await fetchInto(`shop-${slug}`, q, 1);
    if (imgs[0]) manifest.shops[slug] = imgs[0];
    console.log(`shop ${slug} → ${imgs.length}`);
  }

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  const okProducts = Object.values(manifest.products).filter((a) => a.length > 0).length;
  console.log(`\nИтого: товаров с фото ${okProducts}/16, магазинов ${Object.keys(manifest.shops).length}/5`);
}

main();
