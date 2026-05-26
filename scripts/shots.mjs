import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "docs/shots";
fs.mkdirSync(OUT, { recursive: true });

const cart = {
  state: {
    items: [
      {
        productId: "p1",
        slug: "myagkiy-mishka-toptyzhka",
        title: "Вязаный мишка «Топтыжка»",
        price: 1890,
        category: "toys",
        shopName: "Тёплые лапки",
        variant: "Цвет: Молочный",
        qty: 1,
      },
    ],
  },
  version: 0,
};

const shots = [
  { name: "01-home", url: "/?noanim" },
  { name: "02-shops", url: "/shops?noanim" },
  { name: "03-catalog", url: "/catalog?noanim" },
  { name: "04-product-toy", url: "/product/myagkiy-mishka-toptyzhka?noanim" },
  { name: "05-product-table", url: "/product/stol-reka-dub-epoksi?noanim" },
  { name: "06-product-supplier", url: "/product/dub-suhoy-stroganyy?noanim" },
  { name: "07-cart", url: "/cart?noanim" },
  { name: "08-checkout", url: "/checkout?noanim" },
  { name: "09-account", url: "/account?noanim" },
  { name: "10-seller", url: "/seller?noanim" },
  { name: "11-admin", url: "/admin?noanim" },
  { name: "12-login", url: "/login?noanim" },
];

async function revealAll(page) {
  await page.evaluate(
    () =>
      new Promise((res) => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += 500;
          if (y < document.body.scrollHeight) setTimeout(step, 90);
          else {
            window.scrollTo(0, 0);
            setTimeout(res, 500);
          }
        };
        step();
      })
  );
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1360, height: 900 },
  deviceScaleFactor: 1.25,
});
const page = await ctx.newPage();

await page.goto(BASE + "/?noanim", { waitUntil: "load" });
await page.evaluate((c) => localStorage.setItem("volga-cart", JSON.stringify(c)), cart);

for (const s of shots) {
  await page.goto(BASE + s.url, { waitUntil: "load" }).catch(() => {});
  await page.waitForTimeout(900);
  await revealAll(page);
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
  console.log("shot", s.name);
}

await browser.close();
console.log("done");
