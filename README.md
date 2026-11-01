# CivicFix

**Spot it. Report it. Track it.**

CivicFix is a hackathon demo for turning photos of local civic issues into structured reports that can be reviewed and tracked.

> **Current status:** the UI and report workflow are a prototype. Image analysis currently returns a hard-coded mock response, and reports are stored in an in-memory process-level array. The demo dashboard also contains hard-coded headline statistics. It is not a production municipal reporting service.

## Demo flow

```text
Photo
  |
  v
Mock Image Analysis
  |
  v
User Review / Edit
  |
  v
Create Report
  |
  v
Demo Dashboard + Tracking
```

## Current implementation

- Next.js App Router application using TypeScript.
- Server actions for image-analysis requests and report operations.
- Report schema with category, severity, description, location, status, and timestamps.
- Seed data for the dashboard.
- Responsive demo UI and a Vercel deployment.

## Known limitations

- `src/lib/ai.ts` simulates a delay and returns a fixed response. It does not call a vision model or inspect the submitted image.
- `src/lib/store.ts` stores reports in memory. Data is not durable across serverless instances, deployments, or restarts.
- The dashboard's top-line counts are hard-coded demo values and must not be interpreted as live community statistics.
- Authentication, authorization, abuse prevention, durable database storage, and operational integrations are not implemented.
- Location data and uploaded images need validation, retention rules, and privacy controls before real-world use.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel

## Run locally

```bash
git clone https://github.com/manav-gupta1/CivicFix.git
cd CivicFix
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production-readiness roadmap

- [ ] Integrate a real vision model behind a server-side provider adapter.
- [ ] Validate file type, file size, and image content before analysis.
- [ ] Replace in-memory storage with a durable database.
- [ ] Derive dashboard statistics from persisted records.
- [ ] Add authentication, authorization, and report ownership rules.
- [ ] Add rate limits, abuse controls, and upload storage policies.
- [ ] Add tests for report validation, creation, and status transitions.
- [ ] Define privacy and retention policies for photos and precise location data.

## Deployment

Demo: https://civicfix-demo.vercel.app

## License

No license has been added yet. All rights reserved unless and until a license is specified.
