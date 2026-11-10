import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The deploy workflow passes the Pages URL: the custom domain once it is set in the
// repo's Pages settings, else danikgroup.github.io with BASE_PATH=/website.
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  integrations: [sitemap()],
});
