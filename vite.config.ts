import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), '')
  const port = Number(env.VITE_PORT) || 10006
  const hasApiUrl = env.VITE_API_URL !== undefined && env.VITE_API_URL !== ''

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port,
      host: '0.0.0.0',
      open: true,
      ...(mode === 'dev' && !hasApiUrl
        ? {
            proxy: {
              '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ''),
              },
            },
          }
        : {}),
    },
    preview: {
      port,
      host: '0.0.0.0',
    },
  }
})
