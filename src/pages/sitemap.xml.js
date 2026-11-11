import { href, posts, products } from "../utils.js";

// Every page without a [param] is listed by itself, so a new page file needs no edit here.
const pages = Object.keys(import.meta.glob("./**/*.astro"))
  .filter((file) => !file.includes("[") && !file.endsWith("/404.astro"))
  .map((file) => file.slice(1).replace(/(index)?\.astro$/, "").replace(/([^/])$/, "$1/"));

const day = (date) => date.toISOString().slice(0, 10);

export async function GET({ site }) {
  const urls = [
    ...pages.map((path) => ({ path })),
    ...(await products()).map((p) => ({ path: `/products/${p.id}/` })),
    ...(await posts()).map((p) => ({ path: `/blog/${p.id}/`, lastmod: day(p.data.updated ?? p.data.date) })),
  ];
  const body = urls
    .map(({ path, lastmod }) => {
      const loc = new URL(href(path), site).href;
      return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
