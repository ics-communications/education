---
target: edu-booklet design vs marketing brochure practice (text amount and size)
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 4
p1_count: 4
timestamp: 2026-08-06T18-22-25Z
slug: edu-booklet-index-html
---
Method: dual-agent (A: design review · B: detector + measured evidence). Both ran isolated and in parallel; neither saw the other's output.

Surface mode: **Persuade** (print recruitment collateral, conference-table leave-behind).

## Design Health Score

| # | Heuristic (adapted to a print brochure) | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status — does the reader know where they are? | 3 | Section eyebrows do real work; p4/p5 break the pattern by using program names instead of section labels |
| 2 | Match System / Real World | 2 | MWS-E, MA-EL, "Worldview Studies", "(Philosophy)", "Praxis & Project", "Reformational", "Pathway A" — none glossed. No QECO/OCT pay-grid answer |
| 3 | User Control and Freedom — shallow read vs deep read | 1 | No skim layer anywhere. Every page demands paragraph reading |
| 4 | Consistency and Standards | 2 | Visual system consistent; type scale is not (25 print sizes). "6–7 courses" vs "10 courses · 45 credit hours" |
| 5 | Error Prevention — stopping a wrong belief forming | 1 | MA-EL credit hours and cost do not reconcile with the booklet's own fee grid |
| 6 | Recognition Rather Than Recall | 2 | Program totals on p4/p5, per-course rate on p7 — two page-turns apart, so the money page has no total |
| 7 | Flexibility and Efficiency — serve the 30-second browser and the 10-minute reader | 1 | Serves only the 10-minute reader, who does not exist at a conference table |
| 8 | Aesthetic and Minimalist Design | 2 | Aesthetic alone would score 4; minimalist fails hard — 1,382 words, 31% below 8pt, near-zero clear space on four pages |
| 9 | Error Recovery — objection handling | 3 | The best content in the piece, all of it whispered at 7.5–8.2pt in grey |
| 10 | Help and Documentation — routes onward | 3 | Comprehensive routes, but no human name and URLs set in 7.2pt tracked caps |
| **Total** | | **20/40** | **Acceptable — significant improvements needed** |

No heuristic scored n/a; all ten adapt cleanly to print.

## Design Specificity Verdict

**Partially authored. The typography is ICS's own; the architecture and imagery are borrowed.**

**LLM assessment.** The italic-accent display device — Libre Baskerville bold with exactly one word flipped to italic in the accent colour — runs on 8 of 8 headlines and is a genuine signature. With the 45° red diamond dividers, the 3px offset frame behind headshots, and red/orange program coding carried faithfully from p3's teaser through the centre spread to p7's deadline table, this is a real house style. Underneath it, every page is the default higher-ed template: eyebrow, two-line serif head, intro paragraph, label-value table, bulleted distinctives, tracked-out URL footer. There is not one visual idea in the booklet — no diagram, no timeline of a part-time path, no data graphic. Everything is a table. Only two photographs appear in the whole piece (cover and p2), and neither says "Christian K–12 teaching": p2's is an empty stairwell and windows with no people in it, on a page selling "community of practice."

**Deterministic scan.** `detect.mjs` exited 2 with 2 warnings, both `slop`. `side-tab` at line 342 (`.factpanel` left rule) is a **false positive for this medium** — the rule targets AI-generated card UIs; a left rule on a print fact panel is standard typography, and the detector missed a second instance at line 379 anyway. `em-dash-overuse` is **accurate**: 19 em-dashes in rendered copy, roughly 1 per 73 words, though 2 sit inside verbatim student quotes. No `border-radius` anywhere, consistent with the plan's "square corners throughout."

**Visual overlays.** Not available. I rendered all 8 pages, 3 spreads and a squint set via headless Chromium rather than running the live-server injection flow, so there is no user-visible overlay in a browser tab. The rendered PNGs are the fallback evidence and they are what the density findings below are measured from.

## Overall Impression

This is a well-art-directed piece that has been asked to do a website's job. The content strategy is smarter than the layout, and the layout is what is letting it down.

The single biggest opportunity: **the copy that needs cutting and the type size that needs raising are the same problem.** Roughly 400 words are duplicated or disposable, and they are precisely what pushed the type down. Cut them and the space to set the whole book at a legible scale appears for free.

## What's Working

1. **The italic-accent display system**, executed on 8 of 8 headlines. A designer could hand this to someone else and have it come back right.
2. **The p4–p5 mirrored centre spread** — five identical stat rows in identical order, three bullets each, comparison happening across the gutter without vertical eye movement. Structurally the correct answer to "which program?"
3. **The objection-handling content strategy.** "Summer courses pause so you can enjoy your break." "No Toronto visits required." "You may study at a slower pace." "Not ready to commit? Take a course first." Most competitors say none of this.
4. **Production hygiene.** Spine-side margin asymmetry is correct for saddle-stitch on all 8 pages, no element crosses a safe line, every full-bleed element genuinely reaches the bleed edge, QR codes are ECC-H and correctly sized.

## Priority Issues

### [P0] The pages are over budget and the type paid for it

Measured against a working norm of 100–150 words per page for a 5.5×8.5in persuade-mode leave-behind:

| Page | Words | Elements | Over budget |
|---|---|---|---|
| 1 cover | 33 | 5 | — |
| 2 | 145 | 13 | on budget |
| 3 | 218 | 38 | +56% |
| 4 | 189 | 26 | +35% |
| 5 | 199 | 26 | +42% |
| 6 | 239 | 21 | +71% |
| 7 | 267 | 36 | +91% |
| 8 back | 92 | 10 | — |
| **Total** | **1,382** | **175** | |

Spread totals: p2+p3 = 363, p4+p5 = 388, **p6+p7 = 506**. A spread opens to 11×8.5in — the p6–p7 spread is a densely set letter page inside a brochure.

1,382 words is about 6.5 minutes of reading. A conference browser gives 30–45 seconds, or 110–165 words. **The booklet supplies roughly nine times the copy that will ever be read.**

**Why it matters:** the squint renders make this visible — p3 and p7 resolve to grey texture with no entry point. "FULLY ONLINE. NO TORONTO VISITS REQUIRED," the most objection-killing fact in the piece, has exactly the same visual weight as "JULY."

**Fix:** cut ~400 words (28%) and spend every recovered pica on size and air. Not a 10% trim.

**Suggested command:** `/impeccable distill`

### [P0] The type scale is a fit-to-box artifact, not a hierarchy

- **25 distinct print type sizes** across 8 pages (26 counting screen-only chrome). Three are dead CSS: `.d-xl` 26pt, `.d-sm` 19pt, `.eyebrow--lg` 7.5pt.
- **Thirteen sizes live inside the 6.8–9.5pt band** — a 2.7pt range in which the eye can distinguish maybe four steps. Six of them (8.0 / 8.2 / 8.4 / 8.6 / 8.7 / 8.8) are packed into 0.8pt. An 8.6-vs-8.7 distinction is a 1.2% difference and communicates nothing.
- **428 words (31% of all copy) are set below 8pt.** 160 words sit below the plan's own 7.5pt caption floor, across 12 CSS rules at 6.8 / 7 / 7.2pt.
- The plan specifies "body 9.5–10.5pt." `.body` is 9.5pt, but `.body--sm` at 8.7pt carries p6's intro.

This is not a hierarchy; it is the residue of dialling font sizes down a tenth of a point at a time to make copy fit a box. That process is visible in the CSS and it is visible on the page.

Worst instance: `.fac__title` on p6 — "ASSOCIATE PROFESSOR OF PHILOSOPHY OF EDUCATION AND PRACTICE OF PEDAGOGY · DIRECTOR, MA-EL & MWS-E" — 97 characters of letterspaced red all-caps at 6.8pt, wrapping to two lines. In the squint render the red title bars are visually **louder than the professors' names**, which is a hierarchy inversion, and it is unreadable in a convention hall regardless.

**Fix:** collapse to five steps — 10pt body / 9pt secondary / 8.5pt caption / 8pt label / nothing below 8pt. Delete 6.8, 7.0, 7.2, 7.8, 8.2, 8.4, 8.6, 8.7. Cut the faculty titles to "Director, MA-EL & MWS-E."

**Suggested command:** `/impeccable typeset`

### [P0] The cover does not say what the product is

At squint size the only surviving element is "Teaching is more than a job." The eyebrow (7pt reversed on photo), the sub (10.5pt italic) and the footer strip (7pt at 80% opacity) are all mush.

**The word "master's" does not appear until page 6, inside a student's quote. "Degree" first appears on page 7.** The cover offers "MWS-E · MA-EL" — two meaningless strings — unexpanded until page 4.

**Why it matters:** for the stated primary use case, a stack competing with twenty other stacks on a conference table, the cover has about two seconds to say "online part-time master's for Christian educators." It currently says a beautiful non-specific thing about teaching. If a browser cannot tell it is a graduate programme brochure, they do not pick it up.

**Fix:** replace the poetic sub with the offer at 12–13pt — "An online, part-time master's for Christian educators" — and move the poetry to p2.

**Suggested command:** `/impeccable clarify`

### [P0] The cover image is 156 dpi — 52% of spec

`img/seminar-table.jpg` is 2048×1365, a 3:2 landscape. The cover artboard is 5.75×8.75in, a 0.657 portrait. Under `background-size: cover` the crop is **height-driven**: 1365px must span 8.75in = **156 dpi**. The plan's claim of "2048px wide → ~355dpi at full-bleed width" only holds for the width-driven case, which is what actually happens on p2 (356 dpi, fine).

**Why it matters:** this is the largest and most scrutinised image in the piece, and it will look soft in print. Every other asset is fine — headshots run 1,122–1,504 dpi, logos 529–581, QR codes 625–715.

**Fix:** source a portrait crop or a 2048px-tall original from the same shoot.

**Suggested command:** `/impeccable polish`

### [P1] The MA-EL numbers do not survive one minute of arithmetic

- p7: "$500 per credit hour" and "$1,500 · 3 credit hours."
- p3 and p5: MA-EL is "10 courses."
- p5 additionally: "45 credit hours."

10 courses × 3 credit hours = **30**, not 45. The two readings also give different money: 10 × $1,500 = $15,000 gross, while 45 × $500 = $22,500 gross → about $17,500 net of the bursary. **The printed "~$17K" is reachable only through the 45-credit-hour model, which the booklet's own per-course arithmetic contradicts.**

The MWS-E figures reconcile perfectly (6 × $1,500 − $2,000 = $7,000; 7 × $1,500 − $2,000 = $8,500 — exactly the printed range), which isolates MA-EL as the error rather than the fee model.

Compounding it, the precision is asymmetric — MWS-E gets "$7,000–$8,500" to the hundred; MA-EL gets "~$17K" with a tilde **and** the redundant word "estimated" under a label already reading EST. NET COST. The vaguer number is the bigger number, and this audience reads that as evasion.

PLAN §6 flagged these as items 1–3 requiring "one authoritative answer each." Each was executed individually but never reconciled against the others or against p7's fee grid.

**Fix:** resolve credit hours before anything else ships; print one figure at MWS-E's precision; delete "estimated"; put the programme total on p7 next to the rates.

**Suggested command:** `/impeccable clarify`

### [P1] Roughly 400 words are duplicated or disposable

Concrete, in order:

- **Four disclaimers say the same thing.** p3's "Zoom sessions are scheduled with consideration for students' time zones. Bursary availability is subject to eligibility." (16 words) — delete. p4 **and** p5 carry an identical 25-word footnote ("All amounts CAD and subject to change…") — print it once across the spread footer. p7's "All amounts are in Canadian dollars. Tuition and fees are subject to change…" (29 words) — delete; p8 already says it. **70 words, 5% of the booklet, spent saying "prices may change" four times.**
- **p2's pillars restate p3's fact panel verbatim.** "Part-time and fully online: one course per term, asynchronous work, and roughly six live Zoom sessions per course" is p3's FORMAT + LIVE SESSIONS rows. "At $1,500 per course with a $500 bursary available each semester…" is p3's PER COURSE + BURSARY rows *and* p7's entire money panel.
- **p3's "Two Paths, One Community" table is a spoiler** — it pre-plays the centre spread two pages early, ~45 words. Delete it, keep only "Both programs, side by side — turn the page. →". p3 drops from 218 to ~116 words and finally becomes a one-idea page.
- **Empty copy on p2:** "Our programs are Biblically informed, deeply contextual, and aligned with your professional passion." — "Biblically informed" is the pillar directly beneath it, "deeply contextual" means nothing, the rest is filler.
- **p7's rebate paragraph restates its own table row** (33 words for what "GROUP REBATE — $100 each" already said). Its QR caption restates step 2.
- **p6's academic apparatus:** "research in systematic and biblical theology, Old Testament wisdom, and eschatology" — a teacher at a conference table does not need "eschatology," and cannot read it at 6.8pt anyway.

**Why it matters:** you are currently paying about 1.5pt of legibility to say "subject to change" four times.

**Suggested command:** `/impeccable distill`

### [P1] Not one persuasive number is set at display size

The largest non-headline type in the book is "MWS-E" and "MA-EL" at 36pt — the two least meaningful strings in the piece — with their expansions at 6.8pt directly above them. Meanwhile **$1,500**, **12 students**, **2 years**, **$500 bursary**, **2 business days**, **0 trips to Toronto** are all set at 8.8pt or smaller inside label-value tables. There is no display-size statistic anywhere.

**Fix:** promote three facts per spread to 18–24pt. On p3: "12" students, "$1,500" a course, "0" trips to Toronto. That alone recovers a third of p3's word count by killing the seven-row fact panel.

**Suggested command:** `/impeccable layout`

### [P1] Whitespace is allocated exactly backwards

Measured largest clear horizontal band per page: p1 0.80in, p2 0.80in, **p3 0.39in, p4 0.32in, p5 0.31in**, p6 0.56in, **p7 0.39in**, p8 0.96in. Type-band coverage peaks at 44.1% on p7.

The back cover has the most air (0.96in clear) and the least to say. Page 7 has 267 words and 0.39in of rest.

Worse, this is a live production risk: vertical slack inside the safe area is **0.064in on p7 (about one-third of one body line), 0.074in on p3, 0.149in on p6**. `.page` is `overflow: hidden`, so any growth clips the last element off the bottom silently rather than erroring. A font-substitution stress test showed the fallbacks set *shorter*, so a font failure is safe — but any renderer or font version that sets 0.36 of a line wider on p7 loses content with no warning.

**Suggested command:** `/impeccable layout`

### [P2] The CTA has no human in it

"the Academic Registrar" appears **five times**. No name, no photo, no direct line — on a page facing p6's promise of "faculty who know your name." PLAN §6 item 7 called for a real person; print converts better with one. A booklet selling small cohorts and individualised mentoring that routes every reader to an anonymous office is a self-contradiction the reader feels without articulating.

### [P2] No pay-grid answer, no outcomes

Nothing on QECO/OCT category or salary-scale impact, and no alumni outcome, enrolment figure, or completion rate. For a working Canadian teacher weighing $8,500–$17,000 over two to three years, the pay-grid question is *the* practical one. PLAN §6 flagged it as optional; it is the largest content gap in the piece. If ICS has an approved answer, one line on p7 outranks all of p2. If not, find out before printing — do not guess in print.

### [P2] Print-production discrepancies against the piece's own plan

- **Live Google Fonts dependency** at lines 7–9, against PLAN §7.3's explicit "no network dependency at render time." `display=swap` means a failed fetch silently reflows to Georgia rather than erroring.
- **The p4–p5 crossover hairline changes colour at the fold** — `.prog__band-top::after` is #C83C2C on p4 and #D89450 on p5, meeting at the gutter. The two band halves also carry different content depths (0.399in vs 0.813in).
- **`--red` #C83C2C on `--cream-dark` = 4.28:1**, applied to 6.8pt `.statrow__label` on p4 — the smallest type in the piece on its lowest-contrast ground. (All twelve other measured pairings clear 4.5:1; the reversed micro-type on purple measures 4.73–6.62, so contrast is *not* the problem there — size and the four-colour build are.)
- **Hairlines at 10–12% four-colour screen tint × 0.75pt**, against PLAN §3's "100K black or solid brand purple" rule. Body text is `--ink` #3A3330, also a four-colour build.
- **QR quiet zones** are 2.75 modules (p7) and 2.41 (p8) against the 4-module spec; p8's is the live risk since it sits on deep purple.
- **5 of 8 image references are `.webp`**, against PLAN §4's "the print pipeline wants JPEG/PNG."
- **Transparency PDF/X-1a forbids:** 2 `mix-blend-mode: multiply`, 2 CSS `filter` chains, 3 gradients over large dark fields. Flattening will be required.

**Suggested command:** `/impeccable harden`

## Persona Red Flags

**Confused First-Timer** (never considered grad school). The cover says "MWS-E · MA-EL" and never expands them until page 4. She reaches page 6 before the booklet uses the word "master's," and it arrives inside somebody else's quote. "Master of Worldview Studies in Education" means nothing to her; "Master of Arts (Philosophy) in Educational Leadership" is actively alarming — why is a leadership degree a philosophy degree? "Pathway A applies your learning where you already teach" references a Pathway B that is named nowhere, so she assumes she missed something. Her actual first question — can I even get in? — is answered by the faintest sentence on p7, the 7.5pt grey prerequisite line buried under the money panel.

**Deliberate Stress Tester** (scrutinising the numbers). Finds the MA-EL arithmetic in under a minute. Notices "$7,000–$8,500" is precise and "~$17K" is not, and draws the obvious conclusion. Spots that p3 says "6–7 courses + capstone" while p4 says the alternative finish is "a seventh course and a major research paper" — so is the seventh course the capstone or additional? Both cannot be true. Reads "Nov 1 (Winter or Summer)" beside "Apr 1 (Summer or Fall)" and cannot parse it. Sees "roughly six live Zoom sessions" on p2 and "~6 live Zoom sessions" on p3 — same fact, two hedges, facing pages.

**Busy Browser** (30 seconds, glasses in their bag). Gets "Teaching is more than a job" from the cover and learns nothing else — not that it is a master's, online, part-time, or Canadian. Spread 2–3 is two handsome headlines and grey texture. Spread 4–5 is two 36pt acronyms they cannot decode. On spread 6–7 the four faces register — the only interior element that survives the squint intact — then a wall. Looking for a price, the first number they see is **"$500 per credit hour"** at the top of the money panel rather than "$1,500 per course," so they anchor low and feel handled later. p7's QR has no printed URL beneath it, so not scanning leaves no fallback. They leave with a good feeling about a school whose name, price, format and offer they cannot recall.

## Minor Observations

- The "one idea per spread" discipline the plan claims is honoured only on p4–5. p3 alone carries three ideas; p7 carries five.
- The copy deck imposes "body blocks ≤ 70 words" at the *block* level but never at the *page* level. Every block complies and the pages overload anyway — the discipline was applied at the wrong altitude.
- The best sentence in the booklet — Carolyn Bentum's "When I was seeking out the principal role, I had messages of prayer from my classmates" — is the thing no competitor can say, and it is set at 8.6pt italic in a grey box at the bottom of page 6.
- p6's pull quote "Our small cohort model means you're not a number. You're a colleague." is **unattributed**, sitting between two properly attributed real testimonials. An anonymous quotation mark beside two named ones damages both.
- Both testimonials are MA-EL students. MWS-E — the cheaper, faster, nearer door — has no voice, no photo, and identical visual weight.
- Cover is two men; faculty is three men and one woman. The Canadian K–12 teaching workforce is roughly three-quarters women.
- Live measure is 4.875in ≈ 74 characters at 9.5pt, above the 66-character ideal. Raising body to 10pt requires narrowing the measure or widening the margin.
- p4/p5 programme URLs are set at 7.2pt uppercase, 0.09em tracked — the hardest possible rendering of a URL.
- "1-888-326-5347 (toll-free)" — the 1-888 prefix already says toll-free.
- The Patagonia logo on the cap is legible on the cover. Third-party trademark on a recruitment cover.
- The purple duotone the plan specifies for brand cohesion is not landing — p2's photo reads warm brown, not purple; the fade gradient washes the tint out.
- "Cultivating Learning Communities of Belonging" appears as a course title on p5 and as van der Boom's book title on p6, with nothing connecting the two.
- Housekeeping: `.p8__contact` is declared twice; 4 dead custom properties (`--red-light`, `--coral`, `--on-dark-soft`, `--orange-dark`); 3 unused classes; 8 unreferenced images (~3.6MB) in `img/`; and a stray macOS `._index.html` AppleDouble file that should not ship or be committed.

## Questions to Consider

1. If a teacher reads only the cover and the back cover — the two surfaces a conference table guarantees — do they learn this is an online part-time master's for Christian educators, and roughly what it costs? Today: no. What would it take to make those two surfaces alone do the whole job?
2. You have a student saying "I had messages of prayer from my classmates." Why is that on page 6 at 8.6pt instead of on page 1 at 20pt?
3. Your plan says one idea per spread and captions never below 7.5pt. The build has five ideas on p7 and 160 words below 7.5pt. Which document is wrong? Right now the plan is the better piece.
4. What happens to a Canadian teacher's pay grid when they finish this degree? If ICS knows, that line is worth more than pages 2 and 6 combined.
5. The most-repeated string in the booklet is "the Academic Registrar" (×5); the second is a variant of "subject to change" (×4). What does that say about a piece promising faculty who know your name?
6. MWS-E is the cheaper, shorter, nearer door — and it has no testimonial, no photograph, and identical visual weight to MA-EL. Is the goal to present two programmes fairly, or to get the largest number of teachers through the nearest door?
