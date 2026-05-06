# Favicon Setup Required

The favicon source image (`favicon-source.png` — white bird on red circle, ICS logo) was not found at the expected path.

## What's needed:

1. Place the ICS logo PNG in this folder as `favicon.png`
2. Generate proper favicons using a tool like https://realfavicongenerator.net/:
   - `favicon.ico` (multi-size: 16x16, 32x32, 48x48)
   - `favicon-32x32.png`
   - `favicon-16x16.png`
   - `apple-touch-icon.png` (180x180)

3. Update the link tags in all HTML files if filenames differ from `favicon.png`.

Currently all pages reference `/assets/favicon.png` as a fallback.
