import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SCREENS } from "./screens.js";

// Must match the icon select in public/admin/config.yml (and the keys in src/icons.js).
const ICON_NAMES = [
  "calendar", "timetable", "attendance", "exam", "report", "graduation", "money", "receipt",
  "message", "bell", "phone", "server", "backup", "import", "settings", "users", "school",
  "class", "book", "video", "shop", "ticket", "chart", "award", "shield", "language", "module", "camera",
];

// Mirror every change here in public/admin/config.yml, or the CMS writes files the build rejects.
const page = (image) => ({
  title: z.string(),
  description: z.string().max(170),
  image: image().optional(),
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false),
});

const products = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      ...page(image),
      name: z.string(),
      alternateName: z.string().optional(),
      category: z.string(),
      screen: z.enum(SCREENS).default("rollcall"),
      screenshot: image().optional(),
      screenshotAlt: z.string().optional(),
      tagline: z.string(),
      order: z.number().default(0),
      features: z
        .array(z.object({ icon: z.enum(ICON_NAMES).default("module"), title: z.string(), text: z.string() }))
        .default([]),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
      // Sales sections of the product page; each is skipped when empty.
      pains: z.array(z.object({ topic: z.string(), before: z.string(), after: z.string() })).default([]),
      day: z.array(z.object({ time: z.string(), who: z.string(), text: z.string() })).default([]),
      fit: z.array(z.string()).default([]),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      ...page(image),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
    }),
});

export const collections = { products, posts };
