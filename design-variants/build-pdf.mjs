import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themes = JSON.parse(readFileSync(join(__dirname, "themes.json"), "utf8"));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&display=swap" rel="stylesheet">`;

const num2 = (n) => String(n).padStart(2, "0");
const modeChip = (m) => (m === "dark" ? "Тёмная тема" : "Светлая тема");
const evLogo = `<span class="ev"><span class="ev-mark"></span><span class="ev-word">ECOM&nbsp;VISION</span></span>`;
const paletteRow = (p) => `<div class="pal">${p.map((c) => `<span class="sw" style="background:${c}"></span>`).join("")}</div>`;

function specRows(spec) {
  return Object.entries(spec).map(([k, v]) => `<div class="spec"><span class="spec-k">${k}</span><span class="spec-v">${v}</span></div>`).join("");
}

function variantPage(t, i) {
  return `
  <section class="page vpage">
    <div class="vhead">
      <span class="vnum">${num2(i + 1)}</span>
      <div class="vtitle"><h2>${t.name}</h2><span class="vref">${t.ref}</span></div>
      <div class="vhead-r"><span class="insp">Вдохновение · ${t.inspiredBy}</span><span class="chip ${t.mode}">${modeChip(t.mode)}</span></div>
    </div>

    <div class="browser">
      <div class="bbar"><span class="bd r"></span><span class="bd y"></span><span class="bd g"></span><span class="burl">volga.market</span></div>
      <div class="bview"><img src="shots/${t.id}-fold.png"></div>
    </div>

    <div class="vfoot">
      <div class="vleft">
        <p class="vdesc">${t.desc}</p>
        <div class="specs">${specRows(t.spec)}</div>
      </div>
      <div class="vright">
        <div class="lab">Палитра</div>${paletteRow(t.palette)}
        <div class="lab" style="margin-top:12px">Шрифты</div><div class="fonts">${t.fontNote}</div>
        <div class="lab" style="margin-top:12px">Вся страница</div>
        <div class="thumbwrap"><img src="shots/${t.id}-full.png"></div>
      </div>
    </div>

    <div class="pfoot"><span>${evLogo}</span><span>Волга · Маркетплейс — концепции главной</span><span>${num2(i + 1)} / 06</span></div>
  </section>`;
}

function coverPage() {
  return `
  <section class="page cover">
    <div class="cov-top">${evLogo}<span class="cov-tag">E-commerce&nbsp;&amp;&nbsp;Marketplace Development</span></div>
    <div class="cov-mid">
      <div class="cov-kick">Дизайн-концепция · для клиента «Волга»</div>
      <h1>Маркетплейс «Волга»<br><span class="grad">6 концепций главной</span></h1>
      <p>Шесть принципиально разных решений главной страницы — каждое со своим первым экраном, навигацией, подачей каталога и анимацией. За основу взяты лучшие практики маркетплейсов: Avito, eBay, Ozon, Wildberries и современные витрины.</p>
      <div class="cov-strip">${themes.map((t) => `<span class="cs" style="background:linear-gradient(135deg,${t.palette[0]},${t.palette[2]})"></span>`).join("")}</div>
    </div>
    <div class="cov-bot"><span>Подготовлено: Ecom Vision Team</span><span>27 мая 2026</span></div>
    <span class="cov-blob a"></span><span class="cov-blob b"></span>
  </section>`;
}

function approachPage() {
  return `
  <section class="page approach">
    <div class="ap-head"><div class="lab">О подходе</div><h2>Одни данные — шесть разных миров.</h2>
      <p class="ap-sub">Вы отметили: структура и сценарии удобны, а вот дизайн хочется другой. Поэтому контент и блоки остаются вашими (категории, топ магазинов, промо, товары, продавцы), но <b>каждая концепция выстраивает их по-своему</b> — это не перекраска одного макета, а шесть разных архитектур главной.</p>
    </div>
    <div class="ap-grid">
      ${themes.map((t, i) => `<div class="apc"><div class="apc-img"><img src="shots/${t.id}-fold.png"></div><div class="apc-meta"><span class="apc-n">${num2(i + 1)}</span><div class="apc-tx"><span class="apc-name">${t.name}</span><span class="apc-ref">${t.spec["Главный экран"]}</span></div></div></div>`).join("")}
    </div>
    <div class="ap-note">Можно выбрать одну концепцию целиком — или собрать гибрид (например, герой от «Бенто», карточки от «Витрины», тёплую гамму от «Эко»). Дальше доводим выбранное до пикселя и применяем к рабочему сайту.</div>
    <div class="pfoot"><span>${evLogo}</span><span>Волга · Маркетплейс — концепции главной</span><span>Обзор</span></div>
  </section>`;
}

function closingPage() {
  return `
  <section class="page closing">
    <span class="cov-blob a"></span>
    <div class="cl-mid">
      <div class="cov-kick">Что дальше</div>
      <h2>Выберите концепцию —<br>и мы доведём её до финала</h2>
      <ol class="cl-steps">
        <li><span>1</span><div><b>Вы выбираете</b> одну из шести концепций (или отмечаете, что нравится в каждой).</div></li>
        <li><span>2</span><div><b>Собираем гибрид при необходимости</b> — берём лучший герой, карточки и палитру из разных вариантов.</div></li>
        <li><span>3</span><div><b>Дорабатываем детали</b> — анимации, микро-взаимодействия, адаптив под телефон и планшет.</div></li>
        <li><span>4</span><div><b>Применяем к рабочему сайту</b> — данные и логика уже готовы, меняется визуальный слой.</div></li>
      </ol>
      <div class="cl-cta">Напишите номер понравившейся концепции — и мы продолжим.</div>
    </div>
    <div class="cov-bot big"><span>${evLogo}</span><span>Ecom Vision Team · 2026</span></div>
  </section>`;
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Manrope',system-ui,sans-serif;color:#16161a;background:#fff}
:root{--ink:#16161a;--soft:#6a6c78;--line:#e7e7ee;--ev1:#5b5bd6;--ev2:#9b4dff;--paper:#fbfbfd}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:var(--paper);padding:15mm 14mm}
.page:last-child{page-break-after:auto}
.lab{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--soft)}
.grad{background:linear-gradient(95deg,var(--ev1),var(--ev2));-webkit-background-clip:text;background-clip:text;color:transparent}
.ev{display:inline-flex;align-items:center;gap:9px;font-weight:800;letter-spacing:.14em;font-size:13px;color:var(--ink)}
.ev-mark{width:18px;height:18px;border-radius:6px;background:linear-gradient(135deg,var(--ev1),var(--ev2));box-shadow:0 4px 12px -4px rgba(120,80,255,.7);position:relative}
.ev-mark:after{content:"";position:absolute;inset:5px;border-radius:3px;background:#fff;opacity:.92;clip-path:polygon(0 0,100% 50%,0 100%)}
.pfoot{position:absolute;left:14mm;right:14mm;bottom:9mm;display:flex;align-items:center;justify-content:space-between;font-size:10px;color:var(--soft);border-top:1px solid var(--line);padding-top:8px}

/* Обложка */
.cover{background:#0e0e14;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:20mm 16mm}
.cover .ev{color:#fff}
.cov-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.cov-tag{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8a8aa0}
.cov-mid{position:relative;z-index:2}
.cov-kick{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#a7a7c2;margin-bottom:18px}
.cover h1{font-family:'Fraunces',serif;font-weight:500;font-size:56px;line-height:1.04;letter-spacing:-.01em}
.cover p{margin-top:22px;max-width:440px;color:#c4c4d6;font-size:14px;line-height:1.6}
.cov-strip{display:flex;gap:10px;margin-top:30px}
.cov-strip .cs{width:56px;height:56px;border-radius:14px;box-shadow:0 10px 24px -10px rgba(0,0,0,.6)}
.cov-bot{display:flex;justify-content:space-between;font-size:11px;color:#8a8aa0;position:relative;z-index:2}
.cov-blob{position:absolute;border-radius:999px;filter:blur(70px);opacity:.55;z-index:1}
.cov-blob.a{width:340px;height:340px;background:#5b5bd6;right:-90px;top:90px}
.cov-blob.b{width:300px;height:300px;background:#9b4dff;left:-100px;bottom:-40px;opacity:.4}

/* Подход */
.ap-head h2{font-family:'Fraunces',serif;font-weight:600;font-size:30px;margin-top:6px;letter-spacing:-.01em}
.ap-sub{margin-top:12px;font-size:13px;color:#41414c;line-height:1.6;max-width:680px}
.ap-sub b{color:var(--ink)}
.ap-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px}
.apc{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.apc-img{height:96px;overflow:hidden;background:#eee}
.apc-img img{width:100%;display:block}
.apc-meta{display:flex;align-items:center;gap:10px;padding:10px 13px}
.apc-n{font-size:11px;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--ev1),var(--ev2));width:22px;height:22px;border-radius:7px;display:grid;place-items:center;flex:0 0 22px}
.apc-tx{display:flex;flex-direction:column}
.apc-name{font-size:13.5px;font-weight:800}
.apc-ref{font-size:10.5px;color:var(--soft);line-height:1.3}
.ap-note{margin-top:16px;background:linear-gradient(120deg,#f1f0ff,#f7f0ff);border:1px solid #e7e2ff;border-radius:12px;padding:13px 16px;font-size:12px;color:#3a3650;line-height:1.55}

/* Страница варианта */
.vhead{display:flex;align-items:center;gap:14px}
.vnum{font-family:'Fraunces',serif;font-size:38px;font-weight:600;line-height:1;color:transparent;background:linear-gradient(135deg,var(--ev1),var(--ev2));-webkit-background-clip:text;background-clip:text}
.vtitle h2{font-family:'Fraunces',serif;font-weight:600;font-size:26px;line-height:1}
.vref{font-size:11px;color:var(--soft);font-weight:600}
.vhead-r{margin-left:auto;display:flex;align-items:center;gap:10px}
.insp{font-size:10.5px;font-weight:700;color:#5b5bd6;background:#eeeeff;padding:6px 11px;border-radius:999px}
.chip{font-size:10px;font-weight:700;padding:6px 11px;border-radius:999px}
.chip.dark{background:#16161a;color:#fff}.chip.light{background:#eef0f6;color:#3a3a44}
.browser{margin-top:13px;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 24px 50px -30px rgba(20,20,40,.4);background:#fff}
.bbar{height:30px;background:#f1f1f5;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px;padding:0 12px}
.bd{width:9px;height:9px;border-radius:999px}.bd.r{background:#ff5f57}.bd.y{background:#febc2e}.bd.g{background:#28c840}
.burl{margin-left:14px;font-size:10px;color:#8a8a96;background:#fff;border:1px solid var(--line);border-radius:6px;padding:3px 12px}
.bview{height:112mm;overflow:hidden}
.bview img{width:100%;display:block}
.vfoot{display:grid;grid-template-columns:1.35fr 1fr;gap:22px;margin-top:14px}
.vdesc{font-size:12.5px;color:#34343e;line-height:1.55}
.specs{margin-top:12px;display:flex;flex-direction:column;gap:0}
.spec{display:grid;grid-template-columns:84px 1fr;gap:10px;padding:7px 0;border-top:1px solid var(--line);align-items:baseline}
.spec:first-child{border-top:none}
.spec-k{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ev1)}
.spec-v{font-size:11.5px;color:#34343e;line-height:1.4}
.pal{display:flex;gap:6px;margin-top:7px}
.sw{width:28px;height:28px;border-radius:7px;border:1px solid rgba(0,0,0,.08)}
.fonts{font-size:12px;font-weight:600;margin-top:6px;color:#34343e}
.thumbwrap{margin-top:7px;border:1px solid var(--line);border-radius:10px;overflow:hidden;height:52mm;background:#fafafd}
.thumbwrap img{width:100%;display:block}

/* Финал */
.closing{background:#0e0e14;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 16mm}
.closing .cov-kick{color:#a7a7c2}
.cl-mid{position:relative;z-index:2}
.closing h2{font-family:'Fraunces',serif;font-weight:500;font-size:38px;line-height:1.06;margin-bottom:26px}
.cl-steps{list-style:none;display:flex;flex-direction:column;gap:15px;max-width:540px}
.cl-steps li{display:flex;gap:14px;align-items:flex-start}
.cl-steps li span{flex:0 0 30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--ev1),var(--ev2));display:grid;place-items:center;font-weight:800;font-size:14px}
.cl-steps li div{font-size:14px;color:#cfcfe0;line-height:1.5;padding-top:3px}
.cl-steps li b{color:#fff}
.cl-cta{margin-top:28px;display:inline-block;background:linear-gradient(95deg,var(--ev1),var(--ev2));padding:14px 22px;border-radius:12px;font-weight:700;font-size:14px}
.cov-bot.big{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;color:#8a8aa0;font-size:12px}
.cov-bot.big .ev{color:#fff}
`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>
${coverPage()}
${approachPage()}
${themes.map((t, i) => variantPage(t, i)).join("")}
${closingPage()}
</body></html>`;

const htmlPath = join(__dirname, "presentation.html");
writeFileSync(htmlPath, html, "utf8");

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(500);
const pdfPath = join(__dirname, "Волга — 6 концепций главной (Ecom Vision).pdf");
await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("PDF:", pdfPath);
