// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mermaid from 'astro-mermaid';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://rossyspike-notes.netlify.app",
  integrations: [sitemap(), icon(),
  mermaid({theme:'dark',autoTheme:true})],

});

