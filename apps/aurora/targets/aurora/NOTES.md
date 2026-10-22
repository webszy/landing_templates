# Aurora CopyAnything run — 2026-10-20

Original: https://aurora-template.modulify.website/ ; viewport 1728×982 DPR 2.

- capture-run obtained stable original DOM, 23 painted leaves, original CSS and fonts. capture-build generated the clone and self-hosted 11 fonts.
- The visible background is a Three.js WebGL canvas; static capture alone omits its pixels and JS-driven modes. Localized original publicly served Next/Turbopack chunks, preserving shaders, GSAP timing, cursor response, five mode presets and Tune control logic. Analytics scripts were not restored.
- Original SSR initial root is used to hydrate the captured page without React #418. Original captured DOM remains intact as evidence. source/original.html and scripts/restore-runtime.mjs record provenance. fixes.js is the sequential original-runtime loader. One '~' filename and all matching references renamed to '-' because draft hosting rejects '~'.
- Initial visual/coverage/strict checks passed: 203 comparisons, 0 fails, all 23 leaves covered, no structural deltas.
- Browser checks: WebGL canvas 3456×1964; all five preset buttons become aria-pressed=true when clicked; Tune opens; 390px viewport scrollWidth=390; no page errors or missing network responses. qa/ contains evidence screenshots and browser.json.
- Behavior capture was attempted with default settle and 5000ms settle, using kit-owned visible-state headless Chrome on both sides. The startup eyebrow recorded duration differs (live roughly 1.1s versus clone roughly .66s) despite the original byte-derived JS timing. Other floating intermediate blur/matrix differences disappear with longer settle. Synthetic hover probes on click-operated mode/Tune buttons are inconclusive on original and clone. Do not claim behavior passed. Temporal differences are not excused in behavior-deviations.json.
- Motion capture observed no declarative animations; JS/WebGL trace attempted separately. Numeric CSS leaf gates do not certify canvas fidelity; the independent side-by-side review is required.

| Iteration | Issue | Change | Gate outcome |
| --- | --- | --- | --- |
| 1 | static capture has no WebGL runtime | local original JS runtime | static visual passes |
| 2 | React #418 hydration recovery | restore original SSR initial root | browser errors=0 |
| 3 | draft rejects '~' filename | rename file and references | hosted draft succeeds |
| 4 | startup phase sampling differs | longer equal settle; motion tooling | behavior still not passed |

Final service blocker: review filing returned `Insufficient credits (0)`; no approving round exists. User needs to top up Pingfusi before review can continue. WebGL trace produced 348 draws / 344 frames, 1 track, 0 DOM channels. Hosted draft URL and expiry recorded in draft.json. No forced or invented pass.
