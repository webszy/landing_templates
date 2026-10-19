# Pixnova landing page

Adapted from `apps/manila`'s static workspace package, Inter fonts, floating capsule navigation and spacious hero design language. The original Manila app is untouched. Only the requested homepage is retained; unrelated Manila pages, branding, tracking and scripts are not copied.

## Run

From the repository root: `npm run dev --workspace=@templates/pixnava` (port 3010).

Build: `npm run build --workspace=@templates/pixnava`.

The deliverable is `targets/pixnava/clone/index.html`. All CSS, JavaScript, Inter font files and the transparent WebP are embedded. It works directly via file:// and requires no CDN, runtime dependencies or backend.

## Configuration

Edit `JELLY_CONFIG` inside the HTML: x/y are percentage positions, size is pixels, rotation/hue are degrees, saturation changes color intensity, delay/duration are milliseconds. Mobile positions and sizes use mx/my/msize. `mobile: true` selects the four mobile ornaments. `JELLY_ASSETS` accepts embedded images or replaceable PNG/WebP URLs; each entry may override `src`.

Unique JellyItem IDs and data-component="JellyItem" identify the repeated divs. Navbar, Hero.vue, JellyScene and CreativePrompt have explicit IDs.

Animations use WAAPI transform/opacity for entry, squash/stretch bounce, then small CSS transform floating. They do not receive pointer events. Reduced motion disables both animations, including when preference changes at runtime.

Generate validates the prompt and shows an honest preview-only status. No data is transmitted or persisted. Create/Get Started focus the prompt; Explore scrolls to the transition; Pricing opens a short informational dialog, without invented plans or checkout.

## Assets

Original generated PNG and optimized WebP live in assets/. Built-in ImageGen produced the original art; no reference-site artwork is reused. Generation prompts are recorded in assets/prompts.md.
