import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: { allowedDomains: [{ hostname: '127.0.0.1' }, { hostname: 'localhost' }] },
  devToolbar: { enabled: false },
});
