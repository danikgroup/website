import { href } from "../utils.js";

export function GET({ site }) {
  const sitemap = new URL(href("/sitemap.xml"), site).href;
  return new Response(`User-agent: *\nAllow: /\nDisallow: ${href("/admin/")}\n\nSitemap: ${sitemap}\n`);
}
