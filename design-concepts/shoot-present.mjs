import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const C = ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(existsSync);
const b = await chromium.launch({ executablePath: C, headless: true });
const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.4 });
await p.goto(pathToFileURL(join(__dirname, "presentation.html")).href, { waitUntil: "networkidle" });
try { await p.evaluate(() => document.fonts.ready); } catch {}
await p.waitForTimeout(400);
const secs = await p.$$("section.page");
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: join(__dirname, `pres-${i + 1}.png`) });
await b.close();
console.log("pages:", secs.length);
