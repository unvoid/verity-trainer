import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/ · https://vitest.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
