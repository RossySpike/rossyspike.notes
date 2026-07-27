// Importa el cargador glob
import { glob } from "astro/loaders";
// Importa utilidades de `astro:content` y `astro/zod`
import { defineCollection } from "astro:content";
import { blogSchema } from "./schemas/blog";
// Define un `loader` y un `schema` para cada colección
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
  schema: blogSchema
});
// Exporta un solo objeto `collections` para registrar tus colecciones
export const collections = { blog };
