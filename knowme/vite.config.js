import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
 server: {
  allowedHosts: [
    /\.ngrok-free\.app$/,
    "d3f47e946c78.ngrok-free.app"
  ]
}
})
