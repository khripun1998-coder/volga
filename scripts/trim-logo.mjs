import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renameSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logo = join(__dirname, "..", "public", "logo.png");
const tmp = join(__dirname, "..", "public", "logo.__tmp.png");

await sharp(logo)
  .trim({ threshold: 10 })
  .png()
  .toFile(tmp);

renameSync(tmp, logo);
const meta = await sharp(logo).metadata();
console.log(`trimmed logo: ${meta.width}x${meta.height}`);
