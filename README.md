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
| `index.html` | All content, meta tags and the `Dentist` structured data |
| `assets/css/site.css` | Styles. Colours and type are set as variables at the top |
| `assets/js/site.js` | Menu, scroll reveals, open-now status, photo tour, reviews |
| `assets/img/` | Photos (WebP) |
| `assets/fonts/` | Marcellus and Hanken Grotesk, self-hosted (both SIL Open Font License) |
| `llms.txt`, `robots.txt`, `sitemap.xml` | Search and AI crawler files |
| `contact.vcf` | The contact card behind "Save to contacts" |

## Where the content came from

All facts (hours, address, insurance plans, credentials, reviews) come from the original site.
If hours change, update three places: the hours table in `index.html`, the `openingHoursSpecification`
block in the page head, and the `HOURS` object in `assets/js/site.js`.

The Google rating (5.0 across more than 350 reviews) was counted in November 2026 from the two Google
listings: 221 under "Dr. Katherine D. Sanchez, D.D.S." and 136 under "Tracy Center For Dentistry".
The twelve review cards come from five-star reviews on the first listing. Six are short reviews shown whole. Six are excerpts from longer reviews, marked with an ellipsis and a "More" link to Google.
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

## Before this replaces the live site

- The canonical URL, sitemap and social image all point at `www.tracycenterfordentistry.com`.
- The old site's patient login and downloadable new-patient forms are not carried over yet.
