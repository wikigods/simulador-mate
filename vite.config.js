import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Useful for GitHub Pages if not at root domain
  build: {
    outDir: 'dist'
  }
})
