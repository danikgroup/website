# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **Danik Group**: a static site on GitHub Pages, with a git-based CMS for posting
news/blog content and product pages. Its job is search visibility and leads for the two products,
so SEO beats everything else in a trade-off.

## Design

The design follows the owner's chosen template, Phlox "app landing two"
(https://themes.wpmonster.co/Phlox/new/app-landing-two/). Keep new pages in its vocabulary.
Tokens live in `src/styles/global.css` and come from the template's CSS: navy `#23203f`, muted
`#716f87`, the blue and green gradients, grey `#f1f1f1`, and blue-tinted shadows. Two deliberate
departures, both for contrast: text on green is navy, never white, and the blue gradient's light end
is darker than the template's.

- Depth comes from one light source above: `--shadow`/`--shadow-strong` (contact + ambient layers),
  `--rim` (top-edge highlight), `--grain` (film grain layered over colour bands) and `--paper`/
  `--paper-major` (squared exercise-book paper, the site's background graphic), all in `global.css`.
  New raised surfaces use these instead of a single flat shadow.
- Template sections with nothing true to show were adapted, not faked. Stats show real counts from
  the products. Partner logos became the "school or academy?" product chooser. The newsletter became
  the demo band. Testimonials render only when `site.json` has real ones.
- Phone mockups show real screenshots where a product has one. Elsewhere they show HTML-drawn
  screens (`Screen.astro`): crisp, no image weight. Never present drawn screens as screenshots of
  the real panel.
- Motion (`src/scripts/live.js`, the site's only script): the hero plays one load sequence, then its
  tiles float and lean toward the pointer (`data-parallax`). Below it, each phone acts out its feature
  when it scrolls into view, feature icons draw in (`data-draw`), facts count up (`data-count`), and
  setup steps light up in order. Pattern: `data-live` gets `.is-live` once in view, and CSS
  animations wait `paused` until then. Start states live only in keyframes, and only under the `.js`
  class, so no JS or reduced motion shows the finished page.
- Verifying motion: headless `--screenshot` doesn't draw frames between captures, so scroll-triggered
  animations look stuck. Drive real Chrome with `puppeteer-core` (installed in the scratch folder,
  never the project) and read `document.getAnimations()`.
- Anything that starts off to the side before animating in needs its section to clip sideways
  overflow (`overflow-x: clip`). Otherwise phones lay out wider than the screen, and fixed layers
  like the menu shift with it.
- A `class` passed to a child component only gets the parent's scoped styles if the child spreads
  `...rest` onto its root (`Device`, `Icon` do). Do the same in any new component that takes `class`.
- Screenshots: the Chrome DevTools MCP hangs on this machine. Use headless Chrome
  (`chrome --headless=new --screenshot --window-size=W,H URL`). Windows won't make a window narrower
  than about 500px, so check 390px by putting the page in a 390px `<iframe>`.

## Stack

- **Astro 7**, static output, plain JavaScript (no TypeScript). Needs Node ≥ 22.23.4 (machine and CI
  run Node 26). Schemas live in `src/content.config.js`, content in `src/content/{products,posts}/*.md`,
  and site settings/contact details in `src/data/site.json`. Ship zero client JS by default. Add an
  island only when a page needs it.
- **Sveltia CMS** at `/admin/` (`public/admin/index.html` + `public/admin/config.yml`, Decap-compatible
  config). It commits Markdown/images straight to the repo, so a publish is a commit and the deploy
  runs from it. Editors sign in with a GitHub personal access token. That needs no OAuth server, and
  GitHub Pages can't host one. The script is pinned with an SRI hash; to upgrade, change the version
  and recompute the hash (command in the file).
- **Deploy**: `.github/workflows/deploy.yml` builds and publishes on every push to `main`
  (remote `git@github.com:danikgroup/website.git`). Repo Settings, then Pages, then Source must be
  "GitHub Actions". The custom domain is set in the Pages settings, not in a `CNAME` file.
  `actions/configure-pages` reports the live URL, and the build gets it as `SITE_URL`/`BASE_PATH`.
- No new dependency for something Astro or the platform already does (sitemap = `@astrojs/sitemap`,
  RSS = `@astrojs/rss`, images = `astro:assets`, font = `@fontsource-variable/vazirmatn`,
  icons = `@lucide/astro`, rendered to inline SVG at build time).

## How the pieces connect

- `src/layouts/Base.astro` owns the whole `<head>`: title, meta, canonical, OG/Twitter, site-wide
  `Organization` JSON-LD plus a page's `jsonLd` prop. It also renders the nav from the products
  collection. Pages pass `title`, `description`, `image`, `imageAlt`, `type`, `jsonLd`, `noindex`.
- `src/utils.js`: `href(path)` for every internal link (adds the base path; never hard-code `/…`),
  `products()` / `posts()` (sorted, drafts hidden in the build but shown in dev), `faDate(date)`
  (Shamsi, Persian digits), `breadcrumbs(site, [[name, path], …])` (JSON-LD).
- Components (`src/components/`): `Header` (nav is a `popover` under 900px; «محصولات» is a
  Digikala-style megamenu built from the products collection: hover or click opens it on desktop, the
  preview follows the last product pointed at (`data-active`, a small script in the component), and on
  phones it is a tap-to-open list of product cards. The picture is the product's `image`, else its
  phone mockup), `Hero`
  (`small`/`big` h1 lines, `lead`, `screen`, `screenLabel`, up to 8 `icons`, `next` anchor),
  `Device` (phone frame, `label` = its accessible description), `Screen` (`kind` = rollcall | report |
  tuition | timetable | notices), `Features` (`items=[{icon,title,text}]`), `DemoBand` (contact
  call to action, built from `site.json`), `PageHeader` (grey opener for inner pages), and `Icon`
  (`name` from `src/icons.js`, a Lucide icon).
- Phone screens: `src/screens.js` lists the `Screen` kinds and their accessible labels. Each
  product picks one with its `screen` field (schema enum + CMS select use the same keys).
- Product phones show the product's `screenshot` (portrait phone capture, e.g. 1320×2868, in
  `src/assets/products/`, with `screenshotAlt`) when it has one, else its drawn `screen`.
  `ProductScreen` (`data`, `eager`) picks which inside a `Device`, and `phoneLabel(data)` gives the
  Device's label. `Hero` takes the phone's content as its slot, with the drawn screen as the fallback.
- Icon names: `src/icons.js` maps names to Lucide icons. Content may only use the names listed in
  `ICON_NAMES` (`src/content.config.js`) and the CMS select. Keep all three in step.
- A route's slug is the Markdown file name (`entry.id`). The CMS asks for it (`{{fields._slug}}`).
- Images: per-collection media folders `src/assets/{posts,products}/`, referenced from Markdown as
  `../../assets/<collection>/x.png`, so `astro:assets` optimises them (WebP, and a 1200×630 JPEG for OG).

## Commands

```bash
npm install
npm run dev        # http://localhost:4321, CMS at /admin/ (local repo via "Work with Local Repository")
npm run build      # static output in dist/, run it before claiming a change works
npm run preview    # serve dist/
# Base-path build as on danikgroup.github.io (Git Bash needs MSYS_NO_PATHCONV=1 or it mangles /website):
MSYS_NO_PATHCONV=1 SITE_URL=https://danikgroup.github.io BASE_PATH=/website npm run build
```

There is no test suite. The build is the check: a content file that breaks its schema fails it.

## Audience and language

- **Persian (fa), RTL first.** Both products are Persian-only software for Iranian schools/institutes.
  Set `<html lang="fa" dir="rtl">`, use logical CSS properties (`margin-inline-start`, not `margin-left`),
  and show Persian digits in copy. Persian only, no English version.
- **Self-host every asset (fonts, scripts).** Google Fonts and many CDNs are slow or blocked for
  Iranian visitors. Vazirmatn is the only typeface, bundled from `@fontsource-variable/vazirmatn`. The CMS admin
  page is for editors only and is the one exception.

## The products (source of truth lives next door)

Never invent features. Read the sibling repo before you write product copy:

| Product | Repo | Read |
|---|---|---|
| **DanMa** (دانما): management platform for tech/education institutes. Classes, roll call, tuition and instalments, online payment, shop and video courses, events and tickets, CRM/leads, exams, wages, portfolio, licensed modules | `../danma`, **`product` branch** (the sellable version; `main` is one customer's site) | `CHANGELOG.md`, `README.md`, `DanMa_Website_Spec.md`, `docs/USE_CASES.md` |
| **Danik School**: school management/LMS for Iranian schools, grades 1–12. Enrollment per academic year, attendance, exams, report cards, promotion, tracks, transfers. One install per school | `../danik-school` (GitHub `danikgroup/school-lms`) | `docs/DOMAIN.md`, `CHANGELOG.md`, `docs/superpowers/specs/` |

Write about a feature as live only if that repo's changelog shows it shipped. Spec-only items are
"coming soon" or get left out.

## SEO requirements (every page)

One shared layout/head component owns these, so pages only pass data:

- Unique `<title>` and meta description, a canonical URL, and Open Graph + Twitter card tags with a 1200×630 image.
- JSON-LD: `Organization` site-wide, `SoftwareApplication` on each product page, `BlogPosting` on posts,
  `BreadcrumbList` on nested pages, `FAQPage` where a page has an FAQ.
- `sitemap-index.xml` (`@astrojs/sitemap`), `robots.txt` that points to it, and an RSS feed for posts.
- Semantic HTML with one `<h1>`. Every image gets meaningful Persian `alt`, explicit dimensions, and
  goes through `astro:assets` (AVIF/WebP, lazy except the LCP image).
- Clean slugs: Latin/transliterated, stable, never changed after publish.
- Check Lighthouse (SEO, performance, accessibility) on the built site before calling a page done.

## CMS content model

Collections in `public/admin/config.yml` must mirror the schemas in `src/content.config.js` field for
field. Change both together, or the CMS writes files the build rejects. Every collection exposes
`title`, `description` (meta), `image` + `imageAlt`, and `draft`. Media goes to `src/assets/` so
Astro optimises it.

## Images: generated by the user, prompted by you

You don't generate images. When a page needs an image:

1. Add an entry to `docs/image-prompts.md`: target path (e.g. `src/assets/products/danma-hero.png`),
   pixel size/aspect, where it's used, Persian alt text, and a full prompt ready to paste into an image
   model (GPT-Image-2). Ask for **no text in the image**, because models garble Persian script. Put any
   Persian lettering in HTML over the image.
2. Show the prompt to the user and wait. They save the image at the target path.
3. Mark the entry done and wire the image into the page.

Keep one visual style across all prompts and reuse its wording so the set looks like one brand.
Don't use stock or AI art that imitates the products' real UI. Real product screenshots come from
the running apps.

## Workflow

- Append to `CHANGELOG.md` under `## [Unreleased]` after each feature or fix (format in its header).
- One logical change per commit. Commit only when asked.
