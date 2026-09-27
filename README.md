# Teo Customs Paint & Body — website

A production-ready static website for **Teo Customs Paint & Body**, an auto body and paint shop at
5255 Hull Street Rd N #14, Richmond, VA 23224. Built by Couture House Co. as a spec site to present to
the owner, Teo Vasquez, and then launch.

- Proposed domain: **teocustomsrva.com** (register before launch; canonical, Open Graph and sitemap URLs already use it)
- Stack: plain HTML + one CSS file + one vanilla JS file. No framework, no build step, no external JS.
- Hosting target: Netlify (the estimate form is a Netlify Form).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, trust strip (5.0 / 121 reviews, I-CAR, TOP GUN), services, C10 before/after, portfolio teaser, how it works, insurance, reviews, quick facts, FAQ |
| `services.html` | Every service with detail, what to expect, insurance process, service FAQ |
| `work.html` | Portfolio: two before/after sliders, filterable grid (Collision / Paint / Custom / Classic), lightbox |
| `about.html` | Teo and the shop, credentials, values, location, hours, Google Maps link |
| `estimate.html` | Photo estimate request (Netlify Form with photo upload) plus call / text / email options |
| `404.html` | Branded not-found page |

Supporting files: `assets/css/site.css`, `assets/js/site.js`, `assets/img/*` (optimized WebP, OG image,
icons), `favicon.svg`, `robots.txt`, `sitemap.xml`, `llms.txt` (fact sheet for AI answer engines),
`site.webmanifest`, `netlify.toml` (security + cache headers, pretty 404).

## Preview locally

From this folder, start any static server and open the printed address:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080/
```

Opening `index.html` directly from the file system also works, but a local server is closer to production.
The estimate form only submits once the site is deployed on Netlify (locally it shows a friendly
"couldn't send" message with the phone number).

## Deploy on Netlify

1. Create a new site in Netlify and either drag this folder onto the Deploys screen or connect the Git repo.
   No build command; publish directory is the repository root (`netlify.toml` already says so).
2. In **Site configuration > Forms**, confirm form detection is enabled. After the first deploy the
   `estimate` form appears automatically. Add a notification email (Forms > Form notifications) so
   submissions go to `teo_customs@outlook.com`.
3. In **Domain management**, add `teocustomsrva.com` and `www.teocustomsrva.com`, point DNS at Netlify,
   and let Netlify provision the HTTPS certificate. Set the apex domain as primary.
4. Submit `https://teocustomsrva.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
5. Update the Google Business Profile website field to the new domain.

## Design system (for future edits)

- Palette: booth-black `#0b0b0c`, carbon `#151517`, graphite `#24262a`, badge red `#e1261c`,
  clearcoat white `#f4f4f2`, primer grey `#9aa0a6`, masking-tape tan `#d9c7a0` (accents only).
- Type: Saira Condensed 700/800 (display, uppercase) and Archivo 400/500/600 (body), self-hosted in `assets/fonts`.
- Motion: clearcoat light sweep on hero photos and H1 (scrubbed by scroll), masking-tape strips that
  peel off section headings, before/after sliders that auto-wipe once and are draggable
  (pointer and keyboard), spray-mist reveal on portfolio photos, count-up on the rating.
  All motion is disabled for visitors who prefer reduced motion, and content is fully visible without JS.

Page markup was generated once from a small Python template to keep headers, footers and schema
consistent; the HTML files are the source of truth now and can be edited directly.
