import { chromium } from "playwright-core";

const b = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const p = await ctx.newPage();

await p.goto("http://localhost:3000/", { waitUntil: "load" });
await p.waitForTimeout(900);
// scroll a touch so the "Топ магазинов" лента is in view, then back
await p.evaluate(() => window.scrollTo(0, 0));
await p.screenshot({ path: "docs/shots/m-home-top.png" });

// open hamburger menu
await p.click('button[aria-label="Меню"]').catch((e) => console.log("click err", e.message));
await p.waitForTimeout(500);
await p.screenshot({ path: "docs/shots/m-menu.png" });

const info = await p.evaluate(() => {
  const panel = [...document.querySelectorAll("div")].find((d) => (d.className || "").toString().includes("w-72"));
  if (!panel) return { found: false };
  const r = panel.getBoundingClientRect();
  return {
    found: true,
    panelHeight: Math.round(r.height),
    winHeight: window.innerHeight,
    bg: getComputedStyle(panel).backgroundColor,
    coversFull: Math.round(r.height) >= window.innerHeight - 2,
  };
});
console.log("MENU:", JSON.stringify(info));
await b.close();
