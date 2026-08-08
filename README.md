# Roofing Operations Health Check — Framework Ops

A lead-generating operations audit intake for roofing contractors. Prospects answer a
36-question diagnostic across 8 operational disciplines and instantly receive an
interactive, benchmarked report.

## What's inside

- **Intake flow** (`pages/index.js`) — company profile step (revenue band, team size,
  market focus), then a sectioned questionnaire with auto-advance, keyboard shortcuts
  (`1`–`9`, arrow keys), progress tracking, and localStorage auto-save/resume.
- **Question bank & scoring** (`data/audit.js`) — 8 categories (Sales & Estimating,
  Production, Handoff, Job Costing, Team, Technology, Financials, Customer Experience),
  industry benchmarks, a 5-level maturity model, per-question recommendations, and a
  revenue-band-driven margin-at-risk model.
- **Interactive report** (`components/Report.js`, `components/charts.js`) —
  animated score gauge, radar chart vs. industry benchmark (hover tooltips,
  click-to-jump), category drill-down accordions with per-answer recommendations,
  a ranked priority roadmap, financial impact breakdown, and print/PDF support.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Lead capture webhook

Completed audits POST the full payload (profile, scores, responses) to a Make.com
webhook. Set it via environment variable:

```
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-id
```

Without it, submission fails silently and the report still renders.

## Deploy

Deployed on Vercel (`vercel.json` uses the `@vercel/next` builder). Add
`NEXT_PUBLIC_MAKE_WEBHOOK_URL` in the Vercel project settings.
