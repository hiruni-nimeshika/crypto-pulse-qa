// Generic smoke, responsive and robustness checks that work on any web app.
// They do not depend on Crypto Pulse's exact buttons, so they run as they are.
// Each test title starts with an ID (TC-A01 ...). Failures are real findings:
// reproduce them by hand before you file them as bugs.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1366', width: 1366, height: 768 },
];

function shotPath(testInfo, name) {
  const dir = path.join('screenshots', testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${name}.png`);
}

test.describe('Smoke checks', () => {
  test('TC-A01 page loads with a successful response', async ({ page }, testInfo) => {
    const response = await page.goto('/');
    expect(response, 'no response from the app, is it running?').not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await page.screenshot({ path: shotPath(testInfo, 'TC-A01-home'), fullPage: true });
  });

  test('TC-A02 page has a non-empty title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.trim().length, `page title was "${title}"`).toBeGreaterThan(0);
  });

  test('TC-A03 no JavaScript errors in the console on load', async ({ page }, testInfo) => {
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`); });
    page.on('pageerror', (err) => errors.push(`uncaught: ${err.message}`));
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(3000);
    if (errors.length) {
      await testInfo.attach('console-errors', { body: errors.join('\n'), contentType: 'text/plain' });
    }
    expect(errors, 'console errors found:\n' + errors.join('\n')).toEqual([]);
  });

  test('TC-A04 no failed network requests on load', async ({ page }) => {
    const failed = [];
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
    page.on('requestfailed', (r) => failed.push(`FAILED ${r.url()} (${r.failure() && r.failure().errorText})`));
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    expect(failed, 'failed requests:\n' + failed.join('\n')).toEqual([]);
  });

  test('TC-A07 page has at least one main heading (h1)', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('h1').count();
    expect(count, 'no <h1> found on the page').toBeGreaterThan(0);
  });

  test('TC-A06 images load and have an alt attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const problems = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('img').forEach((img) => {
        const src = img.currentSrc || img.src || '(no src)';
        if (!img.complete || img.naturalWidth === 0) out.push(`broken image: ${src}`);
        if (!img.hasAttribute('alt')) out.push(`missing alt attribute: ${src}`);
      });
      return out;
    });
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('TC-A08 keyboard Tab moves focus to an interactive element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName : 'NONE'));
    expect(['BODY', 'HTML', 'NONE'], `focus stayed on ${tag}`).not.toContain(tag);
  });

  test('TC-A10 main content appears within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('body *', { timeout: 5000 });
    const elapsed = Date.now() - start;
    expect(elapsed, `took ${elapsed} ms`).toBeLessThan(5000);
  });
});

test.describe('Responsive layout', () => {
  for (const vp of VIEWPORTS) {
    test(`TC-A05 no horizontal scrolling at ${vp.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.screenshot({ path: shotPath(testInfo, `TC-A05-${vp.name}`), fullPage: true });
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `page is ${scrollWidth}px wide in a ${clientWidth}px viewport`).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

test.describe('Robustness (evidence screenshots, review by eye)', () => {
  test('TC-A09 behaviour when the network goes offline after load', async ({ page, context }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await context.setOffline(true);
    await page.waitForTimeout(35000); // long enough for a 30-second refresh to be attempted
    await page.screenshot({ path: shotPath(testInfo, 'TC-A09-offline-after-35s'), fullPage: true });
    testInfo.annotations.push({
      type: 'review',
      description: 'Look at the screenshot: does the app show a clear error/stale-data message, or a blank/broken page?',
    });
    await context.setOffline(false);
  });

  test('TC-A11 app refreshes data about every 30 seconds (opt-in: CHECK_REFRESH=1)', async ({ page }, testInfo) => {
    test.skip(!process.env.CHECK_REFRESH, 'set CHECK_REFRESH=1 to run this 40-second check');
    const calls = [];
    page.on('request', (r) => { if (['fetch', 'xhr'].includes(r.resourceType())) calls.push(r.url()); });
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const before = calls.length;
    await page.screenshot({ path: shotPath(testInfo, 'TC-A11-before'), fullPage: true });
    await page.waitForTimeout(35000);
    await page.screenshot({ path: shotPath(testInfo, 'TC-A11-after-35s'), fullPage: true });
    expect(calls.length - before, 'no new API requests in 35 seconds').toBeGreaterThan(0);
  });
});
