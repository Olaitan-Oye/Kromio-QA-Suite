import { test } from '@playwright/test';

const authFile = 'storageState.json';

test('save logged-in session', async ({ page }) => {
    await page.goto('https://www.kromio.ai/');
    await page.locator('text="Log in"').first().click();

    // I will Login manually in the browser window that opens, then come back
    // to the terminal and click Resume in the Playwright Inspector.
    await page.pause();

    await page.context().storageState({ path: 'storageState.json' });
});