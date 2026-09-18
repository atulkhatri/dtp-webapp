import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * GitHub Pages has no server rewrite for SPAs. Missing paths (e.g. /login)
 * return 404.html. Copying index.html there lets React Router handle deep links.
 */
const dist = join(process.cwd(), 'dist')
const indexHtml = join(dist, 'index.html')
const notFoundHtml = join(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.error('spa-github-pages: dist/index.html missing — run vite build first')
  process.exit(1)
}

copyFileSync(indexHtml, notFoundHtml)
console.log('spa-github-pages: wrote dist/404.html for client-side routes')
