import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renameSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const hero = join(__dirname, "..", "public", "hero.png");
const tmp = join(__dirname, "..", "public", "hero.__tmp.png");

const meta = await sharp(hero).metadata();
const W = meta.width;
const H = meta.height;

// Розовая фигурка — слева-внизу по центру, в пустой зоне. Стираем эллипсом.
const cx = Math.round(W * 0.33);
const cy = Math.round(H * 0.775);
const rx = Math.round(W * 0.09);
const ry = Math.round(H * 0.085);

const mask = Buffer.from(
  `<svg width="${W}" height="${H}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/></svg>`
);

await sharp(hero)
  .composite([{ input: mask, blend: "dest-out" }])
  .png()
  .toFile(tmp);

renameSync(tmp, hero);
console.log(`erased blob at (${cx}, ${cy}) r(${rx}, ${ry}) on ${W}x${H}`);
