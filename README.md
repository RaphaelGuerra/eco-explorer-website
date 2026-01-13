# Eco Explorer — Project Website

Last updated: 2026-01-13

## Table of Contents

<!-- TOC start -->
- [What It Does](#what-it-does)
- [Run Locally](#run-locally)
  - [Local Development Server](#local-development-server)
- [Technical Requirements](#technical-requirements)
- [Chatbot (Optional)](#chatbot-optional)
- [Design Features](#design-features)
- [Sections](#sections)
- [Focus](#focus)
- [Tech Stack](#tech-stack)
- [Status & Learnings](#status--learnings)
- [License](#license)
- [Troubleshooting](#troubleshooting)
  - [Website Not Loading?](#website-not-loading)
  - [Forms Not Working?](#forms-not-working)
  - [Language Not Switching?](#language-not-switching)
  - [Service Worker Issues?](#service-worker-issues)
  - [Port Already in Use?](#port-already-in-use)
- [Deploy](#deploy)
<!-- TOC end -->

[![Lint](https://github.com/RaphaelGuerra/eco-explorer-website/actions/workflows/lint.yml/badge.svg)](https://github.com/RaphaelGuerra/eco-explorer-website/actions/workflows/lint.yml)
[![Security](https://github.com/RaphaelGuerra/eco-explorer-website/actions/workflows/security.yml/badge.svg)](https://github.com/RaphaelGuerra/eco-explorer-website/actions/workflows/security.yml)

Portfolio site for the Eco Explorer game concept: a lightweight,
multi‑language landing with highlights, media, and an optional chatbot
section.

## What It Does

- Presents the game pitch, feature highlights, and conservation angle
- Offers multi‑language content (EN, PT, ES, FR)
- Embeds optional chatbot (Hugging Face Space) for Q&A
- Includes simple newsletter form and contact links
- Ships as a static site with basic offline support

## Run Locally

### Local Development Server

```bash
# Navigate to the website directory
cd eco-explorer-website

# Start Python's built-in server
python3 -m http.server 8000

# Open your browser to: http://localhost:8000
```

Or use VS Code’s Live Server extension on `index.html`.

## Technical Requirements

🔧 The website requires a proper HTTP server because:

1. **Service Worker** - Requires HTTPS or localhost for offline functionality
2. **CORS Policy** - External resources need proper headers
3. **Form Handling** - Local JavaScript handlers for newsletter/contact forms
4. **Security** - Modern browsers block features when opening files directly

## Chatbot (Optional)

- Embeds the EcoExplorerBot (Hugging Face Spaces)
- Used for quick Q&A about the project and conservation theme

## Design Features

🎨 Key design touches:

- **Jaguar Spots Pattern** - Authentic onça pintada inspired background
- **Wild Glow Effects** - Animated blue glow elements
- **Glass Morphism** - Modern glass-like effects
- **Gradient Borders** - Blue gradient styling throughout
- **Responsive Navigation** - Mobile-first design
- **Accessibility** - ARIA labels, keyboard navigation, focus management

## Sections

- Hero, pillars, and feature highlights
- Media embed (YouTube) and screenshots
- Chatbot (optional)
- Newsletter and contact

## Focus

- Educational conservation theme (Itatiaia NP, jaguar)
- Simple, accessible presentation over heavy frameworks

## Tech Stack

- HTML + CSS + JavaScript
- Tailwind CSS
- Simple i18n (JSON locales)
- Optional service worker

## Status & Learnings

- Functional concept site for the game
- Learnings: content‑first landing, simple i18n, and static deployments

## License

All rights reserved. Personal portfolio project — not for production use.

## Troubleshooting

🚨 Common issues and fixes.

### Website Not Loading?

- Make sure you're using a proper HTTP server (not just opening the HTML file)
- Check that all files are in the correct directories
- Try refreshing the page

### Forms Not Working?

- Newsletter and Contact forms work locally with JavaScript handlers
- They show success messages without needing a backend
- For production, connect to your preferred form service (Netlify Forms,
  Formspree, etc.)

### Language Not Switching?

- Check that all locale JSON files are present
- Ensure the language switcher is functioning
- Try refreshing the page after language change

### Service Worker Issues?

- Service worker requires HTTPS in production
- For local development, localhost is fine
- Check browser DevTools → Application → Service Workers

### Port Already in Use?

```bash
# Try a different port
python3 -m http.server 8001
```

## Deploy

- Any static host (GitHub Pages, Netlify, Vercel)
