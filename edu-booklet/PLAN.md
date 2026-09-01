# Educational Leadership Booklet — Production Plan

**Piece:** 8-page saddle-stitched recruitment booklet, 5.5 × 8.5 in finish size
**Audience:** Working teachers in Christian K–12 education considering the MWS-E or MA-EL
**Primary use:** Conference/convention tables and info-session leave-behinds
**Scope:** Master's programs only (MWS-E + MA-EL). No certificates (per decision).
**Source of truth:** education.icscanada.edu (this repo), rendered in the education site's own brand (purple/red/cream, Libre Baskerville + Outfit) — *not* the F2BF teal/Playfair system.
**Build location:** `edu-booklet/` (this folder), following the F2BF pipeline in `booklet/` with the improvements noted in §7.

---

## 1. Strategy (what the research says, applied)

This is a viewbook for **adult, nontraditional students**, and the research is unambiguous about how that differs from an undergrad piece:

1. **Answer the three questions early:** How much time? How much money? Will it advance my career/calling? These go on the first inside spread, not buried at the back. Vagueness on cost reads as evasion to working adults.
2. **Lead with calling, not credentials.** For Christian-school teachers, a master's is stewardship of a vocation. The site already has this language and it's strong — the booklet borrows it verbatim rather than inventing new copy.
3. **Don't soften the faith language.** The most-cited faith-based marketing mistake is diluting Christian identity into generic "values" phrasing. Use the site's own vocabulary: *Reformational tradition, the love embodied by Christ, image-bearers, God's ongoing redemptive work*.
4. **Name the barriers and kill them:** "fully online, no Toronto visits," "part-time only — built for working educators," "one course per term," "summer courses pause in July so you can enjoy your break," "small cohorts of up to 12."
5. **One primary CTA, repeated:** the inquiry form ("the Registrar follows up within 2 business days" is a great friction-killer), via QR code ≥0.8 in with a benefit caption, on p.7 and the back cover.
6. **Emotional exclamation point, not a catalog.** Course rotations, FAQ detail, and language requirements stay on the website; the booklet drives the reader there.

Since the piece lives on conference tables, the **cover must work at arm's length**: one aspirational headline in large Libre Baskerville over a strong photo, minimal other text.

## 2. Page-by-page architecture

An 8-page saddle-stitch reads as: cover · spread 2–3 · center spread 4–5 · spread 6–7 · back cover. One idea per spread.

### P1 — Front cover
- Full-bleed classroom/seminar photo (Lightroom set), warm purple duotone or purple scrim for brand cohesion + text legibility.
- Eyebrow: `INSTITUTE FOR CHRISTIAN STUDIES · TORONTO | ONLINE`
- Headline (the site's best line): **"Teaching is more than a job."** Sub: *"It's a practice shaped by faith, story, and the lives entrusted to our care."*
- Footer strip: "Graduate Programs in Educational Leadership — MWS-E · MA-EL" + ICS logo (white variant).

### P2–3 — "A Different Kind of Graduate School" (why ICS + the three questions)
- **P2:** Mission block ("Where Faith, Wisdom, and Educational Practice Intersect" / "step out of the daily rush…") + the four pillars from the homepage: Biblically Rooted · Designed for Working Educators · Community of Practice · Accessible & Affordable.
- **P3:** **"Built Around Your School Year"** fact panel — the barrier-killers: fully online (async + live Zoom sessions), part-time only, one course per term, no Toronto visits required, cohorts ≤ 12, summer pause in July, $1,500 per course with $500/semester bursary. Bottom: a slim "Two paths" teaser table (MWS-E ~2 yrs / practice-focused / ~$7–8.5K vs MA-EL ~3 yrs / research-depth / ~$17K) pointing into the center spread. Site's own footnote as caption: *"Both programs share the same rich course catalogue and community."*

### P4–5 — Center spread: the two programs, face to face
Identical parallel layouts (mirrored), MWS-E left (red accent #C83C2C), MA-EL right (orange accent #F1AB6A → use darker #D89450 on cream for contrast):
- Program name + positioning line ("Develop Your Practice, Enhance Your Career" / "Contribute to the Conversation").
- At-a-glance stat row: duration · courses/credits · capstone · est. total cost · start terms.
- "Who it's for" paragraph (site copy, condensed).
- 2–3 distinctives: MWS-E — Action Project *in your own school*, two capstone pathways, three entry points/year. MA-EL — four concentrations (incl. Inclusion & Literacy with Calvin University), Praxis & Project capstone in flexible form (podcast, curriculum, journal article…), pathway to PhD.
- Footer band across the spread: 3–4 course titles as social proof of tone: *Called to Teach · Lead From Where You Are · Cultivating Learning Communities of Belonging · What Is Christian About Christian Education?*

### P6 — Faculty: "Learn from Faculty Who Walk Alongside You"
- 4 headshots (van der Boom, Strauss, DeRoo, Ansell) with name, title, one credibility line each (van der Boom's 2026 Cascade book; Strauss as Academic Dean; DeRoo's PD work with Christian day-school teachers; Ansell's theology).
- Pull quote: **"Our small cohort model means you're not a number. You're a colleague."**
- One faculty voice quote (van der Boom: "each student is uniquely created by God…") — stands in for the testimonials the site doesn't have (see §6).

### P7 — Cost, aid & how to apply
- **Money panel, plainly stated:** $500/credit → $1,500/course · $500 bursary per semester · **$100 group rebate** when 2+ educators from the same school take the same course (great conference hook — "bring a colleague") · employer PD funds note · all CAD.
- **Apply in 3 steps:** ① Submit the inquiry form (QR) → ② Registrar follows up within 2 business days → ③ Complete your application (purpose statement, transcripts, references, writing sample — one summary line, not the full checklist).
- Deadlines table: MWS-E Apr 1 / Aug 1 / Dec 1 · MA-EL Apr 1 / Nov 1.
- "Not ready to commit?" line: take a course as a **non-degree student** and credit it later.

### P8 — Back cover
- Purple-deep (#1F0F3D) full bleed, typographic.
- CTA headline: **"Ready to Think Deeper About Your Calling?"**
- QR code (≥0.9 in, high ECC, embedded locally) + caption *"Scan to start the conversation"* + URL `education.icscanada.edu`.
- Contact: academic-registrar@icscanada.edu · 1-888-326-5347 · 59 St. George Street, Toronto.
- Credential line: *"ICS is a graduate school in the Reformational tradition, affiliated with the University of Toronto through the Toronto School of Theology, granting degrees under a charter of the Ontario Legislature."*
- ICS logo (white), red diamond divider motif.

## 3. Design system (from `css/shared.css`)

| Element | Spec |
|---|---|
| Display type | Libre Baskerville 400/700 + italic; italic-accent treatment for emphasized words (site's signature) |
| Text type | Outfit 400/500/600/700; body 9.5–10.5pt, leading ~135–140% |
| Eyebrows | Outfit uppercase, 0.22em letter-spacing |
| Palette | Purple #2D1854 / deep #1F0F3D · Red #C83C2C · Orange #F1AB6A (dark var #D89450) · Cream #FAF7F2 / #F0EBE3 · text-on-dark #E4DFD6 |
| Motifs | Square corners throughout; 7px 45°-rotated red diamond + hairline section dividers; 3px offset accent frame behind photos; footer wave SVG optional on back cover |
| Photos | Purple duotone/scrim treatment on atmosphere shots for cohesion; headshots in squares with offset accent frame |

Print-specific type rules: body text and thin rules in **100K black** (or solid brand purple), never rich black under ~12pt; captions no smaller than 7.5pt; nothing critical reversed out of busy photo areas.

## 4. Imagery plan (photo-forward, locally embedded)

**Rule: no hotlinking.** One Lightroom URL already returns an anti-hotlink guard; all images get downloaded once into `edu-booklet/img/` and referenced locally (or inlined as data URIs) at build time.

| Asset | Source | Verified size | Use |
|---|---|---|---|
| Classroom/seminar photos (~8 usable) | Adobe Lightroom CDN (site heroes) | 2048px wide → ~355dpi at full-bleed width | Cover + section imagery |
| Faculty headshots ×4 | Squarespace CDN | 808–1083px sq → ≤2.7–3.6 in @300dpi | P6 at ≤2 in each |
| ICS logo (white / red / black) | constantcontact URLs in `ICS-Graphics.xlsx` | 900–1200px wide | Cover + back cover, ≤2.5 in wide |
| QR code | Generated at build time, embedded | 600px+, ECC H | P7 + P8 |

Excluded: the Unsplash stock photo and the two images marked `<!-- PLACEHOLDER -->` on the MA-EL page. Squarespace serves WebP by default — fetch with an `Accept: image/jpeg` header or convert, since the print pipeline wants JPEG/PNG.

**Risk to flag:** no vector logo exists anywhere (raster only, max 1200px). Fine at booklet sizes; if ICS has an SVG/EPS master, swapping it in is a nice-to-have.

## 5. Print production specs

Same artboard system as F2BF, plus corrections from the print research:

- **Trim** 5.5 × 8.5 in · **bleed** 0.125 in → artboard **5.75 × 8.75 in** · safe area 0.375 in from artboard edge (0.25 in inside trim).
- **Add:** spine-side safe margin ≥ 0.375 in inside trim on every page (F2BF used a uniform margin; content near the fold sinks into a saddle-stitched spine).
- Crop-marks version: 6.25 × 9.25 in artboard, L-ticks 0.125 in long / 0.5pt, offset 0.125 in past bleed (reuse F2BF geometry).
- **Single pages in reading order** (p1…p8) — never printer's spreads; the printer imposes. Design spread crossovers (p4–5 footer band) so each half survives ±1/16 in misalignment at the fold.
- Rich dark areas: large purple fields specified with a CMYK-safe build (approx. C85 M100 Y25 K25 for #2D1854 — verify against the printer's profile); total ink ≤ 300%.
- Images 300dpi at final size; fonts embedded by the renderer.
- **Deliverables** (mirroring the F2BF set):
  1. `EDU-booklet.pdf` — 5.75 × 8.75, bleed only, RGB
  2. `EDU-booklet-cropmarks.pdf` — 6.25 × 9.25, crop marks, RGB
  3. CMYK versions of both (Ghostscript `-sColorConversionStrategy=CMYK`, U.S. Web Coated/GRACoL intent)
  4. Reduced-size preview PDF for email/review
- **Printer order specs to include with the files:** 8pp self-cover saddle stitch OR 4pp cover + 4pp text; recommended stock 100lb matte/silk text with 100lb cover (score the cover); confirm whether the shop wants marks or bleed-only, and PDF/X-1a vs plain high-quality PDF.

## 6. Content issues to resolve BEFORE print (site contradictions)

The site contradicts itself on several facts. Print is unforgiving — these need one authoritative answer each. Proposed resolutions below; **confirm or correct each**:

| # | Issue | Site says | Proposed for booklet |
|---|---|---|---|
| 1 | MWS-E credit hours | 21 (FAQs) / 24 (comparison table) / 30 (admission page) | Say "6–7 courses" and avoid a credit number, or confirm the real figure |
| 2 | MA-EL credit hours | 45 (everywhere) / 36 (admission page) | 45 |
| 3 | MA-EL cost math | $21,000 − $5,000 bursary = $16,000, but "~$17,280" printed on 4 pages | Confirm the real net figure; booklet prints one number only |
| 4 | MWS-E cost | "~$8,560" headline vs "$7,060–$8,560" in FAQ | Print the range with "pathway-dependent" note |
| 5 | MA-EL delivery | "Hybrid" (homepage card + schema) vs "Fully Online, no Toronto visits" (program page + FAQ) | Fully Online (assume homepage tag is stale) |
| 6 | Zoom cadence | "biweekly" vs "~6 per course" | "asynchronous with ~6 live Zoom sessions per course" |
| 7 | Registrar contact | `/mael-apply/` still says "Matthew will walk you through…" | Booklet says "the Academic Registrar"; optionally supply a real name + direct line (print pieces convert better with a person) |

**Missing content the booklet would benefit from (optional, user-supplied):**
- **Testimonials: the site has zero student/alumni quotes.** Highest-converting element for adult learners. If you can supply even one named quote from a current student or graduate, it goes on P6 (or replaces the course band on P4–5). Otherwise the faculty quote stands in.
- **Salary-grid recognition:** teachers evaluating a master's often ask about QECO/OCT category or pay-scale implications. The site says nothing. If ICS has an approved answer, one line on P7 is worth a lot; if not, omit (don't guess in print).
- Program launch year / any enrollment or outcomes numbers, if they exist.

## 7. Build pipeline

Reuse the F2BF approach with three changes:

1. **Source:** `edu-booklet/index.html` — one artboard file, 8 `<section class="page">` blocks, on-screen trim/safe guides, `@page 5.75in 8.75in`.
2. **Renderer:** the F2BF script hardcodes Edge on Windows; this environment is Linux. Use the Playwright + bundled-Chromium pipeline (`render-html` skill) or port `_build-pdfs.py` to Chromium headless. Same crop-wrap injection logic (regex wrap of `.page` sections) carries over.
3. **Assets local:** `img/` folder populated by a one-time `fetch-assets` step (with WebP→JPEG conversion); QR generated at build time and embedded. No network dependency at render time — the F2BF booklet's hotlinked images are a re-render time bomb this booklet avoids.
4. **CMYK step:** scripted Ghostscript conversion so all four deliverables come from one command.

### Execution order (when approved)
1. Resolve §6 items 1–7 with you; collect optional testimonial/QECO line.
2. Fetch + convert assets into `edu-booklet/img/`; pick the best cover photo (I'll shortlist 2–3).
3. Write copy deck per §2 (all text drawn from site language, condensed).
4. Build `index.html` design; iterate with you on screen (guides visible).
5. Build script → 4 PDFs + preview; visual QA at 100% zoom on every page edge/fold.
6. Deliver with a one-page printer spec note.

---

*Research inputs: full content inventory of all 16 site pages; print-industry best practices for adult-learner grad viewbooks (Caylor, Hanover, Stamats, Mighty Citizen, Element451), saddle-stitch production guides (Formax, Greenerprinter, Smartpress, PrintingCenterUSA), QR/print-craft references. Ask if you want the full research notes.*
