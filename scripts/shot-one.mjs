import { chromium } from "playwright-core";

const url = process.argv[2] || "/";
const out = process.argv[3] || "docs/shots/one.png";

const b = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1.25 });
const p = await ctx.newPage();
await p.goto("http://localhost:3000" + url, { waitUntil: "load" });
await p.waitForTimeout(1300);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log("ok", out);
