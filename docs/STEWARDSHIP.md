# Eco Explorer Stewardship Assessment

Last updated: 2026-02-24

## 1) System Reconstruction

This repository is a static marketing site for the Eco Explorer concept.
It is not the game itself. Its core goals are:

- Present product vision and conservation narrative
- Offer multilingual content (EN/PT/ES/FR)
- Embed an optional AI chatbot (Hugging Face/Gradio)
- Collect interest via forms (currently demo-first behavior)
- Support static hosting and basic offline access

## 2) Current Architecture

Runtime:

- Single HTML document: `index.html` (~1.3k lines)
- Client scripts:
  - `assets/js/i18n.js` translation loading and DOM updates
  - `assets/js/language-switcher.js` UI for language selection
  - `assets/js/main.js` navigation, UX effects, forms, notifications
- Service worker: `sw.js` (offline shell + runtime caching)

Build/tooling:

- Tailwind CSS build to `assets/css/tailwind.css`
- Build-time analytics injection toggle via `scripts/inject-analytics.mjs`
- No framework or bundler (plain static assets)

## 3) Strengths

- Simple deployment model (works on static hosts)
- Translation keys are consistently wired across locales
- Visual/interaction quality is strong for a static portfolio site
- Optional analytics injection is environment-controlled

## 4) Weaknesses and Risks

Architecture and maintainability:

- Monolithic `index.html` makes change review and ownership difficult
- Feature behavior is distributed across multiple global scripts
- No domain model/content schema; copy and structure are tightly coupled

Operational reliability:

- Service worker previously mixed root-relative paths that are unsafe on
  subpath deployments
- Form behavior previously always intercepted submit events, preventing native
  submit on Netlify hosts
- Build step previously caused avoidable HTML churn around analytics markers

Engineering hygiene:

- CI previously covered docs/secrets only; runtime quality checks were missing
- ESLint config format was outdated for current ESLint defaults
- No automated guardrail for i18n key drift or service-worker shell drift

## 5) Modernization Strategy

Guiding principle: maximize leverage while preserving a static-host deployment path.

Phase A: Stabilize (done in this change set)

- Correct runtime behavior where silently broken or fragile
- Add lightweight validation automation and CI enforcement
- Document architecture and modernization direction for future owners

Phase B: Decompose and standardize (next)

- Split `index.html` into section partials with a build step
  (11ty or Astro preferred)
- Move content into structured data files (`content/*.json`) and generate
  locale pages or parameterized templates
- Consolidate client JS into module boundaries
  (`ui`, `i18n`, `forms`, `sw`)

Phase C: Product-grade operability

- Replace simulated form flow with explicit backend integration path
- Add visual regression tests for language/layout breakage
- Add synthetic checks for chatbot embed availability and fallback UX

## 6) Highest-Leverage Improvement Backlog

1. Introduce template-based static site generation to break monolith
   ownership bottleneck.
2. Move copy and translation keys to typed schema with generation-time
   validation.
3. Add end-to-end smoke checks for critical user paths
   (load, language switch, form, chatbot visible/fallback).
4. Harden accessibility and SEO in CI (axe + structured metadata assertions).
5. Revisit service worker strategy after decomposition
   (cache budget + explicit offline scope).

## 7) Decisions Requiring Human Judgment

1. Host strategy: keep pure static single-page approach or migrate to static
   site generator.
2. Form strategy: demo-only simulation vs real submission backend
   (Netlify/Formspree/custom).
3. Chatbot dependency: keep third-party runtime embed vs first-party
   proxy/fallback approach.
4. Content scope: keep large all-in-one page vs focus on a shorter
   conversion-oriented narrative.
