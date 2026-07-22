# Yushan Ventures — website

Static site. No build step, no server code. Three pages plus shared CSS/JS and an `assets/` folder.

```
index.html          ← homepage (GitHub Pages serves this automatically)
services.html
case-studies.html
yushan-v2.css        ← all styling
image-slot.js        ← photo drop-in placeholders
yushan-map.js        ← the world footprint map
assets/              ← logos and photos
```

## Put it live on GitHub Pages (free)

1. Go to github.com → **New repository** → name it (e.g. `yushan-site`) → **Create**.
2. On the repo page: **Add file → Upload files**.
3. Drag in **the contents of this folder** — `index.html`, the two other `.html` files, the `.css`, the two `.js` files, and the whole `assets` folder. (Upload the files themselves at the top level, not the enclosing folder.)
4. **Commit changes.**
5. **Settings → Pages** → under *Branch* pick `main` and `/ (root)` → **Save**.
6. Wait ~1 minute. Your site is live at `https://<your-username>.github.io/<repo-name>/`.

To use **www.yushanventures.com**: Settings → Pages → Custom domain → enter the domain, then add the DNS records GitHub shows you at your domain registrar.

## Before you go live — two things to know

- **Empty photo boxes.** The hero image, the three practice-card photos (home), the service photos, and the Audi/NASA demo-day photo are drop-in placeholders. Dragging a photo in only saves it *in your own browser* — visitors will see an empty box. Send those photos and they can be embedded as real images.
- **A few logos/headshots load from other sites** (your current yushanventures.com, Wikimedia, the Mosaic site). They work as long as those stay online. Send the files and they can be hosted here instead, fully self-contained.
