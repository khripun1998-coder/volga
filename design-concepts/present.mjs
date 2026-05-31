import { chromium } from "playwright-core";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESKTOP = join(homedir(), "Desktop");
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find(existsSync);

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`;

// Картинки клиента: рабочий стол N.png → N.jpg → final-N → мой рендер shot-N
function pickUrl(n) {
  const cands = [
    join(DESKTOP, `${n}.png`),
    join(DESKTOP, `${n}.jpg`),
    join(__dirname, `final-${n}.png`),
    join(__dirname, `shot-${n}.png`),
  ];
  const f = cands.find(existsSync) ?? join(__dirname, `shot-${n}.png`);
  return { url: pathToFileURL(f).href, from: f };
}

const CONCEPTS = [
  {
    num: "01", name: "Aurora", sub: "Стекло‑морфизм",
    desc: "Тёплый лиловый фон, стеклянные 3D‑фигуры и сфера в hero, тёмная плашка с метриками. Премиальная глубина без перегруза.",
    palette: ["#6366F1", "#A78BFA", "#E8E6FB", "#15161C"],
    tags: ["Space Grotesk", "Стекло 3D", "Тёмная статистика"],
    accent: "#6366F1", ...pickUrl(1),
  },
  {
    num: "02", name: "Studio", sub: "3D + рука с телефоном",
    desc: "Белый фон, рука держит телефон с витриной, вокруг — парящие 3D‑карточки. Считывается как «маркетплейс в кармане».",
    palette: ["#3B5BFF", "#C9D6FF", "#FFE0CF", "#FFFFFF"],
    tags: ["Space Grotesk", "Рука + телефон", "Карточки 3D"],
    accent: "#3B5BFF", ...pickUrl(4),
  },
  {
    num: "03", name: "Cloud", sub: "Поиск + крафт на орбите",
    desc: "Светлый воздушный экран: рукописный логотип, предметы крафта по орбите, центральный поиск. Минимализм с характером.",
    palette: ["#3D7FE0", "#9CC2F2", "#EAF1FB", "#FFFFFF"],
    tags: ["Space Grotesk", "Орбита предметов", "Центр‑поиск"],
    accent: "#3D7FE0", ...pickUrl(3),
  },
];

const dots = `<span class="d r"></span><span class="d y"></span><span class="d g"></span>`;
const pal = (cs) => cs.map((c) => `<span class="sw" style="background:${c}"></span>`).join("");

function cover() {
  return `
  <section class="page cover">
    <div class="cov-top"><span class="logo">Волга</span><span class="cov-tag">Маркетплейс мастеров · дизайн‑концепции</span></div>
    <div class="cov-mid">
      <p class="kick">Презентация для клиента</p>
      <h1>Три концепта<br><span class="muted2">главной страницы</span></h1>
      <p class="cov-desc">Одна структура — сайдбар, лента «Товары / Магазины», блок «Топ магазинов». Три визуальных мира: стекло, 3D‑рука и воздушный поиск. Выберите направление целиком или соберём гибрид.</p>
      <div class="cov-strip">${CONCEPTS.map((c) => `<span class="cs" style="background:linear-gradient(135deg,${c.palette[0]},${c.palette[1]})"></span>`).join("")}</div>
    </div>
    <div class="cov-bot"><span class="logo sm">Волга</span><span>3 концепта · 2026</span></div>
    <span class="blob a"></span><span class="blob b"></span>
  </section>`;
}

function conceptPage(c) {
  return `
  <section class="page cpage">
    <div class="chead">
      <span class="cnum" style="color:${c.accent}">${c.num}</span>
      <div class="ctitle"><h2>${c.name}</h2><span class="csub">${c.sub}</span></div>
      <div class="pal">${pal(c.palette)}</div>
    </div>
    <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>

    <div class="frame">
      <div class="bar">${dots}<span class="url">volga.market</span></div>
      <div class="shot"><img src="${c.url}" alt="${c.name}"></div>
    </div>

    <div class="cfoot"><span class="cdesc">${c.desc}</span><span class="pg">${c.num} / 03</span></div>
  </section>`;
}

function closing() {
  return `
  <section class="page close">
    <span class="blob a"></span>
    <div class="cl">
      <p class="kick light">Что дальше</p>
      <h2>Выберите концепт —<br>доведём до пикселя</h2>
      <div class="cl-grid">
        ${CONCEPTS.map((c) => `
          <div class="clc">
            <div class="clc-img"><img src="${c.url}"></div>
            <div class="clc-meta"><span class="clc-n" style="background:${c.accent}">${c.num}</span><span>${c.name}</span></div>
          </div>`).join("")}
      </div>
      <p class="cl-note">Напишите номер понравившегося концепта — или соберём гибрид (hero от одного, карточки от другого). Дальше: адаптив, анимации и перенос на рабочий сайт.</p>
    </div>
    <div class="cl-bot"><span class="logo sm light">Волга</span><span class="light">Ecom Vision · 2026</span></div>
  </section>`;
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#16161c}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fff;page-break-after:always;padding:15mm 14mm}
.page:last-child{page-break-after:auto}
.logo{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:22px;letter-spacing:-.02em}
.logo.sm{font-size:16px}
.kick{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#8a8a96}
.muted2{color:#9a9aa6}

/* Обложка */
.cover{background:#0F1020;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 16mm}
.cover .logo{color:#fff}
.cov-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.cov-tag{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#9a9ac0}
.cov-mid{position:relative;z-index:2}
.cov-mid .kick{color:#a7a7d0}
.cover h1{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:60px;line-height:1.0;letter-spacing:-.03em;margin-top:14px}
.cov-desc{margin-top:22px;max-width:520px;color:#c7c7da;font-size:15px;line-height:1.65}
.cov-strip{display:flex;gap:12px;margin-top:34px}
.cov-strip .cs{width:78px;height:78px;border-radius:18px;box-shadow:0 16px 30px -12px rgba(0,0,0,.6)}
.cov-bot{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#8a8aa6;position:relative;z-index:2}
.blob{position:absolute;border-radius:999px;filter:blur(85px);z-index:1}
.blob.a{width:440px;height:440px;background:#5b5bd6;right:-130px;top:60px;opacity:.5}
.blob.b{width:380px;height:380px;background:#9b4dff;left:-130px;bottom:-90px;opacity:.4}

/* Страница концепта */
.cpage{display:flex;flex-direction:column}
.chead{display:flex;align-items:center;gap:15px}
.cnum{font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;line-height:1;letter-spacing:-.02em}
.ctitle{margin-right:auto}
.ctitle h2{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:600;line-height:1;letter-spacing:-.02em}
.csub{font-size:13px;color:#8a8a96;font-weight:500}
.pal{display:flex;gap:8px}
.sw{width:26px;height:26px;border-radius:8px;border:1px solid rgba(0,0,0,.08)}
.tags{margin-top:14px;display:flex;gap:8px}
.tag{font-size:11px;font-weight:600;color:#3a3a48;background:#f3f3f6;border-radius:999px;padding:7px 13px}
.frame{margin-top:16px;border:1px solid #e7e7ee;border-radius:16px;overflow:hidden;box-shadow:0 34px 64px -34px rgba(20,20,50,.45);background:#fff}
.bar{height:34px;background:#f4f4f7;border-bottom:1px solid #ececf2;display:flex;align-items:center;gap:7px;padding:0 15px}
.d{width:10px;height:10px;border-radius:999px}.d.r{background:#ff5f57}.d.y{background:#febc2e}.d.g{background:#28c840}
.url{margin-left:14px;font-size:11px;color:#9a9aa6;background:#fff;border:1px solid #ececf2;border-radius:6px;padding:3px 16px}
.shot{background:#fff}
.shot img{width:100%;display:block}
.cfoot{margin-top:16px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}
.cdesc{font-size:13px;color:#54545e;line-height:1.55;max-width:82%}
.pg{font-family:'Space Grotesk',sans-serif;font-size:12px;color:#9a9aa6;font-weight:600;white-space:nowrap}

/* Финал */
.close{background:#0F1020;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 16mm}
.kick.light{color:#a7a7d0}
.close h2{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:38px;line-height:1.06;letter-spacing:-.02em;margin-top:8px}
.cl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px}
.clc{background:#17182c;border:1px solid #24253c;border-radius:14px;overflow:hidden}
.clc-img{height:130px;overflow:hidden;background:#0b0b16}
.clc-img img{width:100%;display:block}
.clc-meta{display:flex;align-items:center;gap:10px;padding:12px 13px;font-size:13px;color:#c7c7da}
.clc-n{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff;font-family:'Space Grotesk',sans-serif}
.cl-note{margin-top:22px;max-width:560px;color:#c7c7da;font-size:13.5px;line-height:1.65}
.cl-bot{display:flex;justify-content:space-between;align-items:center}
.light{color:#9a9ac0}.cl-bot .logo{color:#fff}
`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>
${cover()}
${CONCEPTS.map(conceptPage).join("")}
${closing()}
</body></html>`;

writeFileSync(join(__dirname, "presentation.html"), html, "utf8");
CONCEPTS.forEach((c) => console.log(`Концепт ${c.num}:`, c.from));

if (!CHROME) {
  console.error("Chrome/Edge не найден — открой presentation.html и распечатай в PDF.");
  process.exit(0);
}
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(join(__dirname, "presentation.html")).href, { waitUntil: "load", timeout: 60000 });
try { await page.evaluate(() => document.fonts.ready); } catch {}
try { await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), { timeout: 15000 }); } catch {}
await page.waitForTimeout(600);
const pdf = join(__dirname, "Волга — презентация 3 концептов.pdf");
await page.pdf({ path: pdf, format: "A4", printBackground: true });
await browser.close();
console.log("PDF:", pdf);
