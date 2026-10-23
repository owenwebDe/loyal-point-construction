# Loyal Point Construction website

Website for Loyal Point Construction, a welding and fabrication workshop in Ketu, Lagos.
Next.js 15, Tailwind v4, GSAP and Lenis, deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Content

- **Words, phones, hours, services:** `src/content/site.ts`
- **B-roll videos:** `src/content/media.ts` (encoded files in `public/media/`)

## Photos

1. Put the client's photos in `assets/photos/<service>/`, using the service slugs from
   `src/content/site.ts` (`iron-burglary`, `safety-doors`, `windows`, `containers`,
   `general-repairs`, `iron-bending`, `pillars-columns`, `beams`, `decking`). Anything
   else goes in `assets/photos/other/`.
2. Run `npm run media`. It resizes, grades, removes duplicates and writes
   `src/data/work.json`.
3. Optional: `assets/photos/featured.json` picks the three Featured Work photos, and
   `assets/photos/captions.json` sets descriptions.

A service without client photos falls back to the sample photos in `assets/placeholders/`.
These are real Nigerian site and workshop photos from Wikimedia Commons, marked "Sample
photo" on the site and credited on `/credits`. They disappear automatically once the
client's own photos for that service are added. `npm run media` lists the services still
on samples.

## Deploy

Pushing to Vercel, or running `npx vercel deploy --prod`, publishes the site. Once a
domain is connected, set `NEXT_PUBLIC_SITE_URL` to it in Vercel. Canonical links, the
sitemap and share images all use that value.
