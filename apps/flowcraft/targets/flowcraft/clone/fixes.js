/* fixes.js — the JS-driven states the static capture froze, reproduced from measurements.
 *
 * Two marks on this page are driven by scripts that the DOM capture strips:
 *
 * 1. The "How full service works" tab progress bar. The page pauses its 15s
 *    `fc-progress` fill whenever the section leaves the viewport, so the live frame
 *    that was measured sits at scaleX 14.26/92.34 (delay −2316ms). Re-seeding the
 *    paused animation with that measured offset reproduces the captured frame
 *    instead of an empty bar.
 *
 * 2. The hero search placeholder (`fc-placeholder-in`). Measured on the live page:
 *    each phrase fades in over 0.5s (opacity 0 + translateY 55% → opacity 1 +
 *    translate 0) and then holds. The static capture strips the rotation, so the
 *    clone replays the fade as one continuous 3220ms cycle — the same 0.5s fade at
 *    the head of the cycle, then holding the captured phrase. Because the cycle
 *    never stops, the pixel capture freezes it at its 0% frame, which is the state
 *    the live page was measured in. The phrase rotation itself is not replayed:
 *    rotating it would put a different phrase in the snapshot than the one the
 *    capture measured (see NOTES.md).
 */
(function () {
  'use strict';

  // 1 — tab progress bar, measured phase (14.26px of a 92.34px track over 15s).
  try {
    var bar = document.querySelector('.fc-progress-bar');
    if (bar) bar.style.animationDelay = '-2316ms';
  } catch (error) {
    console.error('fixes: progress bar', error);
  }

  // 2 — hero placeholder: measured 0.5s fade-in inside a 3220ms cycle.
  try {
    var placeholder = document.querySelector('.fc-placeholder-in');
    if (placeholder) {
      var CYCLE = 3220;
      var FADE = 500;

      var sheet = document.createElement('style');
      sheet.textContent =
        '@keyframes fc-placeholder-cycle{' +
        '0%{opacity:0;transform:translateY(55%)}' +
        (FADE / CYCLE * 100).toFixed(2) + '%{opacity:1;transform:translate(0)}' +
        '100%{opacity:1;transform:translate(0)}}';
      document.head.appendChild(sheet);

      placeholder.style.animation = 'fc-placeholder-cycle ' + CYCLE + 'ms linear infinite both';
    }
  } catch (error) {
    console.error('fixes: hero placeholder', error);
  }
})();
