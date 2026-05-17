import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FiveM serves the build under `nui://<resource>/web/dist/...` so all asset
// references must be relative — base: './'.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
  server: {
    port: 5502,
    host: true,
  },
})
