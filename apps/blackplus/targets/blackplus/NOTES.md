# Black Plus — CopyAnything clone

Source: https://blackplus-template.modulify.website/
Measurement viewport: 1728 × 982, DPR 2.
Scope: full homepage at the supplied URL. Navigation to other original routes remains linked to the source website.

## Evidence and implementation
- CopyAnything / Pingfusi 0.17.1 capture-run captured the settled DOM, 168 painted leaves, coverage and numeric measurements.
- Sandboxed Chrome launch failed; the authorized unsandboxed invisible runner works.
- Initial capture also measured the empty generated scaffold; its blank-paint receipt is superseded after the real build is captured.
- Automatic motion introspection found zero tracks because GSAP is bundled privately. An ongoing detect ran a 240-frame sample but yielded no numeric tracks.
- Public original bundle `source-scripts/0v4s2ig1.mukw.js` contains the actual GSAP 3.15 runtime, ScrollTrigger, CustomEase, and all animation declarations. `scripts/restore-interactions.py` extracts these verbatim and replaces only the React lifecycle wrapper. It restores authored intro, scroll, pointer and card effects with their original values.
- Cart and mobile navigation were opened in the source browser. The original handlers toggle display:flex/none, data-nav-menu-open and w--open; the clone reproduces these.
- Homepage form's source handler prevents submission and reveals the existing success message locally. The clone does the same; no backend submission is implied.
- Initial asset build had transient failures on one font and two images. Retrying the official capture-build command.

## Iteration log
| Round | Finding | Gate caught it? | Fix |
|---|---|---|---|
| Preflight | Sandbox prevents independent Chrome startup | Runner failed | Authorized runner outside sandbox |
| Capture | Private GSAP not introspected | Motion doc empty | Restore exact public authored runtime and declarations |
| Build 1 | Three transient asset download failures | Build exit 1 | Retry capture-build --fixes |

## Resume in Templates directory
- All asset downloads succeeded on retry: 130 fonts and 57 media files, plus remaining CSS backgrounds/favicons localized.
- Desktop visual gate: 2023 comparisons, zero failures; coverage 168/168; strict zero deltas. Two integration-phone marks excluded by the kit as unfreezable scroll-linked motion, still restored from original declarations and subject to visual review.
- First behavior sample had three timing outliers; same code remeasured without concurrent capture passed timing tolerances.
- Weak declared navbar and badge markers documented in behavior-deviations.json with browser/source evidence; no temporal animation excused.
- Mobile menu opens/closes correctly at 390x844.
