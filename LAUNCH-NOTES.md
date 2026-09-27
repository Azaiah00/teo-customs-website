# Launch notes — Teo Customs Paint & Body

Everything below must be reviewed with the owner (Teo Vasquez) before the site goes live.

## 1. Facts to confirm with the owner

| Item | What the site says now | Where it appears |
| --- | --- | --- |
| Hours | Mon, Tue, Thu, Fri 8–5; Wed 8–5:30; Sat 9–5; Sun 9–5:30 (open 7 days — unusual for a body shop, please confirm Sunday hours) | Every page footer, home quick facts + FAQ, about, estimate, JSON-LD, llms.txt |
| Google rating | 5.0 stars from 121 reviews (update the count at launch) | Home trust strip, reviews section, quick facts, home JSON-LD `aggregateRating`, llms.txt, OG image |
| I-CAR | "I-CAR certified in welding and auto body repair" (from Teo's Instagram bio). Confirm certificate names / dates; add the I-CAR logo only if Teo is allowed to use it | Home, about (credential card + Person schema), services (welding), footer |
| TOP GUN recognition | "TOP GUN Business Professional", County Advisory Board. Confirm the county name and year so the wording can be more specific | Home trust strip, about, JSON-LD `award` |
| Business name | "Teo Customs Paint & Body" (wordmark reads "TEO X CUSTOMS"; Yelp says "Teo X Customs Paint and Body"). Confirm the preferred legal/display name | Titles, schema, footer |
| Suite number | 5255 Hull Street Rd N #14 | Everywhere |
| Email | teo_customs@outlook.com — confirm it is monitored; it receives form notifications | Footer, estimate, quick facts |
| Insurance wording | "We'll work with your insurance." No direct-repair-program (DRP) claims are made. Confirm Teo is comfortable with the insurance process copy on services.html | Home insurance band, services #insurance, FAQ |
| Payments | Credit/debit cards and NFC mobile pay | Quick facts, about, FAQ, schema |
| Accessibility | Wheelchair-accessible entrance and parking | Quick facts, about, FAQ, schema |
| Area served | Richmond and Chesterfield County (schema `areaServed`) | JSON-LD |
| Walk-ins | Site asks customers to call or text ahead rather than promising walk-ins. Confirm | FAQ, about |
| Process copy | "How it works" (send photos, estimate, repair, pick up) and "What to expect" describe a typical flow; no turnaround times or guarantees are promised. Confirm it matches how Teo works | Home, services |

Deliberately NOT claimed anywhere (per research): free estimates, warranties, loaner cars, towing,
frame-straightening equipment, OEM certifications, years in business (sources conflict: 2018 vs 2020),
or any prices. Add any of these only if Teo confirms them in writing.

## 2. Photo captions to confirm

Project names come from Teo's own Instagram captions. These images had no caption tied to them, so neutral
labels were used; confirm or correct:

- `civic-hatch-black` is captioned "2019 Honda Civic Hatchback — Color change" (confirm this is that car)
- `civic-teal-booth` is captioned "Honda Civic hatchback — All-over paint"
- `civic-blue-headlight` is captioned "Honda Civic — Front end & headlight detail"
- `s2000-yellow` is shown as the finished "Honda S2000 front bumper custom fit & paint" project
- `black-intercooler-front` is captioned "Front-end work — Bumper off, intercooler exposed"
- `green-hood-booth` ("Fresh paint"), `prep-work` ("Prep work"), `fender-in-hand` ("Panel work")
- `honda-beat-red` is labelled "Honda Beat — Project car"
- The two before/after pairs (C10 and Mustang) are different angles of the same vehicle; if Teo has
  matching-angle before/after shots, swap them in for a stronger slider.

## 3. Photo credits and licensing

All photos and the logo/wordmark were taken from Teo Customs' own public Instagram
(https://www.instagram.com/teo_customs/) and Facebook (https://www.facebook.com/RVAAUTOBODYANDPAINT/).
They must be approved by the owner, who confirms he owns the rights (or has permission from the
photographer and vehicle owners) before launch. License plates are visible on some vehicles
(Mustang, Silvia, S2000, C10); ask whether any customer wants a plate blurred.

Derived assets made for the site: `wordmark-light.webp` (wordmark with transparent background),
`logo-badge-192.webp`, `og.jpg` (share image), favicons and app icons. `honda-beat-red` and
`prep-work` were trimmed to remove white/black letterbox borders.

## 4. Items to swap or add when available

- Higher-resolution originals of `mustang-before-paint` (720px), `prep-work`, `green-hood-booth`,
  `hardbody-booth`, `fender-in-hand` and `civic-blue-headlight` (all 720px or smaller).
- A real photo of Teo (portrait in the shop) for the about page.
- A photo of the shop exterior / signage for the "Visit" section.
- Real review text with permission, or embed Google reviews via an approved widget. Current quotes are
  short paraphrases of public Google reviews, shown anonymously and labeled as paraphrased.
- Exact I-CAR certificate details and the TOP GUN award year.
- The YouTube link is a single video; replace with a channel URL if one exists.

## 5. Forms

- `estimate.html` uses a Netlify Form named `estimate` (fields: name, phone, email, preferred contact,
  vehicle year/make/model, damage type, insurance claim yes/no/not sure, description, photos).
- It works only once deployed on Netlify with form detection enabled. Set up email notifications to
  teo_customs@outlook.com in Netlify > Forms.
- Photo uploads: the page limits to 5 photos / 8 MB total client-side to stay inside Netlify's upload
  limits. Netlify's free tier includes 100 submissions/month; upgrade if volume is higher.
- Spam protection: honeypot field (`bot-field`). Add reCAPTCHA in Netlify if spam appears.

## 6. Domain and listings

- Register **teocustomsrva.com** (all canonical, Open Graph, sitemap and schema URLs use it).
  If a different domain is chosen, find-and-replace `teocustomsrva.com` across all files.
- After launch: add the site URL to the Google Business Profile, Yelp, Facebook page and Instagram bio;
  submit the sitemap in Google Search Console and Bing Webmaster Tools.
- The CSP in `netlify.toml` includes a hash for the one inline script (`document.documentElement.classList.add('js')`).
  If that line changes, update the hash.


## Live preview domain (updated 27 Sep 2026)
The site is live at https://teo-customs-website.netlify.app/ and every canonical URL, Open Graph/Twitter tag, JSON-LD URL, sitemap.xml, robots.txt and llms.txt now points there, so text-message and social link previews show this address.
When the owner's own domain (teocustomsrva.com) is connected in Netlify, find-and-replace `teo-customs-website.netlify.app` with `teocustomsrva.com` across the .html/.xml/.txt/.toml files, then redeploy.
