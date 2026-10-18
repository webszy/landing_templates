# Aster capture and delivery notes

Source: https://aster-template.modulify.website/
Capture: Pingfusi 0.18.0, 1728 x 982 @ 2x, 2026-10-18.

## Delivery boundary

The user approved local source delivery in apps/aster, workspace integration and static checks, with no clone compilation, local preview launch, runtime/browser validation or Git push. Remote draft publication and human review were deferred in the approved summary. No clone server was started.

## Evidence and reproduction

- capture-run.json records stable:true, imagesPending:0 and 76 painted leaves on LIVE.
- capture-build --no-motion --fixes downloaded the original stylesheet, 16 WOFF2 fonts and two background videos. Favicon and logo were also saved locally.
- --no-motion avoids the automatic clone-runtime probe. The captured CSS includes aster-spin; no CSS keyframes were re-authored.
- evidence/original-page.js contains the original authored effect/interaction code. evidence/behavior-source.json records the source URL, digest and parameters.
- clone/fixes.js reproduces those parameters with native JavaScript. It does not load the original framework or analytics. Its behavior has not been runtime-compared against LIVE.
- Original subscribe flow uses local timers, not a subscription API; the clone retains this behavior.

## Workflow and checks

- target, assets, measure recorded through their gates.
- npm run check --workspace=@templates/aster and clone-lint passed static checks.
- build advance was refused because clone.json is absent; kept pending. No force override.
- visual, coverage, strict, behavior, review and done remain pending.
- No reviewer round filed, no approving verdict claimed.

## Environment

Sandboxed Chrome could not expose its DevTools port. The authorized sandbox-external headless capture succeeded. Sandboxed asset fetch failed; authorized sandbox-external asset download succeeded.

## Next verification

See ../../README.md and ../../QA.md for local commands and the manual checklist. Future pixel/behavior verification must capture the local clone and run the real gates; source-level evidence alone does not certify parity.
