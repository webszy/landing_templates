# peelmark — https://peelmark.modulify.website/ @ 1728px

## Iteration log
Record each loop: what a reviewer/you flagged, whether the **gate** caught it, and the fix.
A flag the gate MISSED is the valuable one — it becomes a tool check + fixture (see docs/DEVELOP.md).

| round | flagged | gate caught it? | fix | kit change (tool/fixture/instruction) |
|-------|---------|-----------------|-----|----------------------------------------|
| 0 | 21 canvases blank after capture-build | clone-lint WARN dead-canvas | restore original Next runtime (skip analytics); SSR body to avoid hydration recovery | Modulify/Next canvas sites need runtime restore after capture-build |
| 0 | caret-blink opacity 0 vs 1 | behavior OUT OF TOLERANCE | same CSS loop, phase sample; verify-introspected pass | infinite CSS loops compared as end-state opacity |
| 0 | hover probes inconclusive | behavior | CSS :hover / canvas pointer; documented in behavior-deviations.json | synthetic MouseEvent cannot set :hover or drive WebGL |

## Site-specific findings

- Modulify Next static export at https://peelmark.modulify.website/ @ 1728×982 @2x.
- Sticker peel/shine and vinyl designer are canvas/WebGL in the original runtime. capture-build strips scripts; `scripts/restore-runtime.mjs` localizes `_next` chunks, `__NEXT_DATA__`, favicon, logo, and rewrites `~` in filenames for hosted drafts.
- Do not re-run capture-build without re-running restore-runtime.
- Hero finish keys are `role=radio` (White/Sparkle/Prism/Ripple/Halftone).
- 15 self-hosted woff2; logo from `/_next/image` also stored as `clone/_next/image` so the query-string optimizer URL still paints.
