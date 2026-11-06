import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'github-pages-project-routes',
      closeBundle() {
        const output = join(process.cwd(), 'dist')
        const entry = join(output, 'index.html')

        for (const path of ['projects', 'blog', 'resume', 'projects/aidr', 'projects/squabble', 'projects/daily-portfolio', 'projects/next-quest', 'blog/squabble-from-debate-to-silence']) {
          const route = join(output, path)
          mkdirSync(route, { recursive: true })
          copyFileSync(entry, join(route, 'index.html'))
        }

        copyFileSync(entry, join(output, '404.html'))
      },
    },
  ],
  base: '/',
})
