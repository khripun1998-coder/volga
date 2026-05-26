import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const pages = [
  "/", "/catalog", "/product/stol-reka-dub-epoksi", "/product/myagkiy-mishka-toptyzhka",
  "/shops", "/account", "/seller", "/admin", "/checkout", "/cart", "/login",
];

const b = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const p = await ctx.newPage();

await p.goto(BASE + "/?noanim", { waitUntil: "load" });
await p.evaluate(() =>
  localStorage.setItem("volga-cart", JSON.stringify({ state: { items: [{ productId: "p1", slug: "myagkiy-mishka-toptyzhka", title: "Мишка", price: 1890, category: "toys", shopName: "Тёплые лапки", qty: 1 }] }, version: 0 }))
);

for (const path of pages) {
  await p.goto(BASE + path + "?noanim", { waitUntil: "load" }).catch(() => {});
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const iw = window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 398) {
        offenders.push({
          w: Math.round(rect.width),
          el: `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`,
          txt: (el.textContent || "").trim().slice(0, 30),
        });
      }
    }
    offenders.sort((a, b) => a.w - b.w); // innermost (narrowest of the too-wide) first
    return { iw, top: offenders.slice(0, 5) };
  });
  console.log(path, "iw=" + r.iw);
  for (const o of r.top) console.log("   ", o.w, o.el, "|", o.txt);
}
await b.close();
