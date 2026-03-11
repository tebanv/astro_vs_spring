import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import bun from '@astrojs/bun'; // <--- Añade esto

export default defineConfig({
  output: 'server',
  adapter: bun(), // <--- Y esto
  integrations: [tailwind(), svelte()],
});