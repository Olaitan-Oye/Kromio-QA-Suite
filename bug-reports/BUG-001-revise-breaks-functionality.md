# BUG-001: Revising a working extension breaks core functionality without error

**Product:** Kromio.ai (AI Chrome extension builder)
**Reported by:** [Your name]
**Date:** 2026-07-15
**Severity:** High
**Status:** Open — pending Kromio team confirmation

## Summary
An AI-generated Chrome extension that successfully performed screen recording
became non-functional after using Kromio's "Revise" feature. The revised
version's primary action button ("Start recording") stopped responding to
clicks, with no error surfaced to the user and no error logged to the
browser console.

## Environment
- Browser: Google Chrome (desktop)
- Product surface: kromio.ai web app + generated Chrome extension
- Account type: Free tier

## Steps to Reproduce
1. Sign in to kromio.ai.
2. In the prompt box, submit: *"Record the screen of any browser tab I am
   on."*
3. Once generated, install/load the extension and confirm it works: click
   "Start recording" — recording begins successfully.
4. Navigate to "My extensions," select the generated extension, click
   **Revise**.
5. Enter an additional instruction (e.g., a minor feature addition) and
   submit.
6. Load the newly revised extension.
7. Click **Start recording**.

## Expected Result
The revised extension should retain the original working functionality
(recording starts) in addition to whatever change was requested, or —
if the revision fails — the user should see a clear error state.

## Actual Result
- The "Start recording" button does not respond to clicks.
- No recording begins.
- Browser DevTools console shows **no errors** at the time of failure.
- Separately: when attempting to open DevTools *while the original
  (pre-revision) extension was actively recording* and clicking elsewhere
  on the page, the DevTools panel closed and the in-progress recording was
  lost without being saved. This may be a related or separate issue —
  flagged for the Kromio team to assess, not conclusively diagnosed here.

## Evidence
- [ ] Screenshot/video of working original extension (attach)
- [ ] Screenshot/video of non-responsive revised extension (attach)
- [ ] Console output (empty) at time of failure (attach)

## Notes
- The original (pre-revision) version remains accessible under "My
  extensions" — Kromio does not overwrite version history, which limits
  the blast radius of this bug but does not resolve the core issue.
- Recommend the Kromio team verify: (a) whether revision re-generates the
  full extension bundle or patches it, and (b) whether any client-side
  validation exists to catch a non-functional revision before it's
  presented to the user as complete.
