
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Injection sécurisée de la clé API pour le client @google/genai
    // Nous utilisons JSON.stringify pour que la valeur soit traitée comme une chaîne de caractères dans le code client
    'process.env.API_KEY': JSON.stringify("AIzaSyCgn7okk7Jt3qkr08w4FmIl2QGqEB-tZAc")
  },
  server: {
    host: true, // Listen on all addresses
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true, // Important pour les WebSockets
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
