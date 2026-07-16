# Kromio.ai — Independent QA Audit & Test Suite

An unsolicited, self-directed QA audit of [Kromio.ai](https://www.kromio.ai),
an AI-powered Chrome extension generator. This project combines exploratory
manual testing with an automated Playwright + TypeScript regression suite,
following the same methodology used in a prior audit of PlugThis.ai.

## Why this exists
Most AI-generated products ship fast and get tested lightly before public
launch. This project treats a live, real-world AI tool as a QA target —
not a sandboxed practice app — to build and demonstrate the skills needed
for professional QA/SDET and AI evaluation work: systematic exploration,
evidence-backed bug reporting, and maintainable test automation.

## What's in here

```
kromio-qa-suite/
├── pages/              # Page Object Models (auth, builder, gallery, extension detail)
├── tests/
│   ├── auth/           # Sign-up / login flow
│   ├── generation/     # Prompt-to-extension generation, credit/quota boundaries
│   ├── revise/         # Revise-extension flow, incl. regression guard for BUG-001
│   ├── gallery/        # Gallery/My Extensions filtering, search, sort
│   └── privacy/        # Public/private visibility toggle
├── bug-reports/
│   ├── BUG-001-revise-breaks-functionality.md
│   └── BUG-002-quota-mismatch.md
└── playwright.config.ts
```

## Findings summary

| ID | Title | Severity | Type |
|----|-------|----------|------|
| BUG-001 | Revising a working extension silently breaks core functionality | High | Functional regression |
| BUG-002 | Free-tier quota inconsistent across marketing, pricing page, and enforced behavior | Medium | Trust / communication |

Full repro steps, evidence, and analysis in `/bug-reports`.

## Test approach
- **Framework:** Playwright + TypeScript, Page Object Model
- **Locator strategy:** role/accessible-name based (per Playwright best
  practice) rather than brittle CSS selectors, so the suite tolerates
  minor UI changes
- **Known limitation:** several locators are marked `TODO` pending
  verification against the live authenticated app — this suite was built
  from a documented manual walkthrough, and selectors should be confirmed
  before a full automated run
- **Credit-aware design:** tests run serially (`workers: 1`,
  `fullyParallel: false`) to avoid burning the free tier's limited daily
  generations during test runs

## Running locally
```bash
npm install
npx playwright install
npm test
```

## Status
Active — this is a living project. Additional flows (image-upload
generation, favorites, download-ZIP integrity) are planned next.

## Disclaimer
This is independent, unsolicited testing conducted for portfolio and
educational purposes on publicly accessible free-tier features. No
attempt was made to access other users' data or bypass paid restrictions.
