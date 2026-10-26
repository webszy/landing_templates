# forge — https://forge-template.modulify.website/ @ 1728px

## Iteration log
Record each loop: what a reviewer/you flagged, whether the **gate** caught it, and the fix.
A flag the gate MISSED is the valuable one — it becomes a tool check + fixture (see docs/DEVELOP.md).

| round | flagged | gate caught it? | fix | kit change (tool/fixture/instruction) |
|-------|---------|-----------------|-----|----------------------------------------|
| 1 | `span_watch_progress` had no measured target on the clone | ✓ coverage | the clone paused the 7s bar on exit (the page's own in-view hook); a bar still running at snapshot time is frozen to phase 0, `scaleX(0)` ⇒ zero width ⇒ never enumerated | — |
| 1 | status widget: row opacity / 1.07px y-offset / icon cross-fade | ✓ visual | the widget replays its 520ms swap-in + 300ms icon cross-fade on a **1350ms** beat (measured at 25ms), not on the message timer; the message text does not advance inside the capture window | — |
| 1 | 4 opacity deltas remained on the status widget | ✗ visual/strict → environment-blocked | the replay beat fires *after* the phase-freeze pass, so both sides are sampled mid-animation; two consecutive live captures differ from each other by 0.06 on the same icons | candidate: a "timers running" freeze tier — pause page timers, not just Animation objects |

## Site-specific findings

- **Status widget beat** (`div.glass-night` panel): every 1350ms the whole row replays `swap-in` (520ms) and the loader/check pair cross-fades (`transition-opacity duration-300`). Sampling at 25ms for 12s: fades at 0, 1698, 2779, 4383, 5477, 7094, 8208, 9805, 10896, 12513ms — i.e. a ~1350ms beat with alternating polarity, while the title stays on "Connecting your stack".
- **Watch tab progress bar**: `progress-fill` 7s linear, `animation-fill-mode: forwards`, paused by the page whenever the section leaves the viewport; on animationend the live page advances to the next tab. The clone loops it in place instead (the tab panel content is frozen by the capture), so `iterationCount` is the one deliberate deviation — recorded in `behavior-deviations.json`.
- **Marquees**: two independent `marquee` loops (55s logo strip, 80s logos section), linear infinite. Their phase at sampling time can never match between two captures; the visual gate freezes them, the behavior gate compares a raw sample — hence the documented deviations.
- **Reduced motion**: the stylesheet ships `@media (prefers-reduced-motion: reduce)` blocks that kill `swap-*` and `watch-progress`; the capture runs without the preference, so those rules never apply.

