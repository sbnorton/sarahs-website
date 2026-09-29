// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: "https://sbnorton.github.io",
  base: "/sarahs-website",
  integrations: [react()],
});