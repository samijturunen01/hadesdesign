import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * BASE_PATH is the public path the site is served from.
 *
 *  - Production (custom domain https://hadesdesign.fi)        → "/" (default)
 *  - Preview on project pages, e.g. https://<user>.github.io/hadesdesign/ → "/hadesdesign/"
 *
 * The GitHub Actions workflow sets it automatically (see .github/workflows/deploy.yml).
 */
const rawBase = process.env.BASE_PATH?.trim() || '/'
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/\/{2,}/g, '/')

export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [react()],
  build: {
    target: 'es2022',
    cssMinify: true,
    // The SSR bundle is a throwaway used only by scripts/prerender.mjs.
    copyPublicDir: !isSsrBuild,
    // Keep small SVGs inline, never the large images.
    assetsInlineLimit: 2048,
  },
  // Dedicated ports so this project never collides with other local Vite projects.
  server: {
    port: 5373,
    strictPort: true,
    watch: { ignored: ['**/dist/**', '**/dist-ssr/**'] },
  },
  preview: {
    port: 4373,
    strictPort: true,
  },
}))
