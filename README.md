# Tracy Center for Dentistry

A one-page redesign of [tracycenterfordentistry.com](https://www.tracycenterfordentistry.com/).
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Preview

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

To publish with GitHub Pages: Settings, Pages, deploy from the `main` branch, root folder.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | All content, meta tags and the structured data (`WebSite` and `Dentist`) |
| `404.html` | The "page not found" page GitHub Pages serves. Self-contained, no shared files |
| `assets/css/site.css` | Styles. Colours and type are set as variables at the top |
| `assets/js/site.js` | Menu, scroll reveals, open-now status, photo tour, reviews |
| `assets/js/lenis.min.js` | Lenis 1.3.27 (MIT), eased wheel scrolling for mouse and trackpad. Delete its script tag in `index.html` to turn it off |
| `assets/img/` | Photos (WebP, plus an AVIF feather) and the app icons |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` | Browser tab, iPhone home screen and Android icons |
| `assets/fonts/` | Marcellus and Hanken Grotesk, self-hosted (both SIL Open Font License) |
| `llms.txt`, `robots.txt`, `sitemap.xml` | Search and AI crawler files |
| `contact.vcf` | The contact card behind "Save to contacts" |

## Where the content came from

All facts (hours, address, insurance plans, credentials, reviews) come from the original site.
If hours change, update three places: the hours table in `index.html`, the `openingHoursSpecification`
block in the page head, and the `HOURS` object in `assets/js/site.js`.

The Google rating (5.0 across more than 350 reviews) was counted in November 2026 from the two Google
listings: 221 under "Dr. Katherine D. Sanchez, D.D.S." and 136 under "Tracy Center For Dentistry".
The twelve review cards come from five-star reviews on the "Tracy Center For Dentistry" listing. Six are short reviews shown whole. Six are excerpts from longer reviews, marked with an ellipsis and a "More" link to Google.
It appears in the hero, the reviews section and `llms.txt`. It is deliberately not in the structured data,
because Google does not allow a business to mark up ratings collected on another site.

Profiles checked on November 19, 2026: only Google and Yelp are linked. The Facebook page is not publicly
visible, the YouTube channel has no videos, the X account has never posted, and LinkedIn is the dentist's
personal profile (kept in the structured data only). Add them back in `index.html` if they come to life.

## Images

- `office-*.webp`, `dr-sanchez.webp`, `nicholle-gilmour.webp`, `patient-miss-teen-california*.webp`: real photos from the original site.
  The office photos were enlarged with an AI upscaler because the originals are 800 pixels wide.
- `niche-tooth.webp`, `feather.webp`, `family-toothbrushes.webp`, `ionic-column.webp`, `colonnade.webp`:
  decorative images generated with Higgsfield. They are not photos of the office or of patients.

## Quality checks

Checked on November 19, 2026 with Lighthouse, axe-core and html-validate. To re-run Lighthouse against a local server:

```
npx lighthouse http://localhost:8000/ --preset=desktop --view
```

Things the checks rely on, worth keeping when you edit:

- Every image has `width`, `height` and `alt`. Decorative images use `alt=""`.
- Links that open a new tab carry a hidden "(opens in a new tab)" note for screen readers.
- Hidden helper text uses the `sr-only` class. Keep a link's visible words at the start of its name.
- Text colours are tuned to at least 4.5:1 contrast on their section colour. Re-check if you change the palette.
- The focus ring colour is set per section with the `--focus` variable (dark sections use honey).
- CSS and JavaScript are left unminified so they stay readable. The host compresses them in transit.

## Before this replaces the live site

- **Remove the staging `noindex`.** `index.html` carries `<meta name="robots" content="noindex, nofollow">` so the
  GitHub Pages demo stays out of search engines. On launch day change its content to `index, follow, max-image-preview:large`.
  `robots.txt` is already the production version: it has no effect on the GitHub Pages address, because
  crawlers only read `robots.txt` at the root of a host.

- The canonical URL, sitemap, social image and `llms.txt` links all point at `www.tracycenterfordentistry.com`.
  That also tells search engines the GitHub Pages copy is a duplicate of the real site, not a rival.
- Update `<lastmod>` in `sitemap.xml` whenever the content changes.
- The old site's patient login and downloadable new-patient forms are not carried over yet.
- Caching and security headers are set by the host, not by these files. On launch, ask the host for long
  cache lifetimes on `assets/` and for HTTPS with HSTS.
- After launch, submit the sitemap in Google Search Console and test the page in the Rich Results Test.
