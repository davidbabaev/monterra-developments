/**
 * Generates the solid-color placeholder assets that stand in for real
 * photography, colocated with the project that owns them.
 *
 * Re-run with `node scripts/generate-placeholders.mjs`. Delete a file and
 * re-run to regenerate it; existing files are overwritten.
 *
 * No external placeholder service is used, and never will be.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_ROOT = path.join(REPO_ROOT, "content", "projects");

const NAVY = { r: 0x14, g: 0x26, b: 0x3d };
const STONE = { r: 0xc8, g: 0xb9, b: 0xa3 };

const HERO = { width: 1920, height: 1080 };
const GALLERY = { width: 1200, height: 800 };
const FLOOR_PLAN = { width: 1600, height: 1200 };

/** Alternating so a gallery reads as distinct images rather than one repeated block. */
const galleryColor = (index) => (index % 2 === 0 ? STONE : NAVY);

async function writeSolidPng(absolutePath, { width, height }, color) {
  await mkdir(path.dirname(absolutePath), { recursive: true });
  const png = await sharp({
    create: { width, height, channels: 3, background: color },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(absolutePath, png);
  return `${path.relative(REPO_ROOT, absolutePath).split(path.sep).join("/")} (${width}x${height})`;
}

/**
 * A minimal single-page PDF. Byte offsets in the xref table are computed as the
 * body is assembled, so the file is structurally valid rather than merely
 * plausible.
 */
function buildPdf(label) {
  const objects = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>",
    null, // content stream, built below
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];

  const text = `BT /F1 24 Tf 72 700 Td (${label}) Tj ET`;
  objects[3] = `<</Length ${Buffer.byteLength(text, "latin1")}>>stream\n${text}\nendstream`;

  const header = "%PDF-1.4\n";
  const offsets = [];
  let body = "";

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(header + body, "latin1"));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(header + body, "latin1");
  const xref =
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  const trailer = `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(header + body + xref + trailer, "latin1");
}

async function writePdf(absolutePath, label) {
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buildPdf(label));
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join("/");
}

/** Mirrors the `media` block of each seed project's frontmatter. */
const PLAN = [
  { slug: "monterra-ridge", galleryCount: 4, floorPlans: ["plan-a", "plan-b"], pdfPlans: ["plan-a"] },
  { slug: "monterra-bay", galleryCount: 0, floorPlans: [], pdfPlans: [] },
  { slug: "the-larkin", galleryCount: 4, floorPlans: [], pdfPlans: [] },
];

async function main() {
  const written = [];

  for (const project of PLAN) {
    const root = path.join(PROJECTS_ROOT, project.slug);

    written.push(await writeSolidPng(path.join(root, "hero.png"), HERO, NAVY));

    for (let index = 0; index < project.galleryCount; index += 1) {
      const name = `${String(index + 1).padStart(2, "0")}.png`;
      written.push(
        await writeSolidPng(path.join(root, "gallery", name), GALLERY, galleryColor(index)),
      );
    }

    for (const plan of project.floorPlans) {
      written.push(
        await writeSolidPng(path.join(root, "plans", `${plan}.png`), FLOOR_PLAN, STONE),
      );
    }

    for (const plan of project.pdfPlans) {
      const label = `[REPLACE] ${plan.replace(/-/g, " ").toUpperCase()}`;
      written.push(await writePdf(path.join(root, "plans", `${plan}.pdf`), label));
    }
  }

  console.log(written.map((line) => `  ${line}`).join("\n"));
  console.log(`\n${written.length} placeholder assets written.`);
}

await main();
