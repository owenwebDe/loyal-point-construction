// Builds the work-photo manifest used by the site.
//
//   npm run media
//
// Client photos: assets/photos/<category>/* (sorted from the assets/client-image inbox).
// Sub-folder names map to the "What We Build" categories (see CATEGORIES); anything
// else still appears in the Our Work gallery as "other".
//
// Per category, the client's photos win. A category with no client photos yet falls
// back to sample photos in assets/placeholders (real Nigerian site and workshop photos
// from Wikimedia Commons, credited in assets/placeholders/credits.json and on /credits).
// The script lists which categories are still on samples so they can't ship unnoticed.
//
// Optional, in assets/photos/:
//   featured.json  the three Featured Work photos
//                  [{ "file": "safety-doors/door2.jpg", "title": "Double Safety Door" }]
//   captions.json  per-photo alt text { "safety-doors/door1.jpg": "Glossy brown ..." }
//
// Client photos get a light, consistent grade so phone shots sit together.
// Output: public/media/work/*.webp (max 1600px, EXIF-rotated) + src/data/work.json

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CLIENT_DIR = path.join(ROOT, "assets/photos");
const PLACEHOLDER_DIR = path.join(ROOT, "assets/placeholders");
const OUT_DIR = path.join(ROOT, "public/media/work");
const MANIFEST = path.join(ROOT, "src/data/work.json");
const MAX_EDGE = 1600;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;

// Photo folders are named after the service slugs in src/content/site.ts.
const CATEGORIES = {
  "iron-burglary": "Iron Burglary",
  "safety-doors": "Safety Doors",
  windows: "Windows",
  containers: "Containers",
  "general-repairs": "General Repairs",
  "iron-bending": "Iron Bending",
  "pillars-columns": "Pillars / Columns",
  beams: "Beams",
  decking: "Decking",
};
const FEATURED_FALLBACK = ["safety-doors", "iron-burglary", "windows"];

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (IMAGE_EXT.test(entry.name)) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

const categoryOf = (rel) => {
  const [first, ...rest] = rel.split("/");
  return rest.length && CATEGORIES[first] ? first : "other";
};

/** Light, even grade for phone photos: a touch more contrast, a little less saturation, soft vignette. */
async function graded(file) {
  // Resize first so the vignette is built at the final size (sharp composites after resizing).
  const { data, info } = await sharp(file)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .modulate({ saturation: 0.9, brightness: 0.97 })
    .linear(1.07, -128 * 0.07)
    .toBuffer({ resolveWithObject: true });
  const vignette = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}">
      <defs><radialGradient id="v" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#fff"/><stop offset="100%" stop-color="#a6a6a6"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`,
  );
  return sharp(await sharp(data).composite([{ input: vignette, blend: "multiply" }]).toBuffer());
}

async function main() {
  const clientFiles = await walk(CLIENT_DIR);
  const clientCategories = new Set(clientFiles.map((f) => categoryOf(path.relative(CLIENT_DIR, f).split(path.sep).join("/"))));
  const stockFiles = (await walk(PLACEHOLDER_DIR)).filter(
    (f) => !clientCategories.has(categoryOf(path.relative(PLACEHOLDER_DIR, f).split(path.sep).join("/"))),
  );
  const sources = [
    ...clientFiles.map((file) => ({ file, baseDir: CLIENT_DIR, source: "client" })),
    ...stockFiles.map((file) => ({ file, baseDir: PLACEHOLDER_DIR, source: "placeholder" })),
  ];

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
  const captions = (await readJson(path.join(CLIENT_DIR, "captions.json"))) ?? {};
  // Sample photos (Wikimedia Commons, CC BY / CC BY-SA): author + license for /credits.
  const stockCredits = (await readJson(path.join(PLACEHOLDER_DIR, "credits.json"))) ?? {};

  const items = [];
  const counters = {};
  const seen = new Map(); // content hash -> first file, so resent duplicates appear once
  for (const { file, baseDir, source } of sources) {
    const rel = path.relative(baseDir, file).split(path.sep).join("/");
    const category = categoryOf(rel);
    const id = slugify(rel);

    try {
      const fullHash = createHash("sha1").update(await fs.readFile(file)).digest("hex");
      if (seen.has(fullHash)) {
        console.log(`  ${rel}: duplicate of ${seen.get(fullHash)}, skipped`);
        continue;
      }
      seen.set(fullHash, rel);
      counters[category] = (counters[category] ?? 0) + 1;
      const name = `${id}-${fullHash.slice(0, 8)}.webp`;
      const pipeline = source === "client" ? await graded(file) : sharp(file).rotate();
      const info = await pipeline
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(path.join(OUT_DIR, name));
      const blur = await sharp(path.join(OUT_DIR, name))
        .resize({ width: 16, height: 16, fit: "inside" })
        .webp({ quality: 40 })
        .toBuffer();

      const label = CATEGORIES[category] ?? "Our work";
      items.push({
        id,
        file: rel,
        source,
        src: `/media/work/${name}`,
        width: info.width,
        height: info.height,
        blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
        category,
        // Only the client's own photos may say "by Loyal Point"; samples describe themselves.
        alt:
          source === "client"
            ? captions[rel] || `${label} by Loyal Point Construction, photo ${counters[category]}`
            : `Sample photo, ${label.toLowerCase()} work in Nigeria: ${(stockCredits[rel]?.title ?? rel).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ")}`,
        ...(source === "placeholder" && stockCredits[rel] ? { credit: stockCredits[rel] } : {}),
      });
      console.log(`  [${source}] ${rel} -> ${info.width}x${info.height}`);
    } catch (error) {
      console.warn(`  skipped ${rel}: ${error.message}`);
    }
  }

  // Featured: the client's pick, else the old placeholder pick (only if those files are
  // still in use), else the first photo of a few key categories, client photos first.
  const byFile = new Map(items.map((item) => [`${item.source}:${item.file}`, item]));
  const pick = (list, source) =>
    (Array.isArray(list) ? list : [])
      .map(({ file, title }) => {
        const item = byFile.get(`${source}:${file}`);
        return item ? { id: item.id, title } : null;
      })
      .filter(Boolean);
  let featured = [
    ...pick(await readJson(path.join(CLIENT_DIR, "featured.json")), "client"),
    ...pick(await readJson(path.join(PLACEHOLDER_DIR, "featured.json")), "placeholder"),
  ].slice(0, 3);
  if (featured.length < 3) {
    const taken = new Set(featured.map((f) => f.id));
    const ordered = [...items.filter((i) => i.source === "client"), ...items.filter((i) => i.source !== "client")];
    const pool = [...FEATURED_FALLBACK.flatMap((cat) => ordered.filter((i) => i.category === cat).slice(0, 1)), ...ordered];
    for (const item of pool) {
      if (featured.length >= 3) break;
      if (taken.has(item.id)) continue;
      taken.add(item.id);
      featured.push({ id: item.id, title: CATEGORIES[item.category] ?? "Our Work" });
    }
  }

  const stockCategories = [...new Set(items.filter((i) => i.source === "placeholder").map((i) => i.category))];
  const source = !stockCategories.length ? "client" : items.some((i) => i.source === "client") ? "mixed" : "placeholder";
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(
    MANIFEST,
    JSON.stringify({ source, placeholderCategories: stockCategories, items, featured }, null, 2) + "\n",
  );
  const real = items.filter((i) => i.source === "client").length;
  console.log(`${items.length} photos: ${real} client, ${items.length - real} stock. Featured: ${featured.map((f) => f.id).join(", ")}`);
  if (stockCategories.length) console.warn(`STILL ON STOCK PLACEHOLDERS: ${stockCategories.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
