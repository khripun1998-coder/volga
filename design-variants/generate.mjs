// Генератор 6 ПРИНЦИПИАЛЬНО РАЗНЫХ концепций главной «Волга».
// Одни и те же данные/блоки (категории, топ магазинов, промо, товары),
// но каждый вариант — своя архитектура главного экрана, навигации,
// подачи каталога и анимации. Вдохновение — лучшие маркетплейсы
// (Avito, eBay, Ozon, Wildberries) и витрины магазинов одежды.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "mockups");

/* ─────────────────────────── Данные (наш проект) ─────────────────────────── */
const categories = [
  { slug: "toys", name: "Игрушки и куклы", emoji: "🧸", n: 128 },
  { slug: "ceramics", name: "Керамика и посуда", emoji: "🍶", n: 214 },
  { slug: "jewelry", name: "Украшения", emoji: "💍", n: 176 },
  { slug: "textile", name: "Текстиль для дома", emoji: "🧶", n: 142 },
  { slug: "decor", name: "Декор", emoji: "🪴", n: 198 },
  { slug: "candles", name: "Свечи и аромат", emoji: "🕯️", n: 96 },
  { slug: "furniture", name: "Мебель", emoji: "🪑", n: 54 },
  { slug: "materials", name: "Сырьё и материалы", emoji: "🪵", n: 73 },
];

const shops = [
  { name: "Тёплые лапки", kind: "Мастерская", city: "Краснодар", rating: 4.9, count: 87, products: 4, verified: true, promoted: true },
  { name: "Стол-Арт", kind: "Производство", city: "Краснодар", rating: 5.0, count: 18, products: 1, verified: true, promoted: true },
  { name: "Серебро Кубани", kind: "Мастерская", city: "Краснодар", rating: 5.0, count: 21, products: 3, verified: true, promoted: false },
  { name: "Балтийский янтарь", kind: "Мастерская", city: "Калининград", rating: 4.9, count: 38, products: 4, verified: true, promoted: false },
  { name: "Кубанская глина", kind: "Мастерская", city: "Краснодар", rating: 4.8, count: 54, products: 3, verified: true, promoted: false },
  { name: "Свет в доме", kind: "Мастерская", city: "Геленджик", rating: 4.9, count: 40, products: 3, verified: true, promoted: false },
];

const products = [
  { title: "Вязаный мишка «Топтыжка»", shop: "Тёплые лапки", price: 1890, oldPrice: 2200, cat: "toys", handmade: true, eco: true, rating: 4.9, sold: 87, city: "Краснодар" },
  { title: "Зайка «Соня» амигуруми", shop: "Тёплые лапки", price: 1650, cat: "toys", handmade: true, eco: true, rating: 4.8, sold: 54, city: "Краснодар" },
  { title: "Керамическая кружка ручной работы", shop: "Кубанская глина", price: 1290, cat: "ceramics", handmade: true, eco: false, rating: 4.8, sold: 120, city: "Краснодар" },
  { title: "Тарелка «Кубань» 22 см", shop: "Кубанская глина", price: 1450, cat: "ceramics", handmade: true, eco: false, rating: 4.7, sold: 36, city: "Краснодар" },
  { title: "Кувшин для воды 1,2 л", shop: "Кубанская глина", price: 2390, cat: "ceramics", handmade: true, eco: false, rating: 4.9, sold: 22, city: "Краснодар" },
  { title: "Серебряное кольцо «Волна»", shop: "Серебро Кубани", price: 4500, cat: "jewelry", handmade: true, eco: false, rating: 5.0, sold: 41, city: "Краснодар" },
  { title: "Серьги «Капли»", shop: "Серебро Кубани", price: 3200, cat: "jewelry", handmade: true, eco: false, rating: 4.9, sold: 18, city: "Краснодар" },
  { title: "Кулон из янтаря «Балтика»", shop: "Балтийский янтарь", price: 2900, cat: "jewelry", handmade: true, eco: false, rating: 4.9, sold: 63, city: "Калининград" },
  { title: "Браслет из янтаря", shop: "Балтийский янтарь", price: 3400, cat: "jewelry", handmade: true, eco: false, rating: 4.8, sold: 29, city: "Калининград" },
  { title: "Льняная скатерть с вышивкой", shop: "Лоза и нить", price: 3490, cat: "textile", handmade: true, eco: true, rating: 4.7, sold: 33, city: "Сочи" },
  { title: "Шерстяной плед «Туман»", shop: "Лоза и нить", price: 4990, oldPrice: 5600, cat: "textile", handmade: true, eco: true, rating: 4.8, sold: 47, city: "Сочи" },
  { title: "Корзина из лозы", shop: "Лоза и нить", price: 1790, cat: "decor", handmade: true, eco: true, rating: 4.6, sold: 51, city: "Сочи" },
  { title: "Соевая свеча «Степь»", shop: "Свет в доме", price: 990, cat: "candles", handmade: true, eco: true, rating: 4.9, sold: 210, city: "Геленджик" },
  { title: "Аромадиффузор «Море»", shop: "Свет в доме", price: 1390, cat: "candles", handmade: true, eco: true, rating: 4.8, sold: 88, city: "Геленджик" },
  { title: "Деревянный подсвечник", shop: "Свет в доме", price: 1190, cat: "decor", handmade: true, eco: true, rating: 4.7, sold: 64, city: "Геленджик" },
  { title: "Стол-река из дуба и смолы", shop: "Стол-Арт", price: 89000, cat: "furniture", handmade: true, eco: false, rating: 5.0, sold: 12, city: "Краснодар" },
];

const catEmoji = Object.fromEntries(categories.map((c) => [c.slug, c.emoji]));
const price = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";

/* ─────────────────────────── Иконки ─────────────────────────── */
const I = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>`,
  chevR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><path d="M9 6l6 6-6 6"/></svg>`,
  chevD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M6 9l6 6 6-6"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="14" height="14"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2c1 3-1 5-2 6-1 1-3 3-3 6a5 5 0 0010 0c0-2-1-3-1-4 2 1 2 3 2 4a7 7 0 11-13.5-2.5C5 8 9 7 12 2z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 17.3l-5.4 3 1-6-4.4-4.3 6.1-.9L12 3l2.7 5.6 6.1.9-4.4 4.3 1 6z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>`,
};

function art(slug, t, i = 0, cls = "") {
  const [a, b] = t.art(i);
  return `<div class="art ${cls}" style="background:linear-gradient(140deg,${a},${b})"><span class="art-glow"></span><span class="art-emoji">${catEmoji[slug] ?? "✦"}</span></div>`;
}
function stars(v, color) {
  let s = "";
  for (let i = 0; i < 5; i++) s += `<span style="color:${i < Math.round(v) ? color : "color-mix(in srgb," + color + " 26%, transparent)"}">${I.star}</span>`;
  return s;
}

/* ─────────────────────────── Темы (токены + мета + спека) ─────────────────────────── */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:wght@300;400;500;600&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Unbounded:wght@500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=Pacifico&family=Marck+Script&family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">`;

const themes = [
  {
    id: "01-market", name: "Маркет", mode: "light",
    ref: "Поиск-центричный маркетплейс",
    inspiredBy: "Avito · eBay",
    desc: "Главный экран построен вокруг гигантского поиска и сетки разделов — как на больших классифайдах. Максимум доверия и быстрый путь к товару.",
    fontNote: "Manrope · акцент — деловой синий + зелёные цены",
    palette: ["#ffffff", "#eef2f7", "#2563eb", "#0b8457", "#0f1b2d"],
    spec: { "Главный экран": "Крупный поиск + категория-селект, подсказки и метрики доверия", "Навигация": "Верхняя utility-строка + город + поиск", "Каталог": "Плотная сетка 5-в-ряд, карточки с городом и рейтингом", "Анимация": "Появление подсказок, мягкий hover-lift карточек" },
    art: (i) => ([["#e7eefb", "#d4e2fb"], ["#e6f5ee", "#d3 efe0".replace(" ", "")], ["#fbeede", "#f6dcc2"]][i % 3]),
    vars: { "--bg": "#ffffff", "--surface": "#f4f7fb", "--line": "#e4e9f1", "--text": "#0f1b2d", "--muted": "#6b7790", "--accent": "#2563eb", "--accent2": "#0b8457", "--soft": "#eaf1ff", "--on": "#fff", "--badge": "#eaf1ff", "--badge-t": "#2563eb", "--display": "'Manrope',sans-serif", "--body": "'Manrope',sans-serif", "--rc": "14px", "--rb": "10px" },
  },
  {
    id: "02-vitrina", name: "Витрина", mode: "light",
    ref: "Каталог-витрина с баннером и сайдбаром",
    inspiredBy: "Ozon · Wildberries",
    desc: "Слева — дерево категорий, справа — крупный промо-баннер-слайдер, ниже — ленты «Скидки дня» и «Хиты». Плотная коммерческая витрина с акцентом на выгоду.",
    fontNote: "Plus Jakarta Sans · градиент фиолет-синий + красные скидки",
    palette: ["#ffffff", "#f3f1ff", "#7c3aed", "#ff2d55", "#1b1340"],
    spec: { "Главный экран": "Сайдбар категорий + баннер-слайдер с дотами", "Навигация": "Вертикальное дерево категорий (sticky) + поиск", "Каталог": "Горизонтальные ленты-скроллеры «Скидки дня», «Хиты»", "Анимация": "Авто-слайдер баннера, бегущий таймер акции, hover" },
    art: (i) => ([["#efe9ff", "#e0d4ff"], ["#ffe6ec", "#ffd0db"], ["#e7f0ff", "#d6e4ff"]][i % 3]),
    vars: { "--bg": "#ffffff", "--surface": "#f6f4ff", "--line": "#ece8fb", "--text": "#1b1340", "--muted": "#7b769a", "--accent": "#7c3aed", "--accent2": "#ff2d55", "--soft": "#f1ecff", "--on": "#fff", "--badge": "#ffe6ec", "--badge-t": "#ff2d55", "--display": "'Plus Jakarta Sans',sans-serif", "--body": "'Plus Jakarta Sans',sans-serif", "--rc": "16px", "--rb": "12px" },
  },
  {
    id: "03-obyom", name: "Объём", mode: "light",
    ref: "Светлый 3D-маркет с вау-эффектом",
    inspiredBy: "Avito · современные 3D-витрины",
    desc: "Светлый воздушный маркетплейс с 3D-сценой на первом экране: изделие парит в перспективе, вокруг — стеклянные чипы с ценой, рейтингом и тегами. Глубокие мягкие тени, параллакс и наклон карточек дают вау-эффект, как в современных 3D-витринах.",
    fontNote: "Plus Jakarta Sans · бело-голубой, индиго + фиолет",
    palette: ["#ffffff", "#eaeefe", "#4361ff", "#8b5cf6", "#131a2b"],
    spec: { "Главный экран": "3D-сцена: парящее изделие + стеклянные чипы вокруг", "Навигация": "Стеклянная шапка с крупным поиском-пилюлей", "Каталог": "Карточки с 3D-наклоном и многослойными тенями", "Анимация": "3D-парение, параллакс, tilt, отражения, всплытие чипов" },
    art: (i) => ([["#e7ecff", "#d3deff"], ["#e4f7f0", "#cdeee0"], ["#fdeede", "#fbdcbe"], ["#f0e9ff", "#e0d3ff"]][i % 4]),
    vars: { "--bg": "#f5f7fd", "--surface": "#ffffff", "--line": "#e7ecf7", "--text": "#131a2b", "--muted": "#6c7796", "--accent": "#4361ff", "--accent2": "#8b5cf6", "--soft": "#eaeefe", "--on": "#fff", "--badge": "#eaeefe", "--badge-t": "#4361ff", "--display": "'Plus Jakarta Sans',sans-serif", "--body": "'Plus Jakarta Sans',sans-serif", "--rc": "24px", "--rb": "999px" },
  },
  {
    id: "04-lenta", name: "Лента", mode: "light",
    ref: "Социальная лента-открытие (masonry)",
    inspiredBy: "Pinterest · Instagram Shop",
    desc: "Сторис-категории сверху и бесконечная masonry-лента товаров разной высоты — формат «листай и находи». Мобильный, лёгкий, залипательный.",
    fontNote: "Plus Jakarta Sans · мягкие пастели, роза + лаванда",
    palette: ["#ffffff", "#fbf3f7", "#ff5a8a", "#6c5ce7", "#241b2e"],
    spec: { "Главный экран": "Сторис-кружки категорий + промо-карта", "Навигация": "App-bar с поиском-пилюлей, плавающая кнопка «Продать»", "Каталог": "Masonry-лента 4 колонки, карточки разной высоты", "Анимация": "Появление лайка, сторис-кольца, мягкие тени при hover" },
    art: (i) => ([["#ffe3ee", "#ffc9dd"], ["#ece8ff", "#dcd4ff"], ["#fff0df", "#ffe0bd"], ["#e2f7ee", "#c9efdd"]][i % 4]),
    vars: { "--bg": "#ffffff", "--surface": "#fdf6f9", "--line": "#f3e7ee", "--text": "#241b2e", "--muted": "#857d92", "--accent": "#ff5a8a", "--accent2": "#6c5ce7", "--soft": "#ffeaf1", "--on": "#fff", "--badge": "#ffeaf1", "--badge-t": "#e23a72", "--display": "'Plus Jakarta Sans',sans-serif", "--body": "'Plus Jakarta Sans',sans-serif", "--rc": "22px", "--rb": "999px" },
  },
  {
    id: "05-bento", name: "Бенто", mode: "light",
    ref: "Бенто-мозаика, смелый модерн",
    inspiredBy: "Современные лендинги 2025 / Apple-style bento",
    desc: "Первый экран — асимметричная мозаика плиток: заголовок, хит, топ-магазин, промо и категории в одной композиции. Крупная типографика, высокий контраст.",
    fontNote: "Unbounded + Manrope · графит и электрик-кобальт",
    palette: ["#f4f3ee", "#ffffff", "#2b4cff", "#111114", "#e9e7df"],
    spec: { "Главный экран": "Bento-мозаика из плиток разного размера", "Навигация": "Чистая шапка с пилюлями-разделами", "Каталог": "Строгая сетка 4-в-ряд, квадратные карточки", "Анимация": "Каскадное появление плиток, magnetic-hover, счётчики" },
    art: (i) => ([["#dfe4ff", "#c7d0ff"], ["#eceadf", "#ddd9c7"], ["#ffe4d0", "#ffd0b0"]][i % 3]),
    vars: { "--bg": "#f4f3ee", "--surface": "#ffffff", "--line": "#e6e3d8", "--text": "#111114", "--muted": "#6c6a60", "--accent": "#2b4cff", "--accent2": "#111114", "--soft": "#e9ecff", "--on": "#fff", "--badge": "#e9ecff", "--badge-t": "#2b4cff", "--display": "'Unbounded',sans-serif", "--body": "'Manrope',sans-serif", "--rc": "20px", "--rb": "12px" },
  },
  {
    id: "06-eco", name: "Эко-Маркет", mode: "light",
    ref: "Тёплый природный, иммерсивный герой",
    inspiredBy: "Этичные/крафтовые маркеты, Etsy-премиум",
    desc: "Иммерсивный герой с органическими формами и «парящими» карточками, карусель категорий и блок «Истории мастеров». Тёплый, природный, с характером бренда.",
    fontNote: "Fraunces + Manrope · песок, изумруд, терракота",
    palette: ["#f4ede1", "#ffffff", "#1f6b4f", "#c4622d", "#2c2a24"],
    spec: { "Главный экран": "Иммерсивный градиент + парящие карточки изделий", "Навигация": "Лёгкая шапка, поиск-иконка, тёплый CTA", "Каталог": "Snap-карусель категорий + сетка + истории мастеров", "Анимация": "Дрейф карточек, плавающие блобы, появление снизу" },
    art: (i) => ([["#e9f0e6", "#d3e4d3"], ["#f6e7d6", "#eccfb0"], ["#e6efe9", "#cfe2d5"]][i % 3]),
    vars: { "--bg": "#f4ede1", "--surface": "#ffffff", "--line": "#e4d8c5", "--text": "#2c2a24", "--muted": "#7d7361", "--accent": "#1f6b4f", "--accent2": "#c4622d", "--soft": "#e7efe8", "--on": "#fff", "--badge": "#e7efe8", "--badge-t": "#1f6b4f", "--display": "'Fraunces',serif", "--body": "'Manrope',sans-serif", "--rc": "18px", "--rb": "999px" },
  },
];
// фикс случайных артефактов в art-пейре варианта 1
themes[0].art = (i) => ([["#e7eefb", "#d4e2fb"], ["#e6f5ee", "#d3efe0"], ["#fbeede", "#f6dcc2"]][i % 3]);

/* ─────────────────────────── Базовый CSS (общий минимум) ─────────────────────────── */
function baseCss(t) {
  const v = Object.entries(t.vars).map(([k, val]) => `${k}:${val}`).join(";");
  return `
  *{box-sizing:border-box;margin:0;padding:0}
  :root{${v}}
  html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  body{background:var(--bg);color:var(--text);font-family:var(--body);font-size:16px;line-height:1.5;min-width:1280px;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1240px;margin-inline:auto;padding-inline:28px}
  .art{position:relative;width:100%;height:100%;display:grid;place-items:center;overflow:hidden}
  .art-emoji{font-size:54px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.16));z-index:2}
  .art-glow{position:absolute;width:62%;height:62%;border-radius:999px;background:rgba(255,255,255,.34);filter:blur(34px)}
  .badge{font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;background:var(--badge);color:var(--badge-t)}
  .eco{background:rgba(31,107,79,.14);color:#2f7d5b}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;border:none;font-family:var(--body);font-weight:700;font-size:14px}
  .btn-p{background:var(--accent);color:var(--on);height:46px;padding:0 22px;border-radius:var(--rb)}
  .btn-o{background:transparent;color:var(--text);height:46px;padding:0 22px;border-radius:var(--rb);border:1px solid var(--line)}
  .rise{opacity:0;transform:translateY(16px);animation:rise .7s cubic-bezier(.22,1,.36,1) forwards}
  @keyframes rise{to{opacity:1;transform:none}}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes drift{0%,100%{transform:translateY(0) rotate(var(--r,0))}50%{transform:translateY(-18px) rotate(var(--r,0))}}
  @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(26px,-22px) scale(1.08)}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  ${variantCss[t.id] || ""}

  /* ── Рукописное лого «Волга» (брашевая подпись, по референсу клиента) ── */
  .m-logo,.vi-logo,.ob-logo,.le-logo,.be-logo,.ec-logo,.ftr-logo{
    font-family:'Pacifico','Marck Script','Caveat',cursive !important;
    font-weight:400 !important;text-transform:none !important;letter-spacing:.005em !important;
    line-height:1;display:inline-block;padding-bottom:4px}
  .m-logo{font-size:32px}
  .m-logo span{font-family:var(--body) !important;font-weight:600 !important;letter-spacing:.22em !important;line-height:1;margin-top:2px}
  .vi-logo{font-size:34px}
  .ob-logo{font-size:34px}
  .le-logo{font-size:33px}
  .be-logo{font-size:32px}
  .ec-logo{font-size:34px}
  .ftr-logo{font-size:32px;padding-bottom:6px}
  `;
}

/* ─────────────────────────── Общий подвал ─────────────────────────── */
function footer(t) {
  const cols = [
    ["Покупателям", ["Каталог", "Ручная работа", "Сделано в России", "Корзина"]],
    ["Продавцам", ["Открыть магазин", "Тарифы", "Кабинет продавца"]],
    ["Площадка", ["О Волге", "Доставка и оплата", "Возврат и гарантии"]],
  ];
  return `<footer class="ftr"><div class="wrap"><div class="ftr-grid">
    <div><div class="ftr-logo">Волга</div><p class="ftr-ab">Маркетплейс изделий ручной работы и товаров российских мастеров. Поддержите локальных производителей.</p><div class="ftr-loc">Краснодар · Калининград</div></div>
    ${cols.map(([h, ls]) => `<div><h4>${h}</h4><ul>${ls.map((l) => `<li><a>${l}</a></li>`).join("")}</ul></div>`).join("")}
  </div><div class="ftr-bot"><span>© 2026 Волга</span><span>Оплата при получении · Перевод · Самовывоз</span></div></div></footer>`;
}

/* ════════════════════════════ ВАРИАНТ 1 — МАРКЕТ ════════════════════════════ */
function v1(t) {
  const chips = ["Вязаные игрушки", "Керамика", "Серебро 925°", "Свечи", "Янтарь", "Лён"];
  return `
  <div class="m-util"><div class="wrap m-util-in"><span>${I.pin} Краснодар</span><div class="m-util-r"><a>Помощь</a><a>Доставка</a><a>Стать продавцом</a></div></div></div>
  <header class="m-hdr"><div class="wrap m-hdr-in">
    <a class="m-logo">Волга<span>маркетплейс</span></a>
    <div class="m-search"><button class="m-cat">${I.grid} Все категории ${I.chevD}</button><input placeholder="Поиск среди 1 081 изделия от мастеров России…"><button class="m-go">${I.search} Найти</button></div>
    <div class="m-acts"><span class="m-act">${I.heart}<i>Избранное</i></span><span class="m-act">${I.user}<i>Войти</i></span><span class="m-act">${I.bag}<i>Корзина</i></span></div>
  </div></header>
  <section class="m-hero"><div class="wrap m-hero-in">
    <h1 class="rise">Покупайте и продавайте <span>изделия ручной работы</span></h1>
    <p class="rise" style="animation-delay:.08s">Всё, что сделано в России руками мастеров — в одном месте. От вязаных игрушек до мебели из массива.</p>
    <div class="m-chips rise" style="animation-delay:.16s"><span class="m-chips-l">Часто ищут:</span>${chips.map((c) => `<a class="m-chip">${c}</a>`).join("")}</div>
    <div class="m-trust rise" style="animation-delay:.24s"><span>${I.check} Проверенные мастера</span><span>${I.check} Безопасная сделка</span><span>${I.check} Доставка по РФ</span><span>${I.check} 6 000+ изделий</span></div>
  </div></section>
  <section class="wrap m-cats">
    ${categories.map((c, i) => `<a class="m-cat-tile rise" style="animation-delay:${0.03 * i}s">${art(c.slug, t, i, "m-cat-art")}<div><div class="mc-n">${c.name}</div><div class="mc-c">${c.n} объявл.</div></div></a>`).join("")}
  </section>
  <section class="wrap m-feed">
    <div class="m-feed-head"><h2>Рекомендации для вас</h2><a class="m-link">Смотреть все ${I.arrow}</a></div>
    <div class="m-grid">${products.slice(0, 10).map((p, i) => mCard(p, t, i)).join("")}</div>
  </section>
  <section class="wrap m-shops">
    <div class="m-feed-head"><h2>Топ магазинов площадки</h2><a class="m-link">Все магазины ${I.arrow}</a></div>
    <div class="m-shops-row">${shops.slice(0, 5).map((s, i) => `<a class="m-shop"><span class="m-rank">${i + 1}</span><span class="m-shop-av">${s.name[0]}</span><div class="m-shop-meta"><div class="m-shop-n">${s.name} ${s.verified ? `<i class="vf">${I.check}</i>` : ""}</div><div class="m-shop-s">${stars(s.rating, "var(--accent2)")} <b>${s.rating.toFixed(1)}</b> · ${s.products} тов.</div><div class="m-shop-c">${I.pin} ${s.city}</div></div></a>`).join("")}</div>
  </section>
  ${footer(t)}`;
}
function mCard(p, t, i) {
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  return `<a class="m-card"><div class="m-ph">${art(p.cat, t, i)}<span class="m-fav">${I.heart}</span>${disc ? `<span class="m-disc">−${disc}%</span>` : ""}</div>
  <div class="m-pr">${price(p.price)}${p.oldPrice ? `<s>${price(p.oldPrice)}</s>` : ""}</div>
  <div class="m-tt">${p.title}</div>
  <div class="m-rt">${I.star} ${p.rating.toFixed(1)} <span>· ${p.sold} продано</span></div>
  <div class="m-ci">${I.pin} ${p.city}</div></a>`;
}

/* ════════════════════════════ ВАРИАНТ 2 — ВИТРИНА ════════════════════════════ */
function v2(t) {
  const deals = products.filter((p) => p.oldPrice || p.price < 2000).slice(0, 6);
  const hits = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);
  return `
  <header class="vi-hdr"><div class="wrap vi-hdr-in">
    <a class="vi-logo">Волга</a>
    <button class="vi-catbtn">${I.grid} Каталог</button>
    <div class="vi-search"><input placeholder="Искать товары, бренды и магазины"><button>${I.search}</button></div>
    <div class="vi-acts"><span>${I.user}</span><span>${I.heart}</span><span class="vi-bag">${I.bag}<i>2</i></span></div>
  </div></header>
  <div class="wrap vi-main">
    <aside class="vi-side">
      <div class="vi-side-h">${I.grid} Категории</div>
      ${categories.map((c, idx) => `<a class="vi-cat ${idx === 0 ? "on" : ""}"><span>${c.emoji} ${c.name}</span>${I.chevR}</a>`).join("")}
    </aside>
    <div class="vi-content">
      <div class="vi-banner">
        <div class="vi-slide rise">
          <div class="vi-slide-tx"><span class="vi-tag">${I.fire} Распродажа недели</span><h2>До −30% на изделия ручной работы</h2><p>Сотни товаров от проверенных мастеров России. Дарим бесплатную доставку от 3 000 ₽.</p><button class="btn btn-p">Перейти в каталог ${I.arrow}</button></div>
          <div class="vi-slide-art">${art("ceramics", t, 0)}</div>
        </div>
        <div class="vi-dots"><i class="on"></i><i></i><i></i><i></i></div>
      </div>
      <div class="vi-mini"><a class="vi-mini-c" style="background:linear-gradient(120deg,#7c3aed,#a855f7)"><b>Новинки</b><span>свежие поступления</span></a><a class="vi-mini-c" style="background:linear-gradient(120deg,#ff2d55,#ff6b8a)"><b>Скидки дня</b><span>каждый день новое</span></a><a class="vi-mini-c" style="background:linear-gradient(120deg,#0ea5e9,#22d3ee)"><b>Сделано в России</b><span>с гарантией</span></a></div>

      <div class="vi-strip">
        <div class="vi-strip-h"><h3>${I.fire} Скидки дня</h3><span class="vi-timer">до конца акции 12:45:09</span><a class="vi-all">Все ${I.chevR}</a></div>
        <div class="vi-row">${deals.map((p, i) => viCard(p, t, i, true)).join("")}</div>
      </div>
      <div class="vi-strip">
        <div class="vi-strip-h"><h3>⭐ Хиты продаж</h3><a class="vi-all">Все ${I.chevR}</a></div>
        <div class="vi-row">${hits.map((p, i) => viCard(p, t, i + 6, false)).join("")}</div>
      </div>
    </div>
  </div>
  ${footer(t)}`;
}
function viCard(p, t, i, deal) {
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : (deal ? 15 : null);
  const old = p.oldPrice || (deal ? Math.round(p.price * 1.18) : null);
  return `<div class="vi-card"><div class="vi-ph">${art(p.cat, t, i)}<span class="vi-fav">${I.heart}</span>${disc ? `<span class="vi-disc">−${disc}%</span>` : ""}</div>
  <div class="vi-price"><b>${price(p.price)}</b>${old ? `<s>${price(old)}</s>` : ""}</div>
  <div class="vi-tt">${p.title}</div>
  <div class="vi-rt">${stars(p.rating, "#ffb400")} <span>${p.sold}</span></div>
  <button class="vi-buy">В корзину</button></div>`;
}

/* ════════════════════════════ ВАРИАНТ 3 — БУТИК ════════════════════════════ */
function v3(t) {
  const hero = products[0], coll = [categories[1], categories[2], categories[3]];
  return `
  <header class="bo-hdr"><div class="wrap bo-hdr-in">
    <nav class="bo-nav l"><a>Каталог</a><a>Магазины</a><a>Коллекции</a></nav>
    <a class="bo-logo">Волга</a>
    <nav class="bo-nav r"><a>${I.search}</a><a>${I.user}</a><a class="bo-bag">${I.bag}</a></nav>
  </div></header>
  <section class="bo-hero"><div class="wrap bo-hero-in">
    <div class="bo-hero-tx">
      <span class="bo-kick rise">Маркетплейс ручной работы · Сделано в России</span>
      <h1 class="rise" style="animation-delay:.1s">Вещи,<br>созданные<br><span>руками</span></h1>
      <p class="rise" style="animation-delay:.2s">Керамика, серебро, текстиль и мебель от лучших мастеров страны. Каждое изделие — единственное в своём роде.</p>
      <div class="bo-cta rise" style="animation-delay:.3s"><button class="btn btn-p">Открыть каталог ${I.arrow}</button><a class="bo-link">Стать продавцом</a></div>
      <div class="bo-stats rise" style="animation-delay:.4s"><div><b>200+</b><span>мастеров</span></div><div><b>6 000+</b><span>изделий</span></div><div><b>4.9</b><span>средний рейтинг</span></div></div>
    </div>
    <div class="bo-hero-art"><div class="bo-feat">${art(hero.cat, t, 0)}<div class="bo-feat-cap"><span>${hero.shop}</span><b>${hero.title}</b><i>${price(hero.price)}</i></div></div><span class="bo-feat-badge">Выбор редакции</span></div>
  </div></section>
  <section class="wrap bo-coll">
    <div class="bo-sec-h"><h2>Коллекции</h2><a class="bo-link">Все разделы ${I.arrow}</a></div>
    <div class="bo-coll-g">${coll.map((c, i) => `<a class="bo-coll-c">${art(c.slug, t, i, "bo-coll-art")}<div class="bo-coll-cap"><span>0${i + 1}</span><b>${c.name}</b><i>${c.n} изделий →</i></div></a>`).join("")}</div>
  </section>
  <section class="wrap bo-prods">
    <div class="bo-sec-h"><h2>Избранное</h2><a class="bo-link">Весь каталог ${I.arrow}</a></div>
    <div class="bo-grid">${products.slice(2, 8).map((p, i) => `<a class="bo-card"><div class="bo-ph">${art(p.cat, t, i)}<span class="bo-fav">${I.heart}</span></div><div class="bo-card-b"><div class="bo-card-s">${p.shop}</div><div class="bo-card-t">${p.title}</div><div class="bo-card-p">${price(p.price)}</div></div></a>`).join("")}</div>
  </section>
  <section class="bo-story"><div class="wrap bo-story-in"><div class="bo-story-art">${art("toys", t, 0)}</div><div class="bo-story-tx"><span class="bo-kick">История мастера</span><h2>«Тёплые лапки»</h2><p>Марина из Краснодара вяжет игрушки, которые становятся друзьями на годы. Каждый зверёк рождается вручную — от первой петли до вышитой улыбки.</p><a class="bo-link">Перейти в магазин ${I.arrow}</a></div></div></section>
  ${footer(t)}`;
}

/* ════════════════════════════ ВАРИАНТ 4 — ЛЕНТА ════════════════════════════ */
function v4(t) {
  const heights = [320, 250, 380, 290, 340, 230, 300, 360, 270, 330, 240, 350, 300, 260, 320, 280];
  return `
  <header class="le-hdr"><div class="wrap le-hdr-in">
    <a class="le-logo">Волга</a>
    <div class="le-search">${I.search}<input placeholder="Найти изделие или мастера"></div>
    <div class="le-acts"><span>${I.bell}</span><span>${I.heart}</span><span class="le-av">А</span></div>
  </div></header>
  <section class="wrap le-stories">
    ${[{ e: "✨", n: "Для вас" }, ...categories].slice(0, 9).map((c, i) => `<a class="le-story"><span class="le-ring ${i === 0 ? "hot" : ""}"><span class="le-st-em">${c.e || c.emoji}</span></span><i>${c.n || c.name.split(" ")[0]}</i></a>`).join("")}
  </section>
  <section class="wrap le-promo rise">
    <div class="le-promo-tx"><span class="badge">Новое на Волге</span><h1>Листай и находи то,<br>что сделано с душой</h1><p>Тысячи изделий ручной работы от мастеров России — в одной ленте.</p><button class="btn btn-p">Смотреть ленту ${I.arrow}</button></div>
    <div class="le-promo-art"><span class="le-pa a">${art("ceramics", t, 0)}</span><span class="le-pa b">${art("jewelry", t, 1)}</span><span class="le-pa c">${art("toys", t, 2)}</span></div>
  </section>
  <section class="wrap le-feedwrap">
    <div class="le-feed-h"><h2>Лента изделий</h2><div class="le-tabs"><a class="on">Популярное</a><a>Новинки</a><a>Рядом с вами</a></div></div>
    <div class="le-masonry">${products.concat(products.slice(0, 4)).map((p, i) => leCard(p, t, i, heights[i % heights.length])).join("")}</div>
  </section>
  <button class="le-fab">${I.plus} Продать</button>
  ${footer(t)}`;
}
function leCard(p, t, i, h) {
  return `<a class="le-card" style="animation-delay:${(i % 8) * 0.04}s"><div class="le-ph" style="height:${h}px">${art(p.cat, t, i)}<span class="le-fav">${I.heart}</span>${p.eco ? `<span class="le-eco">🌿 Эко</span>` : ""}</div>
  <div class="le-b"><div class="le-t">${p.title}</div><div class="le-row"><b>${price(p.price)}</b><span class="le-shop">${p.shop}</span></div></div></a>`;
}

/* ════════════════════════════ ВАРИАНТ 5 — БЕНТО ════════════════════════════ */
function v5(t) {
  return `
  <header class="be-hdr"><div class="wrap be-hdr-in">
    <a class="be-logo">Волга</a>
    <nav class="be-nav"><a class="on">Каталог</a><a>Магазины</a><a>Ручная работа</a><a>Сделано в России</a></nav>
    <div class="be-acts"><span>${I.search}</span><span>${I.heart}</span><button class="btn be-cta">Открыть магазин ${I.arrow}</button></div>
  </div></header>
  <section class="wrap be-bento">
    <a class="be-t be-hero rise">
      <span class="be-kick">Маркетплейс ручной работы</span>
      <h1>Красота, созданная руками</h1>
      <p>Изделия мастеров России — керамика, украшения, текстиль, мебель.</p>
      <span class="be-hero-cta">Смотреть каталог ${I.arrow}</span>
      <span class="be-hero-blob"></span>
    </a>
    <a class="be-t be-feat rise" style="animation-delay:.06s"><div class="be-feat-art">${art("furniture", t, 0)}</div><div class="be-feat-cap"><span class="badge">Хит · ${products[15].sold} продано</span><b>${products[15].title}</b><i>${price(products[15].price)}</i></div></a>
    <a class="be-t be-shop rise" style="animation-delay:.12s"><span class="be-shop-av">Т</span><div><b>Тёплые лапки</b><span>${stars(4.9, "#ffb400")} 4.9</span></div><span class="be-shop-tag">Топ-магазин</span></a>
    <a class="be-t be-promo rise" style="animation-delay:.18s"><b>Продавайте<br>на Волге</b><span>бесплатный старт →</span></a>
    <a class="be-t be-stat rise" style="animation-delay:.24s"><b>6 000+</b><span>изделий от мастеров</span></a>
    ${categories.slice(0, 3).map((c, i) => `<a class="be-t be-cat rise" style="animation-delay:${0.3 + i * 0.05}s">${art(c.slug, t, i, "be-cat-art")}<span>${c.name}</span></a>`).join("")}
  </section>
  <section class="wrap be-prods">
    <div class="be-sec-h"><h2>Популярные изделия</h2><a class="be-link">Весь каталог ${I.arrow}</a></div>
    <div class="be-grid">${products.slice(0, 8).map((p, i) => `<a class="be-card"><div class="be-ph">${art(p.cat, t, i)}${p.handmade ? `<span class="be-badge">Ручная работа</span>` : ""}<span class="be-fav">${I.heart}</span></div><div class="be-cb"><div class="be-ct">${p.title}</div><div class="be-cs">${p.shop}</div><div class="be-cp">${price(p.price)}</div></div></a>`).join("")}</div>
  </section>
  ${footer(t)}`;
}

/* ════════════════════════════ ВАРИАНТ 6 — ЭКО-МАРКЕТ ════════════════════════════ */
function v6(t) {
  const makers = [
    { n: "Тёплые лапки", c: "Краснодар", q: "Вяжу игрушки, которые становятся друзьями", cat: "toys" },
    { n: "Серебро Кубани", c: "Краснодар", q: "Каждое кольцо — отсылка к реке и морю", cat: "jewelry" },
    { n: "Свет в доме", c: "Геленджик", q: "Соевые свечи со сдержанным южным ароматом", cat: "candles" },
  ];
  return `
  <header class="ec-hdr"><div class="wrap ec-hdr-in">
    <a class="ec-logo">Волга</a>
    <nav class="ec-nav"><a>Каталог</a><a>Категории</a><a>Магазины</a><a>Мастерам</a></nav>
    <div class="ec-acts"><span>${I.search}</span><span>${I.heart}</span><button class="btn btn-p">Открыть магазин</button></div>
  </div></header>
  <section class="ec-hero">
    <span class="ec-blob a"></span><span class="ec-blob b"></span>
    <div class="wrap ec-hero-in">
      <div class="ec-hero-tx">
        <span class="ec-kick rise">🌿 Сделано в России · руками мастеров</span>
        <h1 class="rise" style="animation-delay:.1s">Красота,<br>созданная <span>руками</span></h1>
        <p class="rise" style="animation-delay:.2s">Маркетплейс изделий ручной работы: керамика, украшения, вязаные игрушки, текстиль и мебель от мастеров со всей страны.</p>
        <div class="ec-cta rise" style="animation-delay:.3s"><button class="btn btn-p">Смотреть каталог ${I.arrow}</button><a class="ec-link">Как это работает</a></div>
        <div class="ec-tags rise" style="animation-delay:.4s"><span>🧶 Ручная работа</span><span>🌱 Эко-материалы</span><span>🛡️ Безопасная сделка</span></div>
      </div>
      <div class="ec-hero-art">
        <span class="ec-fc a">${art("ceramics", t, 0)}<i>Кружка · 1 290 ₽</i></span>
        <span class="ec-fc b">${art("toys", t, 1)}<i>Мишка · 1 890 ₽</i></span>
        <span class="ec-fc c">${art("jewelry", t, 2)}<i>Кольцо · 4 500 ₽</i></span>
      </div>
    </div>
  </section>
  <section class="wrap ec-cats">
    <div class="ec-sec-h"><h2>Категории</h2><a class="ec-link">Все ${I.arrow}</a></div>
    <div class="ec-carousel">${categories.map((c, i) => `<a class="ec-cat">${art(c.slug, t, i, "ec-cat-art")}<div class="ec-cat-b"><b>${c.name}</b><span>${c.n} изделий</span></div></a>`).join("")}</div>
  </section>
  <section class="ec-makers"><div class="wrap">
    <div class="ec-sec-h"><h2>Истории мастеров</h2><a class="ec-link">Все мастера ${I.arrow}</a></div>
    <div class="ec-makers-g">${makers.map((m, i) => `<div class="ec-maker">${art(m.cat, t, i, "ec-maker-art")}<div class="ec-maker-b"><div class="ec-maker-h"><span class="ec-maker-av">${m.n[0]}</span><div><b>${m.n}</b><i>${I.pin} ${m.c}</i></div></div><p>«${m.q}»</p></div></div>`).join("")}</div>
  </div></section>
  <section class="wrap ec-prods">
    <div class="ec-sec-h"><h2>Рекомендации для вас</h2><a class="ec-link">Смотреть все ${I.arrow}</a></div>
    <div class="ec-grid">${products.slice(0, 8).map((p, i) => `<a class="ec-card"><div class="ec-ph">${art(p.cat, t, i)}<span class="ec-fav">${I.heart}</span><div class="ec-bd">${p.handmade ? `<span class="badge">Ручная работа</span>` : ""}${p.eco ? `<span class="badge eco">Эко</span>` : ""}</div></div><div class="ec-cb"><div class="ec-ct">${p.title}</div><div class="ec-cs">${p.shop}</div><div class="ec-cp">${price(p.price)}</div></div></a>`).join("")}</div>
  </section>
  ${footer(t)}`;
}

/* ВАРИАНТ 03 — ОБЪЁМ (светлый 3D-маркет, вау-эффект) */
function v3light(t) {
  const hero = products[0], show = products[15];
  return `
  <header class="ob-hdr"><div class="wrap ob-hdr-in">
    <a class="ob-logo">Волга</a>
    <nav class="ob-nav"><a class="on">Каталог</a><a>Магазины</a><a>Ручная работа</a><a>Сделано в России</a></nav>
    <div class="ob-search">${I.search}<input placeholder="Поиск изделий и мастеров"></div>
    <div class="ob-acts"><span>${I.heart}</span><span>${I.bag}</span><button class="btn btn-p ob-cta">Открыть магазин</button></div>
  </div></header>

  <section class="ob-hero">
    <span class="ob-blob a"></span><span class="ob-blob b"></span><span class="ob-grid-bg"></span>
    <div class="wrap ob-hero-in">
      <div class="ob-hero-tx">
        <span class="ob-kick rise">✦ Маркетплейс ручной работы</span>
        <h1 class="rise" style="animation-delay:.08s">Изделия мастеров —<br><span>как будто в руках</span></h1>
        <p class="rise" style="animation-delay:.16s">Тысячи товаров ручной работы со всей России. Рассматривайте в 3D: крутите, приближайте, разглядывайте каждую деталь перед покупкой.</p>
        <div class="ob-cta-row rise" style="animation-delay:.24s"><button class="btn btn-p">Смотреть каталог ${I.arrow}</button><a class="ob-link">Как это работает ${I.arrow}</a></div>
        <div class="ob-trust rise" style="animation-delay:.32s"><span>${I.check} Безопасная сделка</span><span>${I.check} Доставка по РФ</span><span>${I.check} Проверенные мастера</span></div>
      </div>
      <div class="ob-stage">
        <span class="ob-floor"></span>
        <div class="ob-3d">
          <div class="ob-node ob-main"><div class="fl"><div class="ob-main-card">${art(hero.cat, t, 0)}<div class="ob-main-cap"><span>${hero.shop}</span><b>${hero.title}</b><i>${price(hero.price)}</i></div></div></div></div>
          <div class="ob-node ob-c1"><div class="fl"><span class="ob-chip">${I.star} 4.9 · 87 отзывов</span></div></div>
          <div class="ob-node ob-c2"><div class="fl"><span class="ob-chip ob-chip-a">🧶 Ручная работа</span></div></div>
          <div class="ob-node ob-c3"><div class="fl"><span class="ob-chip">${I.check} В наличии · 6 шт</span></div></div>
          <div class="ob-node ob-c4"><div class="fl"><span class="ob-mini">${art("ceramics", t, 1)}</span></div></div>
          <div class="ob-node ob-c5"><div class="fl"><span class="ob-mini">${art("jewelry", t, 2)}</span></div></div>
        </div>
      </div>
    </div>
  </section>

  <section class="wrap ob-cats">
    <div class="ob-sec-h"><h2>Категории</h2><a class="ob-link">Все ${I.arrow}</a></div>
    <div class="ob-cats-g">${categories.map((c) => `<a class="ob-ctile"><span class="ob-ctile-em">${c.emoji}</span><span class="ob-ctile-n">${c.name}</span><span class="ob-ctile-c">${c.n} изделий</span></a>`).join("")}</div>
  </section>

  <section class="ob-show"><div class="wrap ob-show-in">
    <div class="ob-show-stage">
      <span class="ob-floor b"></span>
      <div class="ob-3d">
        <div class="ob-node ob-show-main"><div class="fl"><div class="ob-main-card big">${art(show.cat, t, 0)}</div></div></div>
        <div class="ob-node ob-sc1"><div class="fl"><span class="ob-chip">🪵 Массив дуба</span></div></div>
        <div class="ob-node ob-sc2"><div class="fl"><span class="ob-chip">💧 Эпоксидная «река»</span></div></div>
        <div class="ob-node ob-sc3"><div class="fl"><span class="ob-chip ob-chip-a">${I.star} 5.0</span></div></div>
      </div>
    </div>
    <div class="ob-show-tx">
      <span class="ob-kick">3D-просмотр товаров</span>
      <h2>Видно каждую деталь</h2>
      <p>Каждое изделие можно покрутить и приблизить прямо в карточке — фактуру дерева, плетение, блеск серебра. Меньше вопросов, больше уверенности при покупке.</p>
      <div class="ob-show-pts"><span>${I.check} Интерактивный 3D-просмотр</span><span>${I.check} Прослеживаемость материалов</span><span>${I.check} Реальные фото и видео от мастера</span></div>
      <button class="btn btn-p">Открыть товар ${I.arrow}</button>
    </div>
  </div></section>

  <section class="wrap ob-prods">
    <div class="ob-sec-h"><h2>Рекомендации для вас</h2><a class="ob-link">Смотреть все ${I.arrow}</a></div>
    <div class="ob-grid">${products.slice(0, 8).map((p, i) => obCard(p, t, i)).join("")}</div>
  </section>

  <section class="wrap ob-shops">
    <div class="ob-sec-h"><h2>Топ магазинов</h2><a class="ob-link">Все магазины ${I.arrow}</a></div>
    <div class="ob-shops-row">${shops.slice(0, 5).map((s, i) => `<a class="ob-shop"><span class="ob-shop-r">${i + 1}</span><span class="ob-shop-av">${s.name[0]}</span><div><div class="ob-shop-n">${s.name} ${s.verified ? `<i class="vf">${I.check}</i>` : ""}</div><div class="ob-shop-s">${I.star} ${s.rating.toFixed(1)} · ${s.products} тов.</div></div></a>`).join("")}</div>
  </section>
  ${footer(t)}`;
}
function obCard(p, t, i) {
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  return `<a class="ob-card"><div class="ob-ph">${art(p.cat, t, i)}<span class="ob-fav">${I.heart}</span>${disc ? `<span class="ob-disc">−${disc}%</span>` : ""}${p.handmade ? `<span class="ob-tag">Ручная работа</span>` : ""}</div>
  <div class="ob-cb"><div class="ob-ct">${p.title}</div><div class="ob-cs">${p.shop}</div><div class="ob-cp">${price(p.price)}${p.oldPrice ? `<s>${price(p.oldPrice)}</s>` : ""}</div></div></a>`;
}

const renderers = { "01-market": v1, "02-vitrina": v2, "03-obyom": v3light, "04-lenta": v4, "05-bento": v5, "06-eco": v6 };

/* ─────────────────────────── CSS по вариантам ─────────────────────────── */
const variantCss = {};

variantCss["01-market"] = `
.ftr{margin-top:56px;border-top:1px solid var(--line);background:var(--surface)}
.m-util{background:#0f1b2d;color:#cdd6e6;font-size:12.5px}
.m-util-in{display:flex;justify-content:space-between;height:38px;align-items:center}
.m-util-in span{display:inline-flex;align-items:center;gap:6px}.m-util-r{display:flex;gap:22px}.m-util-r a{color:#cdd6e6}
.m-hdr{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.m-hdr-in{display:flex;align-items:center;gap:22px;height:74px}
.m-logo{font-weight:800;font-size:26px;color:var(--accent);display:flex;flex-direction:column;line-height:1}
.m-logo span{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);font-weight:600}
.m-search{flex:1;display:flex;height:50px;border:2px solid var(--accent);border-radius:12px;overflow:hidden}
.m-cat{display:flex;align-items:center;gap:7px;padding:0 16px;background:var(--soft);color:var(--accent);font-weight:700;font-size:14px;border:none;border-right:1px solid #d9e4fb;cursor:pointer}
.m-search input{flex:1;border:none;outline:none;padding:0 16px;font-size:15px;font-family:var(--body)}
.m-go{display:flex;align-items:center;gap:8px;padding:0 24px;background:var(--accent);color:#fff;border:none;font-weight:700;font-size:14px;cursor:pointer}
.m-acts{display:flex;gap:20px}
.m-act{display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--text);font-size:11px}.m-act i{font-style:normal;color:var(--muted)}
.m-hero{background:linear-gradient(180deg,var(--soft),#fff)}
.m-hero-in{padding:46px 0 30px}
.m-hero h1{font-size:46px;font-weight:800;letter-spacing:-.02em;max-width:780px;line-height:1.06}.m-hero h1 span{color:var(--accent)}
.m-hero p{margin-top:14px;font-size:17px;color:var(--muted);max-width:560px}
.m-chips{margin-top:22px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.m-chips-l{color:var(--muted);font-size:13px}
.m-chip{background:#fff;border:1px solid var(--line);padding:8px 15px;border-radius:999px;font-size:13px;font-weight:600;box-shadow:0 1px 2px rgba(15,27,45,.04)}
.m-trust{margin-top:24px;display:flex;gap:26px;flex-wrap:wrap}.m-trust span{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;color:var(--text)}.m-trust svg{color:var(--accent2)}
.m-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding-top:34px}
.m-cat-tile{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px}
.m-cat-art{width:56px;height:56px;border-radius:12px;flex:0 0 56px}.m-cat-art .art-emoji{font-size:28px}
.mc-n{font-weight:700;font-size:15px}.mc-c{font-size:12.5px;color:var(--muted);margin-top:2px}
.m-feed{padding-top:42px}
.m-feed-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.m-feed-head h2{font-size:26px;font-weight:800}.m-link{color:var(--accent);font-weight:700;font-size:14px;display:inline-flex;gap:6px;align-items:center}
.m-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.m-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px;display:block}
.m-ph{position:relative;aspect-ratio:1/1;border-radius:10px;overflow:hidden;margin-bottom:10px}
.m-fav{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center;color:#0f1b2d}
.m-disc{position:absolute;top:8px;left:8px;background:var(--accent2);color:#fff;font-size:12px;font-weight:800;padding:3px 8px;border-radius:8px}
.m-pr{font-size:19px;font-weight:800}.m-pr s{font-size:12px;color:var(--muted);font-weight:500;margin-left:6px}
.m-tt{font-size:13.5px;margin-top:4px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:35px}
.m-rt{display:flex;align-items:center;gap:4px;font-size:12.5px;font-weight:700;margin-top:6px;color:#caa300}.m-rt span{color:var(--muted);font-weight:500}
.m-ci{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);margin-top:4px}
.m-shops{padding-top:42px}
.m-shops-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.m-shop{position:relative;display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 14px}
.m-rank{position:absolute;top:-8px;left:-8px;width:26px;height:26px;border-radius:999px;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px}
.m-shop-av{width:46px;height:46px;border-radius:12px;background:var(--soft);color:var(--accent);display:grid;place-items:center;font-weight:800;font-size:20px}
.m-shop-n{font-weight:700;font-size:14px;display:flex;align-items:center;gap:5px}.vf{color:var(--accent)}
.m-shop-s{font-size:12px;color:var(--muted);margin-top:3px}.m-shop-s b{color:var(--text)}.m-shop-s svg{width:11px;height:11px}
.m-shop-c{font-size:12px;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:4px}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:44px 0 28px}
.ftr-logo{font-weight:800;font-size:22px;color:var(--accent)}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.5}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:18px 0;font-size:12px;color:var(--muted)}
`;

variantCss["02-vitrina"] = `
.ftr{margin-top:48px;border-top:1px solid var(--line);background:var(--surface)}
.vi-hdr{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.vi-hdr-in{display:flex;align-items:center;gap:18px;height:70px}
.vi-logo{font-weight:800;font-size:26px;color:var(--accent)}
.vi-catbtn{display:flex;align-items:center;gap:8px;background:linear-gradient(120deg,var(--accent),#9b5cf0);color:#fff;border:none;height:46px;padding:0 20px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer}
.vi-search{flex:1;display:flex;height:46px}
.vi-search input{flex:1;border:2px solid var(--accent);border-right:none;border-radius:12px 0 0 12px;padding:0 16px;outline:none;font-family:var(--body);font-size:15px}
.vi-search button{width:54px;background:var(--accent);color:#fff;border:none;border-radius:0 12px 12px 0;display:grid;place-items:center;cursor:pointer}
.vi-acts{display:flex;gap:16px;align-items:center;color:var(--text)}
.vi-bag{position:relative}.vi-bag i{position:absolute;top:-6px;right:-8px;background:var(--accent2);color:#fff;font-size:10px;font-weight:800;width:16px;height:16px;border-radius:999px;display:grid;place-items:center;font-style:normal}
.vi-main{display:grid;grid-template-columns:248px 1fr;gap:22px;padding-top:22px;align-items:start}
.vi-side{background:#fff;border:1px solid var(--line);border-radius:16px;padding:8px;position:sticky;top:84px}
.vi-side-h{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px;padding:12px 12px 10px}
.vi-cat{display:flex;align-items:center;justify-content:space-between;padding:11px 12px;border-radius:10px;font-size:14px;color:var(--text)}
.vi-cat svg{color:var(--muted)}.vi-cat.on,.vi-cat:hover{background:var(--soft);color:var(--accent);font-weight:700}
.vi-banner{position:relative}
.vi-slide{display:grid;grid-template-columns:1.3fr .9fr;gap:20px;background:linear-gradient(120deg,#efe9ff,#fbeef3);border:1px solid var(--line);border-radius:20px;overflow:hidden;padding:34px 0 34px 38px;align-items:center}
.vi-tag{display:inline-flex;align-items:center;gap:7px;background:var(--accent2);color:#fff;font-weight:700;font-size:13px;padding:6px 13px;border-radius:999px}
.vi-slide-tx h2{font-size:34px;font-weight:800;margin:14px 0 10px;letter-spacing:-.01em;line-height:1.08}
.vi-slide-tx p{color:var(--muted);max-width:380px;margin-bottom:20px}
.vi-slide-art{height:200px}.vi-slide-art .art{border-radius:18px 0 0 18px}.vi-slide-art .art-emoji{font-size:96px}
.vi-dots{position:absolute;bottom:16px;left:38px;display:flex;gap:7px}.vi-dots i{width:8px;height:8px;border-radius:999px;background:#cdbdf2}.vi-dots i.on{width:24px;background:var(--accent)}
.vi-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px}
.vi-mini-c{color:#fff;border-radius:16px;padding:18px 20px;display:flex;flex-direction:column}.vi-mini-c b{font-size:18px;font-weight:800}.vi-mini-c span{font-size:13px;opacity:.9;margin-top:2px}
.vi-strip{margin-top:26px;background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px 20px}
.vi-strip-h{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.vi-strip-h h3{font-size:21px;font-weight:800}
.vi-timer{background:#fff0f3;color:var(--accent2);font-weight:800;font-size:13px;padding:5px 12px;border-radius:8px;font-variant-numeric:tabular-nums}
.vi-all{margin-left:auto;color:var(--accent);font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:4px}
.vi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
.vi-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:9px}
.vi-ph{position:relative;aspect-ratio:1/1;border-radius:10px;overflow:hidden;margin-bottom:9px}.vi-ph .art-emoji{font-size:46px}
.vi-fav{position:absolute;top:7px;right:7px;width:28px;height:28px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center}
.vi-disc{position:absolute;top:7px;left:7px;background:var(--accent2);color:#fff;font-size:11px;font-weight:800;padding:3px 7px;border-radius:7px}
.vi-price{display:flex;align-items:baseline;gap:6px}.vi-price b{font-size:17px;font-weight:800;color:var(--accent2)}.vi-price s{font-size:11px;color:var(--muted)}
.vi-tt{font-size:12.5px;line-height:1.3;margin-top:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:33px}
.vi-rt{display:flex;align-items:center;gap:5px;margin-top:5px;font-size:11.5px;color:var(--muted)}.vi-rt svg{width:10px;height:10px}
.vi-buy{width:100%;margin-top:9px;background:var(--soft);color:var(--accent);border:none;height:34px;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:42px 0 26px}
.ftr-logo{font-weight:800;font-size:22px;color:var(--accent)}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.5}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:18px 0;font-size:12px;color:var(--muted)}
`;

variantCss["03-boutique"] = `
.ftr{margin-top:0;border-top:1px solid var(--line);background:#14100d}
.bo-hdr{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.bo-hdr-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:72px}
.bo-nav{display:flex;gap:26px}.bo-nav.r{justify-content:flex-end}.bo-nav a{font-size:13px;letter-spacing:.04em;color:var(--muted)}.bo-nav a:hover{color:var(--text)}
.bo-logo{text-align:center;font-family:var(--display);font-size:26px;font-weight:700;letter-spacing:.22em}
.bo-hero-in{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;padding:60px 0 72px}
.bo-kick{display:inline-block;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent2)}
.bo-hero-tx h1{font-family:var(--display);font-size:84px;font-weight:600;line-height:.98;letter-spacing:-.01em;margin:18px 0}.bo-hero-tx h1 span{font-style:italic;color:var(--accent)}
.bo-hero-tx p{color:var(--muted);max-width:400px;font-size:16px;line-height:1.6}
.bo-cta{display:flex;align-items:center;gap:20px;margin-top:30px}
.bo-link{color:var(--accent2);font-weight:600;font-size:14px;display:inline-flex;align-items:center;gap:6px;border-bottom:1px solid color-mix(in srgb,var(--accent2) 40%,transparent);padding-bottom:2px}
.bo-stats{display:flex;gap:40px;margin-top:44px}.bo-stats b{font-family:var(--display);font-size:30px;color:var(--accent2);display:block}.bo-stats span{font-size:12px;color:var(--muted)}
.bo-hero-art{position:relative}
.bo-feat{position:relative;border-radius:14px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.7);animation:floaty 7s ease-in-out infinite}
.bo-feat .art{height:440px}.bo-feat .art-emoji{font-size:150px}
.bo-feat-cap{position:absolute;left:0;right:0;bottom:0;padding:26px 24px;background:linear-gradient(transparent,rgba(0,0,0,.7))}
.bo-feat-cap span{font-size:12px;color:#d9c4ab;letter-spacing:.08em;text-transform:uppercase}.bo-feat-cap b{display:block;font-family:var(--display);font-size:24px;color:#fff;margin:4px 0}.bo-feat-cap i{font-style:normal;color:var(--accent2);font-weight:600}
.bo-feat-badge{position:absolute;top:18px;right:18px;background:var(--accent);color:#1a1512;font-size:11px;font-weight:700;padding:7px 13px;border-radius:999px;letter-spacing:.04em}
.bo-sec-h{display:flex;justify-content:space-between;align-items:flex-end;margin:18px 0 22px}.bo-sec-h h2{font-family:var(--display);font-size:34px;font-weight:600}
.bo-coll{padding-top:50px}
.bo-coll-g{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.bo-coll-c{border-radius:12px;overflow:hidden;position:relative}.bo-coll-art{height:300px}.bo-coll-art .art-emoji{font-size:96px}
.bo-coll-cap{position:absolute;inset:auto 0 0 0;padding:22px;background:linear-gradient(transparent,rgba(0,0,0,.62))}
.bo-coll-cap span{font-family:var(--display);font-size:14px;color:var(--accent2)}.bo-coll-cap b{display:block;font-family:var(--display);font-size:23px;color:#fff;margin-top:3px}.bo-coll-cap i{font-style:normal;font-size:13px;color:#cbb89f}
.bo-prods{padding-top:56px}
.bo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.bo-card{display:block}
.bo-ph{position:relative;border-radius:10px;overflow:hidden;aspect-ratio:4/5}.bo-ph .art-emoji{font-size:90px}
.bo-fav{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:999px;background:rgba(0,0,0,.3);backdrop-filter:blur(6px);display:grid;place-items:center;color:#fff;border:1px solid rgba(255,255,255,.18)}
.bo-card-b{padding-top:14px}.bo-card-s{font-size:12px;color:var(--accent2);letter-spacing:.04em}.bo-card-t{font-family:var(--display);font-size:19px;margin:3px 0}.bo-card-p{font-weight:600;color:var(--text)}
.bo-story{margin-top:60px;background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.bo-story-in{display:grid;grid-template-columns:.85fr 1.15fr;gap:48px;align-items:center;padding:0}
.bo-story-art{height:380px}.bo-story-art .art-emoji{font-size:130px}
.bo-story-tx{padding:40px 0}.bo-story-tx h2{font-family:var(--display);font-size:40px;font-weight:600;margin:8px 0 14px}.bo-story-tx p{color:var(--muted);max-width:440px;line-height:1.7;margin-bottom:18px}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:54px 0 30px}
.ftr-logo{font-family:var(--display);font-weight:700;font-size:24px;letter-spacing:.12em}.ftr-ab{font-size:13px;color:var(--muted);margin-top:12px;max-width:280px;line-height:1.6}.ftr-loc{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-top:14px}
.ftr h4{font-size:13px;margin-bottom:14px;letter-spacing:.04em}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:10px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:22px 0;font-size:12px;color:var(--muted)}
`;

variantCss["04-lenta"] = `
.ftr{margin-top:40px;border-top:1px solid var(--line);background:var(--surface)}
.le-hdr{background:rgba(255,255,255,.86);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.le-hdr-in{display:flex;align-items:center;gap:20px;height:68px}
.le-logo{font-weight:800;font-size:25px;color:var(--accent)}
.le-search{flex:1;max-width:520px;display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:0 18px;height:46px;color:var(--muted)}
.le-search input{flex:1;border:none;background:none;outline:none;font-family:var(--body);font-size:15px;color:var(--text)}
.le-acts{display:flex;align-items:center;gap:16px;margin-left:auto;color:var(--text)}
.le-av{width:38px;height:38px;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;display:grid;place-items:center;font-weight:800}
.le-stories{display:flex;gap:22px;padding-top:24px;overflow:hidden}
.le-story{display:flex;flex-direction:column;align-items:center;gap:8px;flex:0 0 auto}
.le-ring{width:72px;height:72px;border-radius:999px;padding:3px;background:var(--line);display:grid;place-items:center}
.le-ring.hot{background:linear-gradient(135deg,var(--accent),var(--accent2))}
.le-st-em{width:100%;height:100%;border-radius:999px;background:#fff;display:grid;place-items:center;font-size:30px;border:2px solid #fff}
.le-story i{font-style:normal;font-size:12px;font-weight:600;color:var(--text)}
.le-promo{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:center;margin-top:26px;background:linear-gradient(120deg,#fff0f5,#f1ecff);border:1px solid var(--line);border-radius:30px;padding:40px 0 40px 44px;overflow:hidden}
.le-promo-tx h1{font-size:44px;font-weight:800;letter-spacing:-.02em;line-height:1.06;margin:14px 0 12px}
.le-promo-tx p{color:var(--muted);max-width:380px;margin-bottom:20px}
.le-promo-art{position:relative;height:230px}
.le-pa{position:absolute;width:150px;height:150px;border-radius:26px;overflow:hidden;box-shadow:0 24px 50px -22px rgba(108,92,231,.5)}
.le-pa .art-emoji{font-size:64px}
.le-pa.a{left:20px;top:40px;transform:rotate(-8deg);animation:floaty 6s ease-in-out infinite}
.le-pa.b{left:150px;top:0;transform:rotate(5deg);z-index:2;animation:floaty 7s ease-in-out infinite .4s}
.le-pa.c{left:250px;top:70px;transform:rotate(-4deg);animation:floaty 6.5s ease-in-out infinite .2s}
.le-feedwrap{padding-top:36px}
.le-feed-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.le-feed-h h2{font-size:26px;font-weight:800}
.le-tabs{display:flex;gap:8px}.le-tabs a{padding:8px 16px;border-radius:999px;font-size:13.5px;font-weight:700;color:var(--muted);background:var(--surface)}.le-tabs a.on{background:var(--text);color:#fff}
.le-masonry{column-count:4;column-gap:18px}
.le-card{display:inline-block;width:100%;margin-bottom:18px;break-inside:avoid;background:#fff;border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 10px 30px -20px rgba(36,27,46,.3);opacity:0;animation:rise .6s cubic-bezier(.22,1,.36,1) forwards}
.le-ph{position:relative;overflow:hidden}.le-ph .art{position:absolute;inset:0}.le-ph .art-emoji{font-size:64px}
.le-fav{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--accent);box-shadow:0 4px 10px rgba(0,0,0,.12)}
.le-eco{position:absolute;top:12px;left:12px;background:rgba(255,255,255,.92);font-size:11px;font-weight:700;padding:5px 10px;border-radius:999px;color:#2f7d5b}
.le-b{padding:14px 16px 16px}
.le-t{font-size:14.5px;font-weight:600;line-height:1.3}
.le-row{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.le-row b{font-size:17px;font-weight:800}.le-shop{font-size:12px;color:var(--muted)}
.le-fab{position:fixed;right:30px;bottom:30px;z-index:30;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;height:52px;padding:0 24px;border-radius:999px;font-weight:800;font-size:15px;box-shadow:0 18px 40px -14px rgba(255,90,138,.7);cursor:pointer}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:42px 0 26px}
.ftr-logo{font-weight:800;font-size:22px;color:var(--accent)}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.5}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:18px 0;font-size:12px;color:var(--muted)}
`;

variantCss["05-bento"] = `
.ftr{margin-top:48px;border-top:1px solid var(--line);background:var(--surface)}
.be-hdr{background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.be-hdr-in{display:flex;align-items:center;gap:24px;height:74px}
.be-logo{font-family:var(--display);font-weight:700;font-size:24px}
.be-nav{display:flex;gap:6px;margin-left:10px}.be-nav a{padding:9px 16px;border-radius:999px;font-size:14px;font-weight:600;color:var(--muted)}.be-nav a.on{background:var(--text);color:#fff}
.be-acts{margin-left:auto;display:flex;align-items:center;gap:14px;color:var(--text)}
.be-cta{background:var(--accent);color:#fff;height:44px;padding:0 20px;border-radius:12px;font-weight:700}
.be-bento{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:160px;gap:16px;padding-top:26px}
.be-t{border-radius:24px;overflow:hidden;position:relative;border:1px solid var(--line);background:var(--surface)}
.be-hero{grid-column:span 2;grid-row:span 2;background:var(--accent);color:#fff;padding:34px;display:flex;flex-direction:column;border:none}
.be-hero .be-kick{font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.85;font-weight:700}
.be-hero h1{font-family:var(--display);font-size:46px;font-weight:700;line-height:1.02;margin:14px 0 12px;letter-spacing:-.01em}
.be-hero p{opacity:.92;max-width:330px;font-size:15px}
.be-hero-cta{margin-top:auto;display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--accent);align-self:flex-start;padding:12px 20px;border-radius:12px;font-weight:800;font-size:14px}
.be-hero-blob{position:absolute;right:-50px;bottom:-50px;width:220px;height:220px;border-radius:999px;background:rgba(255,255,255,.16);animation:blob 16s ease-in-out infinite}
.be-feat{grid-column:span 2;grid-row:span 2;padding:0;display:flex;flex-direction:column}
.be-feat-art{flex:1;min-height:0}.be-feat-art .art-emoji{font-size:120px}
.be-feat-cap{padding:18px 22px}.be-feat-cap b{display:block;font-size:18px;font-weight:700;margin:8px 0 2px}.be-feat-cap i{font-style:normal;font-weight:800;font-size:18px;color:var(--accent)}
.be-shop{grid-column:span 2;display:flex;align-items:center;gap:14px;padding:22px}
.be-shop-av{width:54px;height:54px;border-radius:16px;background:var(--soft);color:var(--accent);display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:24px}
.be-shop b{font-size:17px;font-weight:700}.be-shop span{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:5px}.be-shop svg{width:12px;height:12px}
.be-shop-tag{margin-left:auto;align-self:flex-start;background:var(--soft);color:var(--accent);font-size:11px;font-weight:800;padding:6px 11px;border-radius:999px}
.be-promo{grid-column:span 1;grid-row:span 1;background:var(--text);color:#fff;padding:22px;display:flex;flex-direction:column;justify-content:space-between;border:none}
.be-promo b{font-size:19px;font-weight:800;line-height:1.1}.be-promo span{font-size:13px;opacity:.8}
.be-stat{grid-column:span 1;padding:22px;display:flex;flex-direction:column;justify-content:center}.be-stat b{font-family:var(--display);font-size:32px;font-weight:700;color:var(--accent)}.be-stat span{font-size:12.5px;color:var(--muted);margin-top:4px}
.be-cat{grid-column:span 1;padding:0;display:flex;flex-direction:column;justify-content:flex-end}
.be-cat-art{position:absolute;inset:0}.be-cat-art .art-emoji{font-size:54px}
.be-cat span{position:relative;z-index:2;margin:14px;font-weight:700;font-size:14px;background:rgba(255,255,255,.86);align-self:flex-start;padding:6px 12px;border-radius:999px}
.be-prods{padding-top:46px}
.be-sec-h{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px}.be-sec-h h2{font-family:var(--display);font-size:28px;font-weight:700}.be-link{color:var(--accent);font-weight:700;font-size:14px}
.be-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.be-card{background:var(--surface);border:1px solid var(--line);border-radius:20px;overflow:hidden}
.be-ph{position:relative;aspect-ratio:1/1}.be-ph .art-emoji{font-size:64px}
.be-badge{position:absolute;top:10px;left:10px;background:rgba(255,255,255,.92);font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px}
.be-fav{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--text)}
.be-cb{padding:14px 16px 16px}.be-ct{font-size:14px;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.be-cs{font-size:12px;color:var(--muted);margin-top:3px}.be-cp{font-weight:800;font-size:16px;margin-top:6px}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:44px 0 28px}
.ftr-logo{font-family:var(--display);font-weight:700;font-size:22px}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.5}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:18px 0;font-size:12px;color:var(--muted)}
`;

variantCss["06-eco"] = `
.ftr{margin-top:0;border-top:1px solid var(--line);background:var(--surface)}
.ec-hdr{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 84%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.ec-hdr-in{display:flex;align-items:center;gap:26px;height:74px}
.ec-logo{font-family:var(--display);font-weight:600;font-size:27px;color:var(--accent)}
.ec-nav{display:flex;gap:26px;margin-left:6px}.ec-nav a{font-size:14.5px;color:var(--text)}
.ec-acts{margin-left:auto;display:flex;align-items:center;gap:16px;color:var(--text)}
.ec-hero{position:relative;overflow:hidden}
.ec-blob{position:absolute;border-radius:999px;filter:blur(50px);z-index:0}
.ec-blob.a{width:420px;height:420px;background:#bfe0cd;opacity:.6;left:-120px;top:-120px;animation:blob 20s ease-in-out infinite}
.ec-blob.b{width:360px;height:360px;background:#f0cfa8;opacity:.55;right:-90px;top:60px;animation:blob 26s ease-in-out infinite}
.ec-hero-in{position:relative;z-index:2;display:grid;grid-template-columns:1.05fr .95fr;gap:30px;align-items:center;padding:56px 0 64px}
.ec-kick{display:inline-block;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:600;padding:7px 14px;border-radius:999px;color:var(--accent)}
.ec-hero-tx h1{font-family:var(--display);font-size:74px;font-weight:500;line-height:1;letter-spacing:-.01em;margin:18px 0}.ec-hero-tx h1 span{color:var(--accent);font-style:italic}
.ec-hero-tx p{color:var(--muted);max-width:430px;font-size:17px;line-height:1.6}
.ec-cta{display:flex;align-items:center;gap:18px;margin-top:28px}
.ec-link{color:var(--accent2);font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:6px}
.ec-tags{display:flex;gap:10px;margin-top:26px;flex-wrap:wrap}.ec-tags span{background:#fff;border:1px solid var(--line);padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600}
.ec-hero-art{position:relative;height:440px}
.ec-fc{position:absolute;width:188px;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 30px 60px -26px rgba(31,107,79,.45);padding-bottom:8px}
.ec-fc .art{height:170px}.ec-fc i{font-style:normal;display:block;font-size:13px;font-weight:700;padding:10px 12px 0}
.ec-fc.a{left:0;top:30px;transform:rotate(-5deg);--r:-5deg;animation:drift 7s ease-in-out infinite}
.ec-fc.b{right:10px;top:0;transform:rotate(4deg);--r:4deg;z-index:3;animation:drift 8s ease-in-out infinite .5s}
.ec-fc.c{left:90px;bottom:0;transform:rotate(-3deg);--r:-3deg;animation:drift 7.5s ease-in-out infinite .25s}
.ec-sec-h{display:flex;justify-content:space-between;align-items:flex-end;margin:0 0 20px}.ec-sec-h h2{font-family:var(--display);font-size:32px;font-weight:500}
.ec-cats{padding-top:48px}
.ec-carousel{display:flex;gap:16px;overflow:hidden}
.ec-cat{flex:0 0 188px;border:1px solid var(--line);background:#fff;border-radius:18px;overflow:hidden}
.ec-cat-art{height:130px}.ec-cat-art .art-emoji{font-size:54px}
.ec-cat-b{padding:14px 16px}.ec-cat-b b{font-size:15px;font-weight:700}.ec-cat-b span{display:block;font-size:12.5px;color:var(--muted);margin-top:2px}
.ec-makers{margin-top:56px;background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:48px 0}
.ec-makers-g{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.ec-maker{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:var(--bg)}
.ec-maker-art{height:160px}.ec-maker-art .art-emoji{font-size:70px}
.ec-maker-b{padding:18px 20px}
.ec-maker-h{display:flex;align-items:center;gap:12px}
.ec-maker-av{width:42px;height:42px;border-radius:999px;background:var(--soft);color:var(--accent);display:grid;place-items:center;font-weight:800;font-size:18px}
.ec-maker-h b{font-size:15px}.ec-maker-h i{font-style:normal;font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:4px}
.ec-maker p{margin-top:12px;font-family:var(--display);font-size:18px;font-style:italic;color:var(--text);line-height:1.4}
.ec-prods{padding-top:52px}
.ec-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.ec-card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden}
.ec-ph{position:relative;aspect-ratio:4/5}.ec-ph .art-emoji{font-size:64px}
.ec-fav{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--accent)}
.ec-bd{position:absolute;left:12px;bottom:12px;display:flex;gap:6px;flex-wrap:wrap}
.ec-cb{padding:14px 16px 16px}.ec-ct{font-size:14.5px;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.ec-cs{font-size:12.5px;color:var(--muted);margin-top:3px}.ec-cp{font-weight:700;font-size:17px;margin-top:6px;color:var(--accent)}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:48px 0 28px}
.ftr-logo{font-family:var(--display);font-weight:600;font-size:24px;color:var(--accent)}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.6}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:20px 0;font-size:12px;color:var(--muted)}
`;

variantCss["03-obyom"] = `
.ftr{margin-top:56px;border-top:1px solid var(--line);background:var(--surface)}
.ob-hdr{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.72);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.ob-hdr-in{display:flex;align-items:center;gap:22px;height:74px}
.ob-logo{color:var(--accent)}
.ob-nav{display:flex;gap:6px;margin-left:8px}
.ob-nav a{padding:9px 15px;border-radius:999px;font-size:14px;font-weight:600;color:var(--muted)}
.ob-nav a.on{background:var(--soft);color:var(--accent)}
.ob-search{flex:1;max-width:280px;display:flex;align-items:center;gap:9px;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:0 16px;height:44px;color:var(--muted);box-shadow:0 6px 18px -12px rgba(40,50,90,.4)}
.ob-search input{flex:1;border:none;outline:none;background:none;font-family:var(--body);font-size:14px;color:var(--text)}
.ob-acts{margin-left:auto;display:flex;align-items:center;gap:14px;color:var(--text)}
.ob-cta{height:44px;color:#fff;background:linear-gradient(120deg,var(--accent),var(--accent2));box-shadow:0 14px 30px -12px rgba(67,97,255,.6)}

.ob-hero{position:relative;overflow:hidden}
.ob-blob{position:absolute;border-radius:999px;filter:blur(60px);z-index:0}
.ob-blob.a{width:480px;height:480px;background:#c9d6ff;opacity:.7;left:-140px;top:-170px;animation:blob 22s ease-in-out infinite}
.ob-blob.b{width:420px;height:420px;background:#e6d6ff;opacity:.7;right:-130px;top:10px;animation:blob 28s ease-in-out infinite}
.ob-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(67,97,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(67,97,255,.05) 1px,transparent 1px);background-size:38px 38px;-webkit-mask-image:radial-gradient(120% 80% at 72% 32%,#000,transparent 70%);mask-image:radial-gradient(120% 80% at 72% 32%,#000,transparent 70%);z-index:0}
.ob-hero-in{position:relative;z-index:2;display:grid;grid-template-columns:1.02fr .98fr;gap:30px;align-items:center;padding:54px 0 72px}
.ob-kick{display:inline-block;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:700;padding:7px 14px;border-radius:999px;color:var(--accent);box-shadow:0 8px 20px -12px rgba(40,50,90,.35)}
.ob-hero-tx h1{font-size:62px;font-weight:800;letter-spacing:-.025em;line-height:1.04;margin:18px 0}
.ob-hero-tx h1 span{background:linear-gradient(100deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.ob-hero-tx p{color:var(--muted);max-width:440px;font-size:17px;line-height:1.6}
.ob-cta-row{display:flex;align-items:center;gap:18px;margin-top:26px}
.ob-cta-row .btn-p{color:#fff;background:linear-gradient(120deg,var(--accent),var(--accent2));box-shadow:0 18px 36px -14px rgba(67,97,255,.6)}
.ob-link{color:var(--accent2);font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:6px}
.ob-trust{display:flex;gap:18px;margin-top:26px;flex-wrap:wrap}
.ob-trust span{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--text)}.ob-trust svg{color:#16a36a}

.ob-stage{position:relative;height:480px;perspective:1500px;perspective-origin:55% 42%}
.ob-floor{position:absolute;left:52%;bottom:56px;width:300px;height:70px;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(67,97,255,.4),transparent);filter:blur(22px);z-index:0}
.ob-floor.b{left:42%}
.ob-3d{position:absolute;inset:0;transform-style:preserve-3d}
.ob-node{position:absolute;transform-style:preserve-3d}
.ob-node>.fl{animation:floaty var(--d,7s) ease-in-out infinite}
.ob-main{left:50%;top:50%;transform:translate(-50%,-50%) rotateY(-17deg) rotateX(7deg)}
.ob-main-card{width:300px;background:#fff;border:1px solid var(--line);border-radius:26px;padding:14px;box-shadow:0 50px 90px -34px rgba(40,50,90,.5),0 14px 30px -14px rgba(40,50,90,.3)}
.ob-main-card .art{height:248px;border-radius:18px}.ob-main-card .art-emoji{font-size:104px}
.ob-main-cap{padding:14px 8px 6px}.ob-main-cap span{font-size:12px;color:var(--muted)}.ob-main-cap b{display:block;font-size:17px;font-weight:700;margin:3px 0}.ob-main-cap i{font-style:normal;font-weight:800;font-size:18px;color:var(--accent)}
.ob-chip{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.82);backdrop-filter:blur(10px);border:1px solid #fff;border-radius:14px;padding:11px 15px;font-size:13px;font-weight:700;color:var(--text);box-shadow:0 26px 50px -22px rgba(40,50,90,.5);white-space:nowrap}
.ob-chip svg{color:#ffb400}
.ob-chip.ob-chip-a{background:linear-gradient(120deg,var(--accent),var(--accent2));color:#fff;border:none}
.ob-mini{display:block;width:96px;height:96px;border-radius:20px;overflow:hidden;border:3px solid #fff;box-shadow:0 26px 50px -20px rgba(40,50,90,.5)}
.ob-mini .art-emoji{font-size:40px}
.ob-c1{left:-10px;top:64px;transform:translateZ(110px)}.ob-c1>.fl{--d:6s}
.ob-c2{right:-16px;top:128px;transform:translateZ(140px)}.ob-c2>.fl{--d:7.5s;animation-delay:.6s}
.ob-c3{left:34px;bottom:74px;transform:translateZ(90px)}.ob-c3>.fl{--d:6.6s;animation-delay:.3s}
.ob-c4{right:4px;top:0;transform:translateZ(60px) rotate(6deg)}.ob-c4>.fl{--d:8s;animation-delay:.2s}
.ob-c5{left:-4px;bottom:0;transform:translateZ(40px) rotate(-6deg)}.ob-c5>.fl{--d:7.2s;animation-delay:.5s}

.ob-sec-h{display:flex;justify-content:space-between;align-items:flex-end;margin:0 0 22px}.ob-sec-h h2{font-size:30px;font-weight:800;letter-spacing:-.01em}
.ob-cats{padding-top:48px}
.ob-cats-g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;perspective:1100px}
.ob-ctile{position:relative;display:flex;flex-direction:column;gap:5px;background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:0 18px 40px -28px rgba(40,50,90,.45);transform:rotateX(5deg);transform-style:preserve-3d}
.ob-ctile-em{font-size:40px;transform:translateZ(26px);filter:drop-shadow(0 12px 14px rgba(40,50,90,.28))}
.ob-ctile-n{font-weight:700;font-size:15px;margin-top:6px}
.ob-ctile-c{font-size:12.5px;color:var(--muted)}
.ob-ctile:nth-child(4n+1){background:linear-gradient(160deg,#eef2ff,#fff)}
.ob-ctile:nth-child(4n+2){background:linear-gradient(160deg,#eafaf3,#fff)}
.ob-ctile:nth-child(4n+3){background:linear-gradient(160deg,#fdf0e6,#fff)}
.ob-ctile:nth-child(4n){background:linear-gradient(160deg,#f3edff,#fff)}

.ob-show{margin-top:60px;background:linear-gradient(180deg,#eaeefe,#f7f8fe);border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden}
.ob-show-in{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;padding:56px 0}
.ob-show-stage{position:relative;height:360px;perspective:1400px;perspective-origin:45% 45%}
.ob-show-main{left:42%;top:50%;transform:translate(-50%,-50%) rotateY(16deg) rotateX(6deg)}.ob-show-main>.fl{--d:7.5s}
.ob-main-card.big{width:330px}.ob-main-card.big .art{height:280px}
.ob-sc1{left:46%;top:24px;transform:translateZ(120px)}.ob-sc1>.fl{--d:6.4s}
.ob-sc2{left:52%;bottom:34px;transform:translateZ(150px)}.ob-sc2>.fl{--d:7.2s;animation-delay:.4s}
.ob-sc3{left:6%;top:96px;transform:translateZ(90px)}.ob-sc3>.fl{--d:6.8s;animation-delay:.2s}
.ob-show-tx h2{font-size:38px;font-weight:800;letter-spacing:-.01em;margin:10px 0 14px}
.ob-show-tx p{color:var(--muted);max-width:440px;line-height:1.65;font-size:16px}
.ob-show-pts{display:flex;flex-direction:column;gap:10px;margin:20px 0 24px}
.ob-show-pts span{display:inline-flex;align-items:center;gap:9px;font-size:14px;font-weight:600}.ob-show-pts svg{color:var(--accent)}

.ob-prods{padding-top:56px}
.ob-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.ob-card{background:var(--surface);border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 20px 44px -30px rgba(40,50,90,.45)}
.ob-ph{position:relative;aspect-ratio:1/1}.ob-ph .art-emoji{font-size:64px}
.ob-fav{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--accent);box-shadow:0 6px 14px -6px rgba(40,50,90,.4)}
.ob-disc{position:absolute;top:12px;left:12px;background:linear-gradient(120deg,var(--accent),var(--accent2));color:#fff;font-size:12px;font-weight:800;padding:4px 9px;border-radius:999px}
.ob-tag{position:absolute;bottom:12px;left:12px;background:rgba(255,255,255,.92);font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px}
.ob-cb{padding:14px 16px 16px}.ob-ct{font-size:14.5px;font-weight:700;line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.ob-cs{font-size:12.5px;color:var(--muted);margin-top:3px}.ob-cp{font-weight:800;font-size:17px;margin-top:7px}.ob-cp s{font-size:12px;color:var(--muted);font-weight:500;margin-left:6px}

.ob-shops{padding-top:56px}
.ob-shops-row{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.ob-shop{position:relative;display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;box-shadow:0 18px 40px -30px rgba(40,50,90,.4)}
.ob-shop-r{position:absolute;top:-8px;left:-8px;width:26px;height:26px;border-radius:999px;background:linear-gradient(120deg,var(--accent),var(--accent2));color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px}
.ob-shop-av{width:46px;height:46px;border-radius:14px;background:var(--soft);color:var(--accent);display:grid;place-items:center;font-weight:800;font-size:20px}
.ob-shop-n{font-weight:700;font-size:14px;display:flex;align-items:center;gap:5px}.ob-shop-n .vf{color:var(--accent)}
.ob-shop-s{font-size:12.5px;color:var(--muted);margin-top:3px;display:flex;align-items:center;gap:5px}.ob-shop-s svg{width:11px;height:11px;color:#ffb400}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px;padding:46px 0 28px}
.ftr-logo{color:var(--accent)}.ftr-ab{font-size:13px;color:var(--muted);margin-top:10px;max-width:280px;line-height:1.5}.ftr-loc{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:12px}
.ftr h4{font-size:14px;margin-bottom:12px}.ftr ul{list-style:none;display:flex;flex-direction:column;gap:9px}.ftr a{font-size:13.5px;color:var(--muted)}
.ftr-bot{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:18px 0;font-size:12px;color:var(--muted)}
`;

/* ─────────────────────────── Сборка ─────────────────────────── */
function pageHtml(t) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=1280">${FONTS}<title>Волга — ${t.name}</title><style>${baseCss(t)}</style></head><body class="v-${t.id}">${renderers[t.id](t)}</body></html>`;
}

for (const t of themes) {
  writeFileSync(join(OUT, `${t.id}.html`), pageHtml(t), "utf8");
  console.log("written", t.id);
}
writeFileSync(join(__dirname, "themes.json"), JSON.stringify(themes.map((t) => ({
  id: t.id, name: t.name, ref: t.ref, mode: t.mode, desc: t.desc, palette: t.palette, fontNote: t.fontNote, inspiredBy: t.inspiredBy, spec: t.spec,
})), null, 2), "utf8");
console.log("done");
