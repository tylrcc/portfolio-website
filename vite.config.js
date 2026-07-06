import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Let the inline boot shell paint before the full stylesheet downloads. */
function asyncCssPlugin() {
  return {
    name: 'async-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
          '<link rel="preload" href="$1" as="style" crossorigin onload="this.onload=null;this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>',
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
      resolveDependencies(_filename, deps) {
        return deps.filter((dep) => /react-vendor|rolldown-runtime|index-/.test(dep))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/howler')) return 'howler'
          if (id.includes('node_modules/lucide-react')) return 'lucide'
          if (id.includes('node_modules/react-draggable')) return 'draggable'
          if (id.includes('/src/components/DoomApp')) return 'doom'
          if (id.includes('/src/components/LinkedInApp') || id.includes('/src/data/linkedinProfile')) {
            return 'linkedin'
          }
          if (id.includes('/src/components/WorkApp') || id.includes('/src/data/workProjects')) {
            return 'work'
          }
        },
      },
    },
  },
})
