import { chromium } from "playwright-core";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

// Шрифты «как у Apple/YouTube»: Space Grotesk (заголовки) + Plus Jakarta Sans (UI)
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`;

/* ─── общий каркас (эскиз клиента №4) ─── */

function sidebar(accent) {
  const items = [
    { d: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0", label: "Профиль" },
    { d: "M4 5h16v11H7l-3 3z", label: "Сообщения" },
    { d: "M12 9a3 3 0 100 6 3 3 0 000-6zm8 3l-2 1 1 3-2 1-2-2-2 1-1-3-2-1 2-1-1-3 2-1 2 2 2-1 1 3z", label: "Настройки" },
    { d: "M3 5h18M6 12h12M10 19h4", label: "Фильтры", active: true },
  ];
  return `
  <aside class="sb">
    <div class="sb-logo">Волга</div>
    <div class="sb-items">
      ${items.map((it) => `
        <div class="sb-it ${it.active ? "on" : ""}" title="${it.label}">
          ${it.active ? `<span class="sb-mark" style="background:${accent}"></span>` : ""}
          <svg viewBox="0 0 24 24" fill="none" stroke="${it.active ? accent : "#9a9a9a"}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${it.d}"/></svg>
          <span class="sb-lbl" style="color:${it.active ? "#1b1b1b" : "#9a9a9a"}">${it.label}</span>
        </div>`).join("")}
    </div>
    <div class="sb-foot"><span class="sb-ava" style="background:${accent}1a;color:${accent}">А</span><div><div class="sb-name">Гость</div><div class="sb-sub">Войти</div></div></div>
  </aside>`;
}

function topbar(accent) {
  return `
  <header class="tb">
    <div class="tb-search">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9a9a9a" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
      Найти магазин или работу мастера
    </div>
    <div class="tb-right">
      <span class="tb-bell"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1b1b1b" stroke-width="1.7"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg></span>
      <span class="tb-login" style="background:${accent}">Войти</span>
    </div>
  </header>`;
}

function tabs(accent, { pill = true } = {}) {
  if (pill) {
    return `<div class="tabs">
      <span class="tab" style="color:#8a8a8a">Товары</span>
      <span class="tab on" style="background:${accent}">Магазины</span>
    </div>`;
  }
  return `<div class="tabs-u">
    <span class="tabu" style="color:#8a8a8a">Товары</span>
    <span class="tabu on" style="border-bottom:2px solid ${accent}">Магазины</span>
  </div>`;
}

function tile(grad) {
  return `<div class="tile" style="background:${grad}"><span class="tile-dot"></span></div>`;
}

const SHOPS = [
  { n: "Тёплые лапки", c: "Краснодар", r: "4.9", w: "87" },
  { n: "Кубанская глина", c: "Краснодар", r: "5.0", w: "24" },
  { n: "Серебро Кубани", c: "Краснодар", r: "5.0", w: "21" },
  { n: "Свет в доме", c: "Краснодар", r: "4.8", w: "33" },
  { n: "Лоза и нить", c: "Краснодар", r: "4.7", w: "19" },
  { n: "Балтийский янтарь", c: "Калининград", r: "4.9", w: "28" },
];

/* ─── 3D рука, держащая телефон (оригинальный SVG, стиль soft-3D-render) ─── */
function handPhone(accent) {
  // Один палец-«обхват» правого края: база у кисти (справа), мягкий кончик слева.
  const finger = (xTip, y, h, len) => {
    const half = h / 2;
    const xBase = 348;
    return `<path d="M${xBase} ${y - half}
      C${xTip + 14} ${y - half} ${xTip} ${y - half} ${xTip} ${y - half + 4}
      C${xTip - 8} ${y - half + 2} ${xTip - 10} ${y + half - 2} ${xTip} ${y + half - 4}
      C${xTip} ${y + half} ${xTip + 14} ${y + half} ${xBase} ${y + half} Z"
      fill="url(#skin)"/>`;
  };
  return `
  <svg class="hand-svg" viewBox="0 0 440 480" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skin" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="#FCE6D6"/><stop offset="0.55" stop-color="#F2CDB4"/><stop offset="1" stop-color="#E2B295"/>
      </linearGradient>
      <linearGradient id="skinDark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E6BDA0"/><stop offset="1" stop-color="#CE9C7E"/>
      </linearGradient>
      <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2C2E37"/><stop offset="1" stop-color="#14151B"/>
      </linearGradient>
      <linearGradient id="screen" x1="0.1" y1="0" x2="0.5" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#EEF2FA"/>
      </linearGradient>
      <radialGradient id="floor" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="rgba(40,60,120,0.16)"/><stop offset="1" stop-color="rgba(40,60,120,0)"/>
      </radialGradient>
      <filter id="hsh" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#2a3a6a" flood-opacity="0.18"/>
      </filter>
    </defs>

    <ellipse cx="220" cy="438" rx="150" ry="24" fill="url(#floor)"/>

    <g filter="url(#hsh)">
      <!-- предплечье -->
      <path d="M286 474 C272 410 280 372 312 356 C356 334 392 360 392 410 C392 452 360 478 320 478 Z" fill="url(#skinDark)"/>
      <!-- тыльная сторона кисти (за телефоном, справа) -->
      <path d="M300 150 C356 150 392 196 392 268 C392 356 356 416 296 422 C300 360 300 220 300 150 Z" fill="url(#skin)"/>
      <path d="M392 268 C392 200 360 156 308 150 C352 162 372 210 372 270 C372 344 344 396 300 410 C348 404 392 350 392 268 Z" fill="url(#skinDark)" opacity="0.45"/>

      <!-- ТЕЛЕФОН (наклонён) -->
      <g transform="rotate(-12 215 210)">
        <rect x="126" y="46" width="180" height="330" rx="38" fill="url(#phoneBody)"/>
        <rect x="132" y="52" width="168" height="318" rx="32" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1.4"/>
        <rect x="138" y="58" width="156" height="306" rx="27" fill="url(#screen)"/>
        <rect x="138" y="58" width="156" height="70" rx="27" fill="${accent}" opacity="0.14"/>
        <rect x="156" y="80" width="74" height="9" rx="4.5" fill="#1b1b1b" opacity="0.45"/>
        <rect x="156" y="96" width="48" height="8" rx="4" fill="#1b1b1b" opacity="0.22"/>
        <rect x="156" y="140" width="120" height="76" rx="15" fill="${accent}" opacity="0.16"/>
        <circle cx="216" cy="178" r="21" fill="#fff"/>
        <rect x="156" y="230" width="56" height="56" rx="14" fill="#E9EEF8"/>
        <rect x="220" y="230" width="56" height="56" rx="14" fill="#F1E7F8"/>
        <rect x="156" y="294" width="56" height="56" rx="14" fill="#FBEADF"/>
        <rect x="220" y="294" width="56" height="56" rx="14" fill="#E6F3EC"/>
        <rect x="196" y="64" width="40" height="7" rx="3.5" fill="#0c0d12"/>
      </g>

      <!-- мягкая тень от пальцев на корпусе -->
      <path d="M300 160 C300 250 300 320 300 410 C286 408 274 360 274 270 C274 210 286 168 300 160 Z" fill="#9a6a4a" opacity="0.18"/>

      <!-- 4 пальца, обхватывающие правый край (связаны с кистью) -->
      ${finger(262, 178, 34, 0)}
      ${finger(252, 216, 36, 0)}
      ${finger(258, 254, 35, 0)}
      ${finger(272, 290, 32, 0)}
      <!-- складки между пальцами -->
      <g stroke="#C98E6C" stroke-width="2" stroke-linecap="round" opacity="0.55" fill="none">
        <path d="M300 197 C322 197 338 197 348 197"/>
        <path d="M300 235 C322 235 338 235 348 235"/>
        <path d="M300 272 C322 272 338 272 348 272"/>
      </g>
      <!-- костяшки (блики) -->
      <g fill="#FCEADC" opacity="0.65">
        <ellipse cx="330" cy="178" rx="12" ry="9"/>
        <ellipse cx="332" cy="216" rx="12" ry="9"/>
        <ellipse cx="331" cy="254" rx="12" ry="9"/>
        <ellipse cx="328" cy="290" rx="11" ry="8"/>
      </g>

      <!-- большой палец на передней грани (слева снизу) -->
      <path d="M300 372
        C250 366 206 342 184 304
        C172 282 182 262 204 266
        C226 270 244 294 268 310
        C288 324 306 342 320 358 Z" fill="url(#skin)"/>
      <path d="M184 304 C176 288 182 270 200 268 C190 282 192 300 208 314 C200 314 190 312 184 304 Z" fill="url(#skinDark)" opacity="0.5"/>
      <!-- ноготь большого пальца -->
      <ellipse cx="196" cy="286" rx="11" ry="8" transform="rotate(-38 196 286)" fill="#FCEADC" opacity="0.8"/>
    </g>
  </svg>`;
}

/* ════════════ КОНЦЕПТ 1 — Aurora (фиолетовое стекло) ════════════ */
function conceptAurora() {
  const accent = "#6366F1";
  const grads = [
    "linear-gradient(135deg,#efeaff,#d3c8f7)",
    "linear-gradient(135deg,#e8f0fe,#cdddf7)",
    "linear-gradient(135deg,#fbeafb,#ecc9f1)",
    "linear-gradient(135deg,#eeeafb,#d6cef3)",
    "linear-gradient(135deg,#eaf2fe,#cee0f6)",
    "linear-gradient(135deg,#f2eafb,#dcc9f1)",
  ];
  return `
  <section class="page" style="background:linear-gradient(180deg,#F1EFFB 0%,#F7F5FE 45%,#ffffff 100%)">
    <span class="glow" style="background:#B6A6F6;left:-120px;top:120px"></span>
    <span class="glow" style="background:#F3B8F6;right:-150px;top:360px;opacity:.28"></span>
    <div class="badge">Концепт 01 · Aurora · стекло‑морфизм</div>

    <div class="app">
      ${sidebar(accent)}
      <div class="app-main">
        ${topbar(accent)}
        <div class="content">
          <div class="hero">
            <div class="hero-l">
              <p class="eyebrow" style="color:${accent}">Соцсеть мастеров</p>
              <h1 class="display">Витрина мастера —<br>как личный канал</h1>
              <p class="lead">Подписывайтесь на магазины, общайтесь с авторами, поддерживайте локальный крафт. Сначала — лучшие по рейтингу.</p>
              <div class="cta-row">
                <span class="cta" style="background:linear-gradient(135deg,#6366F1,#4F46E5)">Открыть ленту</span>
                <span class="cta-ghost">Стать продавцом</span>
              </div>
            </div>
            <div class="hero-r glass-scene">
              <span class="tray"></span>
              <span class="cube c1"></span>
              <span class="cube c2"></span>
              <span class="cyl y1"></span>
              <span class="cyl y2"></span>
              <span class="cyl y3"></span>
              <span class="sphere"></span>
            </div>
          </div>

          <div class="darkstat">
            ${[["1 200+","мастеров"],["8 500+","изделий"],["98%","качество"],["24/7","поддержка"]].map(([a,b])=>`<div class="ds"><span class="ds-n">${a}</span><span class="ds-l">${b}</span></div>`).join("")}
          </div>

          <div class="sec-head">
            <div><p class="eyebrow" style="color:${accent}">Топ недели</p><h2 class="display sm">Топ магазинов</h2></div>
            ${tabs(accent)}
          </div>
          <div class="grid">
            ${SHOPS.map((s,i)=>`
              <div class="card glass">
                ${tile(grads[i])}
                <div class="card-b">
                  <div class="card-t">${s.n}</div>
                  <div class="card-s">Мастерская · ${s.c}</div>
                  <div class="card-m"><span class="star" style="color:${accent}">★ ${s.r}</span><span class="muted">${s.w} работ</span></div>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ════════════ КОНЦЕПТ 2 — Studio (белый, рука с телефоном) ════════════ */
function conceptStudio() {
  const accent = "#3B5BFF";
  const grads = [
    "linear-gradient(135deg,#eef2ff,#dfe7ff)",
    "linear-gradient(135deg,#fff0e8,#ffe0cf)",
    "linear-gradient(135deg,#e9f7f0,#d4efe1)",
    "linear-gradient(135deg,#f3edff,#e6dbff)",
    "linear-gradient(135deg,#ffeef4,#ffdbe8)",
    "linear-gradient(135deg,#eaf3ff,#d8e8ff)",
  ];
  return `
  <section class="page" style="background:#ffffff">
    <span class="glow" style="background:#C9D6FF;left:-120px;top:160px;opacity:.5"></span>
    <span class="glow" style="background:#FFE0CF;right:-120px;top:90px;opacity:.45"></span>
    <div class="badge dark">Концепт 02 · Studio · 3D + рука</div>

    <div class="app">
      ${sidebar(accent)}
      <div class="app-main">
        ${topbar(accent)}
        <div class="content">
          <div class="hero">
            <div class="hero-l">
              <p class="eyebrow" style="color:${accent}">Маркетплейс в кармане</p>
              <h1 class="display">Магазины мастеров —<br>в одном приложении</h1>
              <p class="lead">Листайте каналы, как ленту любимой соцсети. Подписка, чат с автором и заказ — в пару касаний.</p>
              <div class="cta-row">
                <span class="cta" style="background:${accent}">Смотреть ленту</span>
                <span class="cta-ghost">Как это работает</span>
              </div>
              <div class="trust"><span class="trust-dots"><i></i><i></i><i></i></span>Более 1 200 мастеров уже с нами</div>
            </div>

            <div class="hero-r hand-scene">
              ${handPhone(accent)}
              <!-- парящие 3D-карточки с перспективой -->
              <div class="fcard3d a">
                <span class="fc-av" style="background:${accent}"></span>
                <span class="fc-lines"><i></i><i class="short"></i></span>
              </div>
              <div class="fcard3d b">
                <span class="fc-thumb" style="background:linear-gradient(135deg,#ffe0cf,#ffc9a8)"></span>
                <span class="fc-lines"><i></i><i class="short"></i></span>
              </div>
              <div class="fcard3d c">
                <span class="fc-star">★ 4.9</span>
                <span class="fc-tag" style="background:${accent}">NEW</span>
              </div>
            </div>
          </div>

          <div class="sec-head">
            <div><p class="eyebrow" style="color:${accent}">Топ недели</p><h2 class="display sm">Топ магазинов</h2></div>
            ${tabs(accent)}
          </div>
          <div class="grid">
            ${SHOPS.map((s,i)=>`
              <div class="card">
                <div class="card-img">${tile(grads[i])}<span class="heart">♥</span></div>
                <div class="card-b">
                  <div class="card-t">${s.n}</div>
                  <div class="card-m"><span class="star" style="color:${accent}">★ ${s.r}</span><span class="muted">${s.c}</span></div>
                  <div class="card-foot"><span class="price">${s.w} работ</span><span class="mini-btn" style="background:${accent}">→</span></div>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ════════════ КОНЦЕПТ 3 — Cloud (белый, центр-поиск, парящие сферы) ════════════ */
function conceptCloud() {
  const accent = "#3D7FE0";
  const grads = [
    "linear-gradient(135deg,#f3f7fe,#e2ecfb)",
    "linear-gradient(135deg,#f5f9ff,#e6effb)",
    "linear-gradient(135deg,#f1f6fe,#dde9f8)",
    "linear-gradient(135deg,#f6faff,#e8f1fc)",
    "linear-gradient(135deg,#f2f7fe,#dfecf9)",
    "linear-gradient(135deg,#f4f9ff,#e6f0fc)",
  ];
  return `
  <section class="page" style="background:linear-gradient(180deg,#EAF1FB 0%,#F4F8FE 42%,#ffffff 100%)">
    <span class="glow" style="background:#9CC2F2;left:-120px;top:200px;opacity:.3"></span>
    <div class="badge">Концепт 03 · Cloud · поиск + парящие 3D</div>

    <div class="app">
      ${sidebar(accent)}
      <div class="app-main">
        ${topbar(accent)}
        <div class="content">
          <div class="hero-center">
            <p class="eyebrow" style="color:${accent};position:relative;z-index:2">Премиальный маркетплейс крафта</p>
            <h1 class="display big" style="position:relative;z-index:2">Магазины мастеров России</h1>
            <p class="lead center" style="position:relative;z-index:2">Откройте для себя каналы мастеров. Подписывайтесь и поддерживайте — сначала лучшие по рейтингу.</p>
            <div class="search-hero big" style="position:relative;z-index:2">
              <span class="sh-ico"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#9a9a9a" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></span>
              <span class="sh-ph">Поиск по магазинам и изделиям</span>
              <span class="sh-btn" style="background:${accent}">Найти</span>
            </div>
          </div>

          <div class="sec-head center-head">
            ${tabs(accent,{pill:false})}
            <span class="muted small">Сортировка: по рейтингу</span>
          </div>
          <div class="grid">
            ${SHOPS.map((s,i)=>`
              <div class="card soft">
                <div class="card-img">${tile(grads[i])}<span class="tag light" style="color:${accent}">${i%2?'TOP':'NEW'}</span></div>
                <div class="card-b">
                  <div class="card-t">${s.n}</div>
                  <div class="card-m"><span class="star" style="color:${accent}">★ ${s.r}</span><span class="muted">${s.c} · ${s.w} работ</span></div>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@page{size:1440px 1040px;margin:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#1b1b1b;font-feature-settings:"ss01","cv01"}
.display{font-family:'Space Grotesk','Plus Jakarta Sans',sans-serif;letter-spacing:-.03em;line-height:1.02;font-weight:600}
.page{width:1440px;height:1040px;position:relative;overflow:hidden;page-break-after:always}
.page:last-child{page-break-after:auto}
.glow{position:absolute;width:440px;height:440px;border-radius:999px;filter:blur(140px);opacity:.5;z-index:0}
.badge{position:absolute;left:40px;top:28px;z-index:5;font-size:12px;font-weight:600;letter-spacing:.04em;background:#6366F1;color:#fff;padding:7px 15px;border-radius:999px;font-family:'Space Grotesk',sans-serif}
.badge.dark{background:#15161c}

/* каркас */
.app{position:absolute;left:60px;right:60px;top:74px;bottom:46px;display:flex;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 60px 120px -50px rgba(30,40,80,.45);z-index:2;border:1px solid rgba(255,255,255,.7)}
.sb{width:196px;flex:0 0 196px;display:flex;flex-direction:column;padding:20px 14px;border-right:1px solid #efefef;background:#fff}
.sb-logo{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:23px;letter-spacing:-.02em;padding:6px 12px 22px;color:#1b1b1b}
.sb-items{display:flex;flex-direction:column;gap:5px;flex:1}
.sb-it{position:relative;display:flex;align-items:center;gap:12px;height:46px;padding:0 14px;border-radius:14px}
.sb-it svg{width:19px;height:19px;flex:0 0 19px}
.sb-it.on{background:#f5f6f8}
.sb-mark{position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:22px;border-radius:0 4px 4px 0}
.sb-lbl{font-size:14px;font-weight:500}
.sb-foot{display:flex;align-items:center;gap:11px;padding:12px;border-top:1px solid #efefef}
.sb-ava{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-weight:700;font-size:15px}
.sb-name{font-size:13.5px;font-weight:600}
.sb-sub{font-size:11.5px;color:#9a9a9a}
.app-main{flex:1;min-width:0;display:flex;flex-direction:column;background:#fff}
.tb{height:66px;flex:0 0 66px;display:flex;align-items:center;gap:16px;padding:0 28px;border-bottom:1px solid #efefef}
.tb-search{flex:1;max-width:440px;height:42px;border-radius:999px;display:flex;align-items:center;gap:10px;padding:0 18px;font-size:13.5px;background:#f5f6f8;color:#9a9a9a}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.tb-bell{width:42px;height:42px;border-radius:999px;display:grid;place-items:center;border:1px solid #efefef}
.tb-login{height:38px;display:inline-flex;align-items:center;padding:0 22px;border-radius:999px;color:#fff;font-size:13.5px;font-weight:600}
.content{flex:1;overflow:hidden;padding:34px 38px}

.eyebrow{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;font-family:'Space Grotesk',sans-serif}
.hero{display:flex;gap:30px;align-items:center}
.hero-l{flex:1.05}
.hero-r{flex:1;position:relative;height:330px}
.hero h1{font-size:50px;margin:14px 0 0;color:#16161c}
.hero h1.big,.display.big{font-size:54px}
.lead{margin-top:16px;max-width:440px;font-size:15.5px;line-height:1.6;color:#5a5a66;font-weight:400}
.lead.center{margin-left:auto;margin-right:auto}
.cta-row{margin-top:26px;display:flex;gap:12px}
.cta{height:50px;display:inline-flex;align-items:center;padding:0 30px;border-radius:14px;color:#fff;font-size:14.5px;font-weight:600;box-shadow:0 16px 36px -12px rgba(60,70,200,.55)}
.cta-ghost{height:50px;display:inline-flex;align-items:center;padding:0 28px;border-radius:14px;font-size:14.5px;font-weight:600;color:#16161c;background:#f5f6f8}
.trust{margin-top:22px;display:flex;align-items:center;gap:10px;font-size:13px;color:#8a8a8a}
.trust-dots{display:flex}
.trust-dots i{width:22px;height:22px;border-radius:999px;background:#e3e3ea;border:2px solid #fff;margin-left:-7px}
.trust-dots i:first-child{margin-left:0}

/* glass-scene (концепт 1) с объёмом */
.glass-scene{perspective:1000px}
.glass-scene .tray{position:absolute;left:30px;bottom:40px;width:280px;height:40px;border-radius:999px;background:radial-gradient(ellipse,rgba(120,110,230,.22),transparent 70%);filter:blur(3px)}
.glass-scene .cube{position:absolute;width:84px;height:84px;border-radius:24px;border:1px solid rgba(255,255,255,.8);box-shadow:inset 0 2px 3px rgba(255,255,255,.95),inset 0 -8px 16px rgba(120,100,240,.25),0 26px 44px -14px rgba(99,102,241,.55)}
.glass-scene .c1{left:20px;top:6px;transform:rotateX(8deg) rotateY(16deg) rotate(-6deg);background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(167,139,250,.5))}
.glass-scene .c2{right:24px;top:40px;transform:rotateX(10deg) rotateY(-18deg) rotate(8deg);background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(124,196,255,.55))}
.glass-scene .cyl{position:absolute;width:46px;border-radius:999px 999px 22px 22px;border:1px solid rgba(255,255,255,.7);box-shadow:inset 0 3px 6px rgba(255,255,255,.85),inset 0 -10px 18px rgba(99,102,241,.3),0 18px 32px -10px rgba(99,102,241,.5)}
.glass-scene .y1{left:64px;bottom:50px;height:86px;background:linear-gradient(180deg,rgba(167,139,250,.92),rgba(255,255,255,.7))}
.glass-scene .y2{left:120px;bottom:50px;height:132px;background:linear-gradient(180deg,rgba(124,196,255,.92),rgba(255,255,255,.7))}
.glass-scene .y3{left:176px;bottom:50px;height:100px;background:linear-gradient(180deg,rgba(240,171,252,.92),rgba(255,255,255,.7))}
.glass-scene .sphere{position:absolute;right:40px;top:118px;width:104px;height:104px;border-radius:999px;border:1px solid rgba(255,255,255,.7);background:radial-gradient(circle at 32% 28%,#fff 0%,rgba(167,139,250,.45) 52%,rgba(99,102,241,.7) 100%);box-shadow:inset 0 0 32px rgba(255,255,255,.5),0 30px 56px -18px rgba(99,102,241,.55)}

.darkstat{margin-top:26px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#14152a;border-radius:22px;overflow:hidden;padding:5px}
.ds{background:#14152a;padding:18px 24px;color:#fff}
.ds-n{display:block;font-family:'Space Grotesk',sans-serif;font-size:27px;font-weight:600;letter-spacing:-.02em}
.ds-l{display:block;margin-top:4px;font-size:12px;color:#a7a7c2}

/* hand-scene (концепт 2) */
.hand-scene{height:360px;perspective:1100px}
.hand-svg{position:absolute;right:10px;top:-6px;height:380px;width:auto;filter:drop-shadow(0 40px 50px rgba(40,50,90,.18))}
.fcard3d{position:absolute;background:#fff;border-radius:16px;padding:12px;box-shadow:0 26px 46px -16px rgba(30,40,90,.28);border:1px solid #f0f0f4;display:flex;align-items:center;gap:10px}
.fcard3d.a{left:-6px;top:54px;width:158px;transform:rotateY(20deg) rotateX(6deg)}
.fcard3d.b{left:-22px;bottom:74px;width:150px;transform:rotateY(16deg) rotateX(-4deg)}
.fcard3d.c{right:6px;bottom:40px;width:128px;transform:rotateY(-18deg) rotateX(6deg);justify-content:space-between}
.fc-av{width:30px;height:30px;border-radius:999px;flex:0 0 30px}
.fc-thumb{width:40px;height:40px;border-radius:11px;flex:0 0 40px}
.fc-lines{flex:1;display:flex;flex-direction:column;gap:6px}
.fc-lines i{height:7px;border-radius:4px;background:#e9e9ef;display:block}
.fc-lines i.short{width:62%}
.fc-star{font-size:13px;font-weight:700;color:#1b1b1b}
.fc-tag{font-size:10px;font-weight:700;color:#fff;padding:4px 9px;border-radius:999px}

/* balls (концепт 3) — объёмные глянцевые */
.ball{position:absolute;border-radius:999px;background:radial-gradient(circle at 30% 26%,#ffffff 0%,#eef4fc 46%,#cfe0f4 100%);box-shadow:0 26px 46px -18px rgba(60,127,224,.5),inset 0 -10px 16px rgba(120,160,220,.35),inset 0 6px 10px rgba(255,255,255,.9);z-index:0}

.search-hero{margin-top:24px;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #ececf0;border-radius:18px;padding:8px 8px 8px 18px;max-width:560px;box-shadow:0 26px 54px -26px rgba(40,60,140,.3)}
.search-hero.big{max-width:640px;margin-left:auto;margin-right:auto;padding:10px 10px 10px 22px}
.sh-ph{flex:1;font-size:14.5px;color:#9a9a9a}
.sh-btn{height:42px;display:inline-flex;align-items:center;padding:0 24px;border-radius:12px;color:#fff;font-size:13.5px;font-weight:600}

.cats{margin-top:26px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}

.sec-head{margin-top:34px;display:flex;align-items:flex-end;justify-content:space-between}
.sec-head.center-head{align-items:center}
.sec-head h2{font-size:29px;margin-top:4px}
.display.sm{font-size:29px}
.tabs{display:inline-flex;gap:6px;background:#f5f6f8;border-radius:999px;padding:5px}
.tab{height:38px;display:inline-flex;align-items:center;padding:0 22px;border-radius:999px;font-size:13.5px;font-weight:600}
.tab.on{color:#fff}
.tabs-u{display:inline-flex;gap:28px}
.tabu{height:40px;display:inline-flex;align-items:center;font-size:18px;font-weight:600;font-family:'Space Grotesk',sans-serif}
.tabu.on{color:#1b1b1b}

.grid{margin-top:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid #eeeef1;border-radius:22px;overflow:hidden;box-shadow:0 30px 50px -36px rgba(20,30,70,.32)}
.card.glass{background:rgba(255,255,255,.78);border-color:rgba(255,255,255,.85)}
.card.soft{box-shadow:0 26px 46px -32px rgba(40,90,180,.4)}
.card-img{position:relative}
.tile{position:relative;aspect-ratio:16/10;display:grid;place-items:center}
.tile-dot{width:74px;height:74px;border-radius:999px;background:rgba(255,255,255,.65);box-shadow:inset 0 0 0 1px rgba(255,255,255,.8),0 8px 18px -6px rgba(0,0,0,.08)}
.tag{position:absolute;left:12px;top:12px;font-size:10px;font-weight:700;letter-spacing:.06em;color:#fff;padding:5px 10px;border-radius:999px}
.tag.light{background:#fff}
.heart{position:absolute;right:12px;top:12px;width:30px;height:30px;border-radius:999px;background:#fff;display:grid;place-items:center;color:#ff5a7a;font-size:14px;box-shadow:0 6px 14px rgba(0,0,0,.1)}
.card-b{padding:16px 18px}
.card-t{font-size:16.5px;font-weight:700;color:#16161c;font-family:'Space Grotesk',sans-serif;letter-spacing:-.01em}
.card-s{margin-top:3px;font-size:12.5px;color:#8a8a8a}
.card-m{margin-top:9px;display:flex;align-items:center;gap:10px;font-size:13px}
.star{font-weight:700}
.muted{color:#8a8a8a}
.small{font-size:12.5px}
.card-foot{margin-top:12px;display:flex;align-items:center;justify-content:space-between}
.price{font-size:14.5px;font-weight:700;font-family:'Space Grotesk',sans-serif}
.mini-btn{width:30px;height:30px;border-radius:999px;color:#fff;display:grid;place-items:center;font-size:15px}
.hero-center{position:relative;text-align:center;padding-top:18px}
`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>
${conceptAurora()}
${conceptStudio()}
${conceptCloud()}
</body></html>`;

const htmlPath = join(__dirname, "concepts.html");
writeFileSync(htmlPath, html, "utf8");
console.log("HTML:", htmlPath);

const exe = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!exe) {
  console.error("Chrome/Edge не найден — открой concepts.html и распечатай в PDF вручную.");
  process.exit(0);
}
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(700);
const pdfPath = join(__dirname, "Волга — 3 концепта (Ecom Vision).pdf");
await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("PDF:", pdfPath);
