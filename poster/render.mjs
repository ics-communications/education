/**
 * Educational Leadership at ICS — 8.5×11 office-printer poster renderer.
 *
 *   node poster/render.mjs          (from the education repo root)
 *
 * Add `alt` as an argument to build the 11×17-style alternate instead.
 *
 * 1. Writes the QR (as inline SVG) into the HTML between the <!--QR--> markers.
 * 2. Renders  poster/out/ics-education-poster-letter.pdf   ← print this
 *             poster/out/ics-education-poster-letter.png   (300 DPI proof)
 * 3. Decodes the QR back out of the render at 300/150/96/72 DPI with a separate
 *    library (jsQR). Exits non-zero if any decode fails — never print a dead code.
 *
 * Dependencies (playwright, qrcode, jsqr, pngjs) are borrowed from the sibling
 * f2bf repo's .render/ folder, so nothing needs installing here. Override with
 * RENDER_DEPS=/path/to/dir-with-node_modules if that repo lives elsewhere.
 */
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const deps = process.env.RENDER_DEPS || path.resolve(here, '../../f2bf/.render');
const require = createRequire(path.join(deps, 'package.json'));
const { chromium } = require('playwright');
const QRCode = require('qrcode');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

const ALT = process.argv[2] === 'alt';   // `alt` renders the 11×17-style variant
const SOURCE = path.join(here, ALT ? 'education-poster-letter-alt.html' : 'education-poster-letter.html');
const OUT = path.join(here, 'out');
const NAME = ALT ? 'ics-education-poster-letter-alt' : 'ics-education-poster-letter';
const URL = 'https://education.icscanada.edu/?utm_source=poster&utm_medium=print&utm_campaign=edu-letter-poster' + (ALT ? '-alt' : '');

/* ── 1. QR → inline SVG (vector, so it stays sharp at any print DPI) ── */
const qr = QRCode.create(URL, { errorCorrectionLevel: 'M' });
const n = qr.modules.size, q = 4, dim = n + q * 2;
let d = '';
for (let y = 0; y < n; y++) {
  let x = 0;
  while (x < n) {
    if (!qr.modules.get(y, x)) { x++; continue; }
    let run = 1;
    while (x + run < n && qr.modules.get(y, x + run)) run++;
    d += `M${x + q} ${y + q}h${run}v1h-${run}z`;
    x += run;
  }
}
const svg = `<svg viewBox="0 0 ${dim} ${dim}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR code linking to education.icscanada.edu"><rect class="qr__quiet" width="${dim}" height="${dim}"/><path class="qr__mod" d="${d}"/></svg>`;
const html = fs.readFileSync(SOURCE, 'utf8').replace(/<!--QR-->[\s\S]*?<!--\/QR-->/, `<!--QR-->${svg}<!--/QR-->`);
fs.writeFileSync(SOURCE, html);
console.log(`[ok] QR ${n}×${n} modules → ${URL}`);

/* ── 2. Render ── */
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function open(dpi) {
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: dpi / 96 });
  const page = await ctx.newPage();
  await page.goto('file://' + SOURCE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}

{
  const { ctx, page } = await open(96);
  await page.pdf({ path: path.join(OUT, `${NAME}.pdf`), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
  console.log(`[ok] ${NAME}.pdf`);
  await ctx.close();
}
{
  const { ctx, page } = await open(300);
  await page.locator('.sheet').screenshot({ path: path.join(OUT, `${NAME}.png`) });
  console.log(`[ok] ${NAME}.png (300 DPI proof)`);
  await ctx.close();
}

/* ── 3. Verify the QR decodes to exactly the target URL ── */
let fail = 0;
for (const dpi of [300, 150, 96, 72]) {
  const { ctx, page } = await open(dpi);
  const png = PNG.sync.read(await page.locator('.qr__code').screenshot({ type: 'png' }));
  const got = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data ?? null;
  const ok = got === URL;
  if (!ok) fail++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  QR @${dpi} DPI  ${png.width}px  →  ${got ?? '(no code found)'}`);
  await ctx.close();
}
await browser.close();
process.exit(fail ? 1 : 0);
