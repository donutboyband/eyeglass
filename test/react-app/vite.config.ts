import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Ensure JSX source transform is enabled for _debugSource
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx-source'],
        ],
      },
    }),
  ],
})
