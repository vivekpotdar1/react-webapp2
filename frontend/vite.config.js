// Vite build configuration for this React app.
// This is where we enable the React plugin.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
