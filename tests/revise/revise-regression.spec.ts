import { test, expect } from '@playwright/test';
import { BuilderPage } from '../../pages/BuilderPage';
import { ExtensionDetailPage } from '../../pages/ExtensionDetailPage';

/**
 * BUG-001: Revising a functional extension can silently break it.
 * See /bug-reports/BUG-001-revise-breaks-functionality.md for full report.
 *
 * This test is written as a REGRESSION GUARD: it should FAIL as long as
 * the bug exists, and PASS once Kromio fixes it. Marked `fixme` until
 * then so the suite doesn't report a false "broken pipeline" — this is
 * a known, filed issue, not a flaky test.
 */
test.describe('Revise flow — functional regression', () => {
  test.fixme(
    true,
    'BUG-001: revised extension start-recording button becomes unresponsive. ' +
    'Un-skip once fix is confirmed by Kromio team.'
  );

  test('revised screen-recorder extension retains original functionality', async ({ page, context }) => {
    const builder = new BuilderPage(page);
    await builder.goto();
    await builder.submitPrompt('Record the screen of any browser tab I am on');
    // Original generation confirmed working manually: recording starts.

    const detail = new ExtensionDetailPage(page);
    await detail.reviseWith('Add a pause button to the recorder');

    // Expected: revised extension should still be able to start a recording.
    // Actual (observed manually): the "Start recording" button becomes
    // unresponsive after revision — no console errors logged.
    const startButton = page.getByRole('button', { name: /start recording/i });
    await startButton.click();

    // This assertion is the regression guard — it will fail until fixed.
    await expect(page.getByText(/recording/i)).toBeVisible({ timeout: 5000 });
  });
});
