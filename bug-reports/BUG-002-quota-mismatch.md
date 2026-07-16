# BUG-002: Free-tier quota is inconsistent across product surfaces

**Product:** Kromio.ai (AI Chrome extension builder)
**Reported by:** [Your name]
**Date:** 2026-07-15
**Severity:** Medium (trust/communication issue, not a functional break)
**Status:** Open — pending Kromio team confirmation

## Summary
Kromio's free-tier generation limit is described differently across
different product surfaces, and the in-app enforced limit does not match
the most prominent public claim.

## Evidence Gathered
- Third-party listings and the product's own Product Hunt launch post
  state: **"New users get 20 credits per month."**
- The live in-app **Pricing** page states the free tier includes:
  **"2 generations per day."**
- Direct testing confirmed the app enforces **2 generations per day**
  (a paywall/upgrade prompt appeared after the 2nd generation attempt in
  a session), not a monthly 20-credit pool.

## Why This Matters
- 20 credits/month and 2 generations/day describe meaningfully different
  value propositions (roughly 60 vs 20 potential generations/month) —
  this isn't a rounding difference.
- A user evaluating the free tier based on external marketing (Product
  Hunt, review sites) will hit the paywall far sooner than expected,
  which is a credibility and conversion-trust issue, not just a copy typo.

## Steps to Reproduce
1. Read the "20 credits/month" claim on Kromio's Product Hunt page or
   third-party listing (e.g., completeaitraining.com).
2. Sign in to kromio.ai, navigate to **Pricing** — note the free tier
   description ("2 generations per day").
3. Submit 2 prompt generations in the same day.
4. Attempt a 3rd generation — an upgrade/paywall prompt appears.

## Expected Result
The stated quota should be consistent between marketing materials, the
in-app Pricing page, and actual enforced behavior.

## Actual Result
Three different numbers/models effectively describe the same "free tier":
20/month (marketing), 2/day (in-app pricing page), and 2/day (enforced
behavior, which at least matches the pricing page).

## Notes
- This may simply reflect a policy change that wasn't propagated to
  external listings — worth a quick fix regardless of cause.
- Recommend auditing all external launch-page copy (Product Hunt, review
  aggregators) for consistency with current in-app terms.
