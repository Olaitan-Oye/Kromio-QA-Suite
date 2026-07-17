# BUG-003: Primary "Generate" button has no accessible name

**Product:** Kromio.ai (AI Chrome extension builder)
**Reported by:** [Your name]
**Date:** 2026-07-16
**Severity:** Medium
**Status:** Open — pending Kromio team confirmation

## Summary
The "Generate" button — the single most important interactive element on
the page, since it's the entire product's core action — has no accessible
name. It contains only an icon and a credit-cost digit, with no
`aria-label` or equivalent text for assistive technology.

## Environment
- Browser: Google Chrome (desktop)
- Verified via: direct DOM inspection (Elements panel)

## Steps to Reproduce
1. Go to kromio.ai (logged in or out).
2. Right-click the circular white button next to the prompt textarea
   (the one showing a lightning-bolt icon and a number) → Inspect.
3. Review the element's attributes and contents.

## Expected Result
A primary call-to-action button should expose a meaningful accessible
name — via `aria-label`, visually-hidden text, or similar — so screen
reader users know what the button does before activating it.

## Actual Result
The button's only content is an SVG icon and a `<span>` containing just
the credit-cost number (e.g., "1"). No `aria-label`, `aria-labelledby`,
or hidden descriptive text is present. A screen reader would announce
this button with no meaningful name — effectively as just "button" or
the bare number "1" — giving no indication it triggers generation.

```html
<button class="h-12 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-12 sm:w-14">
  <div class="flex items-center">
    <svg ...></svg>
    <span class="text-lg sm:text-xl font-bold">1</span>
  </div>
</button>
```

## Why This Matters
- This is not a minor/secondary control — it's the core action of the
  entire product. An inaccessible primary CTA is a significant barrier
  for screen-reader users attempting to use Kromio at all.
- Simple, low-cost fix: adding `aria-label="Generate extension (costs 1
  credit)"` (or similar) would fully resolve this with no visual change.

## Notes
- This same gap likely affects automated testing/QA tooling that relies
  on accessible names to locate elements reliably (encountered directly
  while building this test suite — required anchoring on CSS classes
  instead of role/name, which is more brittle to future UI changes).