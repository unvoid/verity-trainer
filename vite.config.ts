import { defineConfig, type Plugin } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

/**
 * Adds `<meta name="build">` with the deployed commit, so the live site can be
 * checked against the repository. Vercel provides VERCEL_GIT_COMMIT_SHA at
 * build time; elsewhere the value is "dev".
 */
function buildInfo(): Plugin {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev'
  return {
    name: 'build-info',
    transformIndexHtml: (html) => html.replace('</head>', `  <meta name="build" content="${commit}" />\n  </head>`),
  }
}

// https://vite.dev/config/ · https://vitest.dev/config/
export default defineConfig({
  plugins: [svelte(), buildInfo()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
