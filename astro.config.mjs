import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],
  site: 'https://github.com/sbnorton',
  base: '/',
  adapter: cloudflare(),
});
