import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  VitePWA({
    strategies: 'injectManifest',
    srcDir: 'public',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    includeAssets: [
      'favicon.svg'
    ],
    manifest: {
      name: 'Gossip With Go',
      short_name: 'GossipGo',
      description: 'Discover your favourite topics and discussion boards!',
      theme_color: '#574fe8',
      background_color: '#FFFFFF',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
  ],
})
