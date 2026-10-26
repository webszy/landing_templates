// fixes.js — reproduces the page's JS-driven behaviour in the static capture.
// Values come from the site's own source/measurements (see targets/forge/NOTES.md).
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onView(el, cb) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        cb();
      });
    }, { threshold: 0 });
    io.observe(el);
  }

  function replayAnimation(el) {
    if (!el) return;
    var prev = el.style.animation;
    el.style.animation = 'none';
    void el.offsetWidth; // force a style flush so the animation restarts
    el.style.animation = prev;
  }

  // --- Status panel: a loader/check icon pair cross-fading on the page's own beat
  // --- (source: the page's status widget, sampled at 25ms).
  try {
    var rows = [].slice.call(document.querySelectorAll('.swap-in'));
    var statusRow = rows.filter(function (el) {
      return el.parentElement && el.parentElement.querySelector('.stack-grid');
    })[0];

    if (statusRow && !reduce) {
      var grid = statusRow.parentElement.querySelector('.stack-grid');
      var loader = grid && grid.querySelector('.lucide-loader');
      var check = grid && grid.querySelector('.lucide-check');

      var showCheck = function (done) {
        if (loader) {
          loader.classList.toggle('opacity-0', done);
          loader.classList.toggle('opacity-100', !done);
        }
        if (check) {
          check.classList.toggle('opacity-100', done);
          check.classList.toggle('opacity-0', !done);
        }
      };

      // Measured on the live widget (25ms sampling, 12s in view): on a 1350ms beat the
      // whole row replays its 520ms swap-in and the loader/check pair cross-fades over
      // 300ms — while the message text itself does NOT advance during that window (the
      // reference still reads "Connecting your stack" at capture time). Driving the
      // icons from a message timer, or advancing the text, put the clone at a different
      // phase than the reference and showed up as opacity / y-offset deltas.
      var trigger = statusRow.closest('.glass-night') || statusRow.closest('.watch-panel') || statusRow;
      onView(trigger, function () {
        var on = false;
        showCheck(on);
        window.setInterval(function () {
          on = !on;
          showCheck(on);
          replayAnimation(statusRow);
        }, 1350);
      });
    }
  } catch (error) { /* keep the rest of the fixes alive */ }

  // --- Watch tabs: the active tab's 7s progress bar runs only while the section is in
  // --- view and pauses when it leaves (the live page's own in-view hook). The clone
  // --- loops the bar in place: the tab panel content stays static, so switching tabs on
  // --- animation end would replace text the capture froze.
  // ---
  // --- The pause-on-exit is not cosmetic: the capture's scroll sweep leaves the section,
  // --- and a bar still running at snapshot time gets frozen to phase 0 by the phase
  // --- freeze (scaleX(0) ⇒ zero-width ⇒ not enumerated as a painted leaf). Pausing on
  // --- exit is what the live page does, so the freeze leaves it alone at a mid phase —
  // --- the same state the live reference is measured in.
  try {
    var bars = [].slice.call(document.querySelectorAll('.watch-progress'));
    if (bars.length && !reduce) {
      bars.forEach(function (bar) {
        bar.style.animationIterationCount = 'infinite';
      });
      var section = bars[0].closest('section') || bars[0].closest('[class*="watch"]') || bars[0].parentElement;
      var setPlay = function (state) {
        bars.forEach(function (bar) { bar.style.animationPlayState = state; });
      };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { setPlay(entry.isIntersecting ? 'running' : 'paused'); });
        }, { threshold: 0 }).observe(section);
      } else {
        setPlay('running');
      }
    }
  } catch (error) { /* keep the rest of the fixes alive */ }
})();
