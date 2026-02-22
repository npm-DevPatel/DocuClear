import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        // Document caching disabled by relying on standard asset globbing only
      },
      manifest: {
        name: "DocuClear — Document Simplifier",
        short_name: "DocuClear",
        description: "Simplify legal, medical, and government documents instantly.",
        start_url: "/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#2563EB",
        orientation: "any",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable any" }
        ],
        categories: ["utilities", "productivity", "accessibility"]
      }
    })
  ],
})
