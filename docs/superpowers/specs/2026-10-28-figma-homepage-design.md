# Pixel Homepage Design

## Source and scope

Implement the latest user-edited [Figma Make homepage](https://www.figma.com/make/y8Xfm3oAQ1kmBLtZ8LJa3R/) in this repository. The exported design source is the visual and interaction reference. The page is a single scrolling portfolio with Home, About, Work, and Contact sections.

## Structure and behavior

- Keep the pixel art scene, typography, color palette, responsive layout, and daylight/night themes from the design.
- Make Home, About (01), and Work (02) fill the viewport on standard screen sizes. Allow content to extend on unusually short screens so it remains readable.
- On narrow screens, show Work cards in a horizontally scrollable row so the section can fit one viewport.
- Keep the floating Agent as a clearly marked coming-soon preview. Its trigger opens and closes the panel; the send control stays disabled until a chat service exists.
- Preserve the existing working contact email, `lueyuwang@gmail.com`, in the new contact button.
- Use the desktop navigation anchors and mobile scrolling flow from the design, with button labels, expanded state, and reduced-motion styles. Keep closed Agent controls out of the keyboard focus order.

## Implementation

Use React and the exported CSS. Replace the old Create React App entry point with Vite so the new design can build cleanly on the available Node runtime. Remove Figma Make runtime configuration and its unused Tailwind dependency; the exported page uses ordinary CSS selectors. Keep a GitHub Pages deployment script that publishes `dist`.

## Verification

Run a production build, measure the Home, About, and Work section heights against several viewport heights, inspect desktop and mobile layouts, and exercise navigation, theme toggle, and Agent panel controls. Confirm the contact link points to the existing address.
