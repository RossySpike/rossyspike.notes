import { z } from "astro/zod";
export const blogSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date().default(() => new Date()).transform((date) => date.toISOString().split('T')[0]),
  description: z.string(),
  author: z.string().default('RossySpike'),
  category: z.string().regex(/^\d+-[a-z0-9-]+$/, 'Invalid category format'),
  // This is for the tool `post_metadata_collection`
  // `preprocess` lets you touch the input data
  tags: z.preprocess((val) => {
    if (typeof val === 'string') {
      // for '["a","b"]'
      try {
        const parsed = JSON.parse(val.replace(/'/g, '"'));
        if (Array.isArray(parsed)) return parsed;
      } catch { }

      // for "programacion,astro,cli"
      return val.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return val;
  }, z.array(z.string())),
})
