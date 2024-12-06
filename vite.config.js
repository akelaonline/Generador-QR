import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Agregamos estas opciones para mejor compatibilidad
    target: 'esnext',
    sourcemap: true
  },
  // Agregamos la configuración del servidor
  server: {
    port: 3000,
    strictPort: true
  }
}) 