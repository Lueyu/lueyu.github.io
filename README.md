# Lueyu's homepage

Pixel-style personal homepage based on the latest Figma Make design.
The two typefaces are bundled locally so the page does not depend on Google Fonts at runtime. The Noto Sans SC file contains the characters currently used in `src/App.tsx`; regenerate that subset if you add new copy.

## Local development

```bash
npm install
npm run dev
```

Run `npm run build` to type-check and generate the static site in `dist/`.

## GitHub Pages

The repository is configured for the user site at `https://lueyu.github.io/`. Run `npm run deploy` to build and publish `dist/` to the `gh-pages` branch.

The floating Agent is a visual preview. Its send control remains disabled until a chat service is connected.
