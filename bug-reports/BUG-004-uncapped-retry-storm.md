# BUG-004: Single click triggers uncapped automatic retry storm on rate-limit failure

**Product:** Kromio.ai (AI Chrome extension builder)
**Reported by:** [Your name]
**Date:** 2026-07-17
**Severity:** Medium-High
**Status:** Open — pending Kromio team confirmation

## Summary
A single click of the "Generate" button, made after the daily free-tier
quota was already exhausted, triggered more than 17 automatic, rapid-fire
retry requests to the generation API (`generate-openrouter-free`), all
failing with HTTP 429. No exponential backoff or retry cap was observed.

## Environment
- Browser: Google Chrome (desktop), DevTools Network tab open
- Account: Free tier, 0 generations remaining for the day
- Endpoint observed: `POST https://www.kromio.ai/api/generate-openrouter-free`

## Steps to Reproduce
1. Exhaust the daily free-tier quota (2 generations).
2. With 0 uses remaining, submit one prompt and click **Generate** exactly
   once.
3. Watch the Network tab (filtered to Fetch/XHR).

## Expected Result
One request should fire, receive a 429 response, and the UI should
surface the "Rate limit exceeded" message once — with no further
automatic retries, or at most a small, backed-off retry count.

## Actual Result
17+ near-identical `POST generate-openrouter-free` requests fired in
rapid succession (roughly 370–670ms apart), all returning:
```json
{"error":"Rate limit exceeded. Please try again later."}
```
from a single user click. The user-facing error message only appeared
after this retry sequence completed, meaning the perceived "hang" before
the error displayed was caused by the retry storm, not genuine latency.

## Evidence
- Network tab screenshot showing 17+ consecutive 429 responses to the
  same endpoint from one click (attach).
- Response body captured directly from one failed request (see above).

## Why This Matters
- Unnecessary load on Kromio's own backend per rate-limited click.
- Poor perceived performance — users experience a long, unexplained
  delay before seeing why their action failed.
- Repeated rapid requests from a single client are a common trigger for
  third-party abuse/rate-limit systems (e.g., at the infrastructure or
  CDN level), which could result in legitimate users being flagged.

## Notes
- Could not confirm from the client side whether retries are a
  fixed-count client-side loop or an artifact of some other mechanism
  (e.g., a stuck polling/queue check). Recommend the Kromio team check
  client-side retry logic for the generation call specifically in the
  rate-limited (429) case.