import rss from "@astrojs/rss";
import site from "../data/site.json";
import { href, posts } from "../utils.js";

export async function GET(context) {
  return rss({
    title: site.name,
    description: site.description,
    site: new URL(href("/"), context.site).href,
    customData: "<language>fa</language>",
    items: (await posts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: href(`/blog/${post.id}/`),
    })),
  });
}
