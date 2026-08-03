# Yushan Ventures / Mosaic Venture Lab — website

Static, fully self-contained. No build step, no package install, no external services.
**Structure is flat: seven files at the top level plus one `assets` folder.**

```
index.html            ← home (must be at repo root)
services.html
case-studies.html
yushan-v2.css
yushan-diagrams.js
yushan-map.js
image-slot.js
.nojekyll
assets/               ← everything else, no subfolders
```

## Publish on GitHub Pages

1. Repo → **Add file → Upload files**.
2. Drag in the seven files and `.nojekyll`, then drag the `assets` folder in as well —
   GitHub keeps the folder and its contents intact.
3. Commit.
4. **Settings → Pages** → Source *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
5. Live at `https://<user>.github.io/<repo>/` within a minute or two.

Replacing an existing site? Upload the same way and commit — GitHub overwrites files with
matching names. Delete any old files that no longer exist here.

If `.nojekyll` is hard to drag (macOS hides dotfiles — press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>
in Finder to show them), create it instead with **Add file → Create new file**, name it
`.nojekyll`, leave it empty, commit. It stops GitHub running the site through Jekyll.

### Custom domain

Add a file named `CNAME` at the root containing only your domain (e.g. `yushanventures.com`),
then point a DNS CNAME record at `<user>.github.io`. Tick *Enforce HTTPS* in Settings → Pages
once the certificate is issued.

## What's in `assets/`

One flat folder, filenames prefixed so related things sort together:

| Prefix | What |
|---|---|
| `font-*.woff2` | the three self-hosted webfonts (16 subset files) |
| `d3-*.min.js`, `topojson-client.min.js`, `countries-110m.json` | the footprint map's libraries and country outlines |
| `press-*` | press scans and photos |
| `dom-*` | the four domain-card photographs |
| everything else | client logos and engagement photos |

## Notes

- **Fonts** — Source Serif 4, Public Sans, IBM Plex Mono, all OFL-licensed and redistributable.
  The `@font-face` rules live at the top of `yushan-v2.css`. Latin and latin-ext subsets are
  included; `unicode-range` means a browser downloads only the subset a page needs.
- **Chinese text** (press titles) intentionally falls back to the reader's system CJK font — none
  of these three families ship Chinese glyphs, and bundling one would add megabytes.
- **The map** uses three small d3 modules rather than all of d3. If the country outlines ever
  fail to load, it degrades to a clean text list of markets.
- **Logos** each have an `onerror` fallback that swaps in a styled text wordmark, so a missing
  file degrades to clean type rather than a broken image.
- **Domain-card photos** are drop zones: dragging an image in previews it in that visitor's
  browser only. To change one permanently, replace the file in `assets/` or edit its `src`.
- **Photo credits** — the four domain photographs are CC BY-SA 4.0 / CC BY 2.0 and carry visible
  on-page credit linking to the source. Keep those credits if you keep the photos.
- Works opened straight from disk (`file://`) too, so it demos offline.
