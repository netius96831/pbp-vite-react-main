import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import crx from 'vite-plugin-crx-mv3'

import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
})
