import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      // Short tag list shown on cards + detail pages. Keep to 1–3.
      tags: z.array(z.string()).default([]),
      author: z.string().default('Nuraveda Lab'),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      // Reading-time estimate in minutes, displayed on cards.
      readingMinutes: z.number().int().positive().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
