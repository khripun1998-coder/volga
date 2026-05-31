import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.setViewportSize({ width: 794, height: 1123 });
await page.goto(pathToFileURL(join(__dirname, "presentation.html")).href, { waitUntil: "networkidle" });
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(400);
const n = await page.locator("section.page").count();
for (let i = 0; i < n; i++) {
  await page.locator("section.page").nth(i).screenshot({ path: join(__dirname, "shots", `page-${i}.png`) });
}
await browser.close();
console.log("pages", n);
