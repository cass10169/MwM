import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          process.platform === "win32"
            ? "set ENABLE_E2E_FIXTURES=true&& npm run dev -- --host 127.0.0.1 --port 4173"
            : "ENABLE_E2E_FIXTURES=true npm run dev -- --host 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
