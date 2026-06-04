// playwright tests
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // e2e test files here
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173', // Vite dev server URL
    headless: true,
  },
  // automatically starts the Vite dev server before running tests
  webServer: {
    command: 'npm run dev',
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      VITE_TMDB_API_KEY: '',
      VITE_API_URL: '',
    },
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 15000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
