import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const C = ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(existsSync);
const b = await chromium.launch({ executablePath: C, headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 1040 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(join(__dirname, "concepts.html")).href, { waitUntil: "networkidle" });
try { await p.evaluate(() => document.fonts.ready); } catch {}
await p.waitForTimeout(400);
const hand = await p.$(".hand-scene");
await hand.screenshot({ path: join(__dirname, "hand-closeup.png") });
await b.close();
console.log("ok");
