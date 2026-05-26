import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "docs/shots";
fs.mkdirSync(OUT, { recursive: true });

const cart = {
  state: {
    items: [
      { productId: "p1", slug: "myagkiy-mishka-toptyzhka", title: "Вязаный мишка «Топтыжка»", price: 1890, category: "toys", shopName: "Тёплые лапки", variant: "Цвет: Молочный", qty: 1 },
    ],
  },
  version: 0,
};

const shots = [
  { name: "m-home", url: "/?noanim" },
  { name: "m-catalog", url: "/catalog?noanim" },
  { name: "m-product-table", url: "/product/stol-reka-dub-epoksi?noanim" },
  { name: "m-shops", url: "/shops?noanim" },
  { name: "m-account", url: "/account?noanim" },
  { name: "m-seller", url: "/seller?noanim" },
  { name: "m-admin", url: "/admin?noanim" },
  { name: "m-checkout", url: "/checkout?noanim" },
];

async function revealAll(page) {
  await page.evaluate(
    () => new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y); y += 400;
        if (y < document.body.scrollHeight) setTimeout(step, 80);
        else { window.scrollTo(0, 0); setTimeout(res, 450); }
      };
      step();
    })
  );
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const page = await ctx.newPage();
await page.goto(BASE + "/?noanim", { waitUntil: "load" });
await page.evaluate((c) => localStorage.setItem("volga-cart", JSON.stringify(c)), cart);

for (const s of shots) {
  await page.goto(BASE + s.url, { waitUntil: "load" }).catch(() => {});
  await page.waitForTimeout(800);
  await revealAll(page);
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
  console.log("shot", s.name);
}
await browser.close();
console.log("done");
