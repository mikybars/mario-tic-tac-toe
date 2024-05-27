import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        svgProps: {
          role: 'img'
        }
      }
    }),
    react()
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
