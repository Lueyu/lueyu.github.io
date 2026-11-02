# Pixel reading layout implementation plan

**Goal:** Rebuild Lueyu's personal site around the reading layout and interactions of h1994st/h1994st.github.io while retaining original pixel art, content, routes, and assistant. Default to dark mode.

**Architecture:** Keep React/Vite and the existing project routes. Independently implement the reference's 1088px content measure, floating compact navigation, two-column hero (1:1.15), below-hero columns (1.4:1), and 640px About measure. Map the reference's writing/projects to this site's projects/experience; do not invent blog content. Keep the original pixel scene, palette, typography accents and theme toggle.

**Reference inspected:** `templates/index.html`, `templates/partials/nav.html`, `static/css/site.css` and facet layout/navigation tokens. Reference code and personal assets are not copied into this repository.

**Tech stack:** React 19, TypeScript, Vite, native dialog, CSS, Node test runner.

- [x] Default theme to night in `src/lib/theme.ts` and before first paint in `index.html`; preserve saved day; test storage failures and subscriber notification in `tests/theme.test.mjs`.
- [x] Rebuild `src/App.tsx` with compact navigation, readable identity/lead, original pixel scene, project rows, experience list and About/contact. Preserve section IDs and `data-project-slug` for assistant navigation.
- [x] Add scoped `src/home.css` and original `src/components/PixelWorld.tsx` scene: responsive 1088px shell, 720px collapse, restrained borders, pixel accents, reduced motion.
- [x] Add reusable `src/components/SiteSearch.tsx` and styles: local content search, slash / Ctrl-K shortcut, native dialog focus handling, arrows, Enter, Escape, backdrop, empty results. Mount in RouteFrame for project-page access.
- [x] Keep project content intact; adapt project-page top navigation to the same compact pattern without replacing technical illustrations or screenshots.
- [x] Run build, Node regression tests, desktop/mobile browser checks, theme persistence and search/navigation checks. Request independent review.
- [x] Commit only this task's files; preserve pre-existing staged and unstaged AIDR image edits. Verify commit and working tree after commit.

**Verification:** `npm run build`; `node --test tests/*.test.mjs`; browser at 1440px, 390px and 320px, dark/light, query empty/found/no results, keyboard close and focus return, anchors, resume, project routes and assistant launch.


## Verification results

- Production build and 17 Node regression tests passed.
- Browser QA passed 29 assertions: responsive widths (320/390/768/1440), theme persistence, repeated hash navigation, search empty/results/keyboard/focus restoration, resume focus/scroll handling, all project routes, and Agent launcher. No runtime exceptions in the completed QA run.
- Independent review approved after correcting shared Agent theme reporting and same-hash navigation.
- Existing staged/unstaged public/images/aidr changes are excluded from this commit.

