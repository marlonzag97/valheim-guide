import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173/valheim-guide/', colorScheme: 'dark' },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173/valheim-guide/', reuseExistingServer: true },
  projects: [
    { name: 'handy', use: { ...devices['iPhone 13'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
  ],
})
