// Playwright configuration for the Crypto Pulse QA suite.
// By default the tests run against your local app (npm run dev -> http://localhost:5173).
// To test the live site instead, set BASE_URL (see the npm script 'test:live').
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './automation/tests',
  timeout: 60000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'automation/report', open: 'never' }],
    ['json', { outputFile: 'automation/results.json' }],
  ],
  outputDir: 'automation/test-output',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
