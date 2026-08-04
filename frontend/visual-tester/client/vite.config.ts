import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss  from '@tailwindcss/vite'
import { loadConfig } from '@gobs/visual-test-config'

const config = loadConfig()
const serverTarget = `${config.serverProtocol}://${config.serverHost}:${config.serverPort}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': serverTarget,
      '/static-assets': serverTarget,
      '/allow': serverTarget,
    },
  },
})
