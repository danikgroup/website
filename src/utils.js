import { getCollection } from "astro:content";

// Internal link that survives a base path (danikgroup.github.io/website/ before the custom domain).
export const href = (path = "/") => import.meta.env.BASE_URL.replace(/\/$/, "") + path;

const shamsi = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "long" });
export const faDate = (date) => shamsi.format(date);

// Drafts show in `npm run dev`, never in the build.
export const published = async (name) =>
  (await getCollection(name, ({ data }) => import.meta.env.DEV || !data.draft));

export const products = async () => (await published("products")).sort((a, b) => a.data.order - b.data.order);

export const posts = async () => (await published("posts")).sort((a, b) => b.data.date - a.data.date);

export const breadcrumbs = (site, items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: new URL(href(path), site).href,
  })),
});
