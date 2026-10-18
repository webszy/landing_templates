# onda — https://onda-template.modulify.website/ @ 1728px

## Iteration log
Record each loop: what a reviewer/you flagged, whether the **gate** caught it, and the fix.
A flag the gate MISSED is the valuable one — it becomes a tool check + fixture (see docs/DEVELOP.md).

| round | flagged | gate caught it? | fix | kit change (tool/fixture/instruction) |
|-------|---------|-----------------|-----|----------------------------------------|
|       |         |                 |     |                                        |

## Site-specific findings
(structure quirks, faux-bold, etc. — generalize the durable ones into docs/LEARNINGS.md)

## 2026-10-18 implementation and validation
- CopyAnything / Pingfusi 0.17.1 captured the settled DOM at 1728×982 @2x. All original CSS/fonts/images are locally hosted.
- Static capture passed 4,620 visual comparisons while losing 12 canvas paintings. Lint warned, but numeric gates missed the missing pixels. Manual screenshot comparison caught this before review.
- Restored the exact public source algorithms for silk, morph, stream, globe, ripple, halftone images, footer wordmark and pointer dots. `scripts/build-effects.cjs` extracts those original modules into a small DOM adapter. Native CSS supplies exact transition curves.
- Restored menu/header states, counters, reveal triggers, process lines and form validation. The form is a preview only: valid submissions explicitly state that no delivery backend is connected, and no message is sent to the original studio.
- Added captured Contact page at /contact.html and /contact/index.html. Local server also resolves /contact/.
- The behavior gate compares continuous animation phases from separate navigation times. It reports opacity/translation differences on the original CSS pulse and marquee despite exact introspection verification of both (±1ms timing, ±0.01 values). Ran the tool's recommended motion trace; original .9s/1.1s reveal declarations and trigger thresholds are preserved. This timing-sensitive gate remains honestly blocked rather than altering measurements or disabling animations.
- Final desktop visual: 4620 comparisons, 0 fails; coverage 317/317; strict 0 structural deltas.

## Directory migration continuation
- Continued in /Volumes/Development/Templates/onda-studio per user instruction.
- Completed previously interrupted Contact-specific silk seed/tilt/center/speed correction from captured original Contact source.
- Ambient canvas removal now disconnects observers and unsubscribes animation ticks.
- Rebuilt dist and confirmed all source clone files match output byte-for-byte.
- Automatic approval review rejected the bundled third-party draft upload. Retried only local edits/build, which succeeded. No new upload or independent review has been performed. Explicit user approval is required to resume that external step.
