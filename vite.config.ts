import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from /portfolio/; keep the dev server at the root.
  base: command === 'build' ? '/portfolio/' : '/',
}))
