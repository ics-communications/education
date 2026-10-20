# Educational Leadership at ICS — 8.5 × 11 poster

Evergreen letter-size poster for the education site overall (MWS-E, MA-EL, certificates),
built for **office / desktop printers**: no bleed, artwork sits inside a 0.3 in white paper
margin so nothing gets clipped.

| File | Use |
|---|---|
| `out/ics-education-poster-letter.pdf` | **Print this.** US Letter, 1 page, "Actual size" / 100 %. |
| `out/ics-education-poster-letter.png` | 300 DPI proof for screens and email. |
| `education-poster-letter.html` | Source of truth — edit this, then rebuild. |

QR → `https://education.icscanada.edu/?utm_source=poster&utm_medium=print&utm_campaign=edu-letter-poster`
(the UTM tags let you count poster scans in analytics).

## Rebuild

```bash
node poster/render.mjs     # from the education repo root
```

Regenerates the QR, the PDF and the proof, then decodes the QR at 300/150/96/72 DPI and
exits non-zero if any decode fails. Uses the Playwright/qrcode/jsQR install in the sibling
`f2bf/.render/` folder; set `RENDER_DEPS=/path/to/dir` if that repo lives elsewhere.
Needs network on first run (Google Fonts: Libre Baskerville, Outfit).

Copy is taken from the homepage. Programme length is deliberately left off: the homepage
says "about 2.5 years" in the MWS-E blurb but "2 Years" in its tag — worth reconciling there.

## Alternate version (11×17 style)

`education-poster-letter-alt.html` → `out/ics-education-poster-letter-alt.pdf` / `.png`. Same office-printer spec, laid out
like the F2BF 11×17 poster (`f2bf/poster/index-v2.html`): full-panel photo fading to dark,
stacked wordmark, italic three-line manifesto and QR tile anchored at the bottom.

```bash
node poster/render.mjs alt
```

Its QR carries `utm_campaign=edu-letter-poster-alt`, so scans can be compared against the main version.
