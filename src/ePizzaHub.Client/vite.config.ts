import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev: Vite on :5173 proxies /api to the .NET API on :5080.
// Build: output goes into the API's wwwroot so one App Service serves both.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5080' } },
  build: { outDir: '../ePizzaHub.Api/wwwroot', emptyOutDir: true },
})
