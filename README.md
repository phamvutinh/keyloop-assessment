# Keyloop Technical Assessment - Sales Lead Management Tool

## Project overview

This repository contains my submission for the Keyloop Technical Assessment. I chose Scenario C: Sales Lead Management Tool, which focuses on helping a car dealership manage website leads and sales follow-ups.

The application covers three main workflows:

- Browse the lead inbox, with pagination and name search.
- Open a lead detail page to review contact details, the customer inquiry, and activity history.
- Record a new follow-up and show it in the activity history.

The demo data is fictional. The app currently uses MSW to mock the REST API, so no separate backend or database setup is required to run the submission.

## System design

For the architecture, data flow, API contract, trade-offs, observability notes, and future-readiness plan, see [`docs/system-design.md`](docs/system-design.md).

## Installation and running locally

### Requirements

- Node.js 20 or later.
- npm 10 or later.

### Local setup

Clone the repository:

```bash
git clone https://github.com/username/keyloop-assessment.git
cd keyloop-assessment
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite. The root route redirects to `/leads`.

### Build and preview

```bash
npm run build
npm run preview
```

The preview build uses the same mock API and supports the same core workflows as the development server.

### Real API configuration

The default demo does not require a `.env` file. To disable the mock API and use a real API, set the environment variables before building:

```bash
VITE_ENABLE_MOCKING=false VITE_API_URL=https://your-api.example/api npm run build
npm run preview
```

Vite embeds these values at build time. The real API must implement the frontend contract and allow requests from the frontend origin.

## Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Other project checks:

```bash
npm run lint
npm run format:check
npm run build
```

There is currently no `test:coverage` script in this project.

## Demo notes

- Lead search matches part of the customer name and is case-insensitive.
- Search is handled by the mock API before pagination, so the returned total reflects the filtered result set.
- New follow-ups are saved in localStorage for the current browser profile and origin.
- Development and preview usually run on different ports, so saved follow-ups may be separate between the two environments.
- If saved localStorage data is malformed or unsupported, the app shows a recovery state and asks for an explicit reset.
- The API client writes safe request metadata to the browser console: method, route template, HTTP status, and request duration. It does not log bodies, headers, search values, lead IDs, or raw URLs.

## AI Collaboration Narrative

I used GenAI as an engineering assistant while building this submission. I remained responsible for the scope, code review, corrections, verification, and final content.

My workflow:

- Split the work around the Scenario C flows: lead list, lead detail, activity history, and follow-up recording.
- Used `AGENTS.md`, `DESIGN.md`, and `reference_HTML.html` to keep implementation and UI decisions aligned with the repository guidance.
- Asked AI for help with implementation, refactoring, tests, and documentation, then checked the result with linting, tests, formatting checks, and builds.
- Corrected important scope and design issues during the process, including removing the out-of-scope lead status field, centralizing follow-up validation, adding recovery for malformed localStorage data, and splitting the Lead Detail route into smaller feature components.

The project has been checked during development with `npm run lint`, `npm test`, `npm run format:check`, and `npm run build`.

