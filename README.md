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

Run `npx vercel deploy --prod` to publish the site to the Vercel project
`loyal-point-construction`.

## Domain

- **Domain:** `loyalpointconstruction.com.ng`, registered at WhoGoHost (GO54).
- **Nameservers:** `ns1.vercel-dns.com` and `ns2.vercel-dns.com`, so DNS is managed in
  Vercel.
- **www:** `www.` forwards to the bare domain (`next.config.ts`).
- **Site URL:** canonical links, the sitemap and share images use Vercel's production
  domain automatically. Set `NEXT_PUBLIC_SITE_URL` only to override it.
- **Renewal:** yearly at WhoGoHost. Keep auto-renew on.
