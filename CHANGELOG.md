# Changelog

<!--
Maintained for both humans and Claude Code to reference. Before
implementing a feature or fix, check the entries below first — it may
already be done, which saves searching the whole codebase.

Format (based on Keep a Changelog: https://keepachangelog.com/en/1.1.0/):
- New entries go under "## [Unreleased]" until a release is cut.
- Categories: Added, Changed, Fixed, Deprecated, Removed, Security.
  Only add a category heading once it has an entry under it.
- One bullet per entry, imperative mood, one line where possible:
    - Add CSV export to the reports page. (Refs: JIRA-482, #210)
- Include "(Refs: ...)" only when there's an external reference — a Jira
  key, GitHub issue/PR number, Trello card title/URL, or similar tracker
  ID. Comma-separate multiple references. Omit the parenthetical entirely
  if there's nothing to reference.
- To cut a release: rename "## [Unreleased]" to "## [X.Y.Z] - YYYY-MM-DD"
  and start a fresh, empty "## [Unreleased]" section above it.
- Never delete or rewrite past entries — only append.
-->

## [Unreleased]

### Added
- Add CLAUDE.md with stack, SEO, CMS and image-prompt workflow decisions.
- Add Astro 7 site skeleton: home, product pages, blog, contact, 404, RSS, robots.txt and sitemap, with canonical, Open Graph and JSON-LD on every page.
- Add Sveltia CMS at /admin/ for posts, products and site contact details (GitHub token sign-in, SRI-pinned script).
- Add GitHub Pages deploy workflow that builds against the live Pages URL, so a custom domain needs no code change.
- Add DanMa and Danik School product pages written from each product's shipped features.
- Add site design after the Phlox app-landing template: grey hero with a phone in green rings and orbiting icon tiles, product split sections with fact panels, a six-step setup section, a product chooser band, a demo band and a blue footer.
- Add HTML-drawn phone screens (roll call, report card, tuition, timetable, notifications) for the mockups.
- Add feature icons and a category line to products, and CMS-editable testimonials (shown only when entered).
- Animate the home page: hero load sequence (headline, rings, rising phone, tiles bursting from the rings with self-drawing icons, then floating tiles that follow the pointer), phone screens that act out their feature in view, drawing feature icons, counting facts and setup steps lighting up in order; all off under reduced motion.
- Use the Danik Group logo (src/assets/logo.png) in the header and as the tab icon, iPhone home-screen icon, Organization logo and fallback share image.
- Add a «محصولات» megamenu in the header (Digikala-style list + preview with picture, description and key features; tap-to-open product cards on phones) and move the product links into it.
- Add a `screen` field to products choosing their phone mockup, replacing per-page mappings.
- Show real phone screenshots of Danik School and DanMa in their product phones (home sections, product hero, megamenu), via a new optional `screenshot` product field; drawn screens remain the fallback.

### Fixed
- Fix the home page laying out wider than phone screens while product phones waited to swing in.
- Fix the products megamenu closing while the cursor moved from «محصولات» to the panel: the hover area now spans the header bar and closing waits briefly (hover intent).
