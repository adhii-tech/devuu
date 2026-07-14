# Happy Birthday Devuu ❤️ — a one-page surprise site

## How to open it
Just double-click `index.html` — it opens in any browser. No install needed.

## Easy things to personalize

1. **Photos** — drop your images into `assets/images/` (e.g. `photo1.jpg`, `photo2.jpg`…)
   then in `index.html` find the `.polaroid` items in the **PHOTO GALLERY** section and
   change the background gradients in `style.css` (`.ph1`, `.ph2`, etc.) to:
   ```css
   .ph1{ background-image: url('assets/images/photo1.jpg'); background-size: cover; background-position: center; }
   ```

2. **Music** — put an instrumental mp3 at `assets/music/romantic-instrumental.mp3`
   (the player button in the top-right corner already looks for this file).

3. **Together-since date** — in the **Love Counter** section, either use the date
   picker on the live page, or change the default in `script.js`:
   ```js
   const defaultDate = "2023-01-01"; // set this to your actual start date
   ```

4. **Reasons list** — in `script.js`, search for `reasonsList` and add/edit as many
   lines as you like (currently 20 — add more freely, they'll auto-arrange).

5. **Letter text / timeline / appreciation cards** — all plain text inside
   `index.html`, easy to find and edit (search for the section comments like
   `<!-- ============ 2. ENVELOPE / LETTER ============ -->`).

## Structure
```
index.html   — all page content/sections
style.css    — colors, type, layout, animation styles
script.js    — interactions: particles, reveals, envelope, counter, confetti…
assets/
  images/    — put your photos here
  music/     — put your background track here
```

## Notes
- Built with plain HTML/CSS/JS + GSAP + ScrollTrigger (loaded from a CDN, so an
  internet connection is needed the first time it loads).
- Fully responsive — check it on your phone too, since that's probably how
  she'll see it. 💕
- Respects "reduced motion" settings for accessibility.
