import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themes = JSON.parse(readFileSync(join(__dirname, "themes.json"), "utf8"));

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1320, height: 940 }, deviceScaleFactor: 2 });
const pageObj = await ctx.newPage();

for (const t of themes) {
  const url = pathToFileURL(join(__dirname, "mockups", `${t.id}.html`)).href;
  await pageObj.goto(url, { waitUntil: "networkidle" });
  try { await pageObj.evaluate(() => document.fonts.ready); } catch {}
  await pageObj.waitForTimeout(1400);
  // fold
  await pageObj.screenshot({ path: join(__dirname, "shots", `${t.id}-fold.png`), clip: { x: 0, y: 0, width: 1320, height: 940 } });
  // full
  await pageObj.screenshot({ path: join(__dirname, "shots", `${t.id}-full.png`), fullPage: true });
  console.log("shot", t.id);
}

await browser.close();
console.log("done");
