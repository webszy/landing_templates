# crema — https://crema-template.modulify.website/ @ 1728px

## Iteration log
Record each loop: what a reviewer/you flagged, whether the **gate** caught it, and the fix.
A flag the gate MISSED is the valuable one — it becomes a tool check + fixture (see docs/DEVELOP.md).

| round | flagged | gate caught it? | fix | kit change (tool/fixture/instruction) |
|-------|---------|-----------------|-----|----------------------------------------|
| build | blank Three.js phone + rAF stage | no — 74 stage marks are excluded as unfreezable | port yO/yk/yN/intro from the page bundle into clone/vendor/crema-motion.js, loaded by fixes.js | none |
| build | screen corner radius 38.14px vs captured 35.47px | no — the mask is inside the excluded stage | radius is widthPx × screenRadiusFactor (body width × 0.93 × 0.13 × yU) | none |

## Site-specific findings

Homepage only. Next export lists `/`. One viewport: document height equals the 982px capture height. Settle on the live capture was stable, imagesPending 0, 9.3s. The clone recapture after motion was stable, 116 leaves, 8.1s.

The right-hand stage is a Three.js r180 iPhone (`/models/iphone-17-pro-compressed.glb`, KHR_mesh_quantization, no Draco/meshopt) plus CSS 3D props. `clone-lint` warns the canvas is dead without a script; the page does rely on it. Phase-freeze cannot stop the rAF stage, so pixel diff excludes 74 marks inside `.crema-stage`. Left column, buttons, avatars, and the background stay gated. Visual/coverage/strict stayed green after the motion script (534 comparisons, 0 fails; 116/116; 0 structural deltas).

Parameters come from the page bundle `0mt17nnz96uwg.js`, module starting at `let yy`. Asset root `https://pub-dc2abe5caae44240a6d1913566a75e0f.r2.dev/sections/crema`. Phone fit max dimension 12.684. `yU = 760/16.06`. Rest angle −14°. Drag 0.7°/px, commit ±90°. Auto-rotate every 4.5s by −360°. Screen index only advances after the intro sets `entered`. Measured body size at that fit: thickness 0.885, width 6.200, height 12.684. Overlay CSS matches the captured rest frame: 272.867 × 582.232, radius 35.473, offsetZ 20.951, stage scale 0.763158, perspective from `stageHeight/16.06*28`.

Intro is the GSAP timeline (power4 letters, power3 copy/buttons/stage, 452° → −14°, entrance 1.3 → 1, ~3.1s). It restores the captured inline styles when it ends so a recapture sees the settled letters. It starts on the next frame and preloads images in parallel. Waiting out a cold image cache (the live 4s fallback) would still be inside the intro when capture-run measures.

Environment stand-in for drei Environment + four Lightformers is RoomEnvironment PMREM plus the four classic lights. ContactShadows is a radial plane at y=−6.842. `three@0.180.0` needs both `three.module.js` and `three.core.js`. Remote rasters stay absolute URLs from capture-build.

Behavior gate passed after a recapture with the store buttons as their own hover scope. Both buttons measure `matrix(1, 0, 0, 1, 0, -2)` on hover. Drag and the 4.5s auto-rotate live inside the unfreezable stage, so the pixel gate does not see them; they swap cookie shake, caffè latte, and glazed donut. One startup letter sample on live closed at 67ms (still blurred); that row is in behavior-deviations.json because an exact filter string cannot match a finished intro. The Modulify badge `will-change` row is the captured CSS hover, which a synthetic mouse event cannot fire.
