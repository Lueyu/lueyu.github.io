# Pixel Homepage Implementation Plan

> **For agentic workers:** Execute this plan inline. The Figma Make export supplies the page markup and CSS.

**Goal:** Replace the old portfolio layout with the latest pixel-style homepage design.

**Architecture:** One React entry point renders the exported single-page component. A stylesheet supplies the pixel art, responsive rules, and themes. Vite builds static assets for GitHub Pages.

**Tech Stack:** React 19, Vite 8, CSS, npm, GitHub Pages.

---

### Task 1: Move the design into the repository

**Files:** `src/App.tsx`, `src/index.css`, `src/main.tsx`, `index.html`, `public/favicon.svg`

- [x] Extract those files from the Figma Make code export.
- [x] Replace the Figma template title and language in `index.html` with `Lueyu | AI Agent Developer` and `zh-CN`.
- [x] Point the contact button at the repository's existing email address.
- [x] Remove the unused Tailwind CSS import.

### Task 2: Restore local and Pages builds

**Files:** `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `README.md`

- [x] Configure Vite with the React plugin, `base: '/'`, and output directory `dist`.
- [x] Keep `npm run dev`, `npm run build`, and `npm run deploy` scripts; deploy `dist` with `gh-pages`.
- [x] Install dependencies and run `npm run build` successfully.

### Task 3: Verify the experience

- [x] Inspect the page at desktop and mobile widths.
- [x] Verify About, Work, and Contact anchors, day/night toggle, and Agent open/close state.
- [x] Confirm the email link and disabled Agent send control.
- [x] Check `git diff` for unrelated changes before completion.

### Task 4: Fit the first three sections to the viewport

**Files:** `src/index.css`, `src/App.tsx`

- [x] Give Home, About, and Work a `100svh` minimum height.
- [x] Keep the desktop hero and Work cards in columns at tablet widths, and compress decorative spacing on short desktop viewports.
- [x] Use a keyboard-accessible horizontal Work card row on narrow screens.
- [x] Measure the three section heights at narrow, medium, and wide viewport sizes; confirm their contents remain visible.
