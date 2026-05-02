/*!
 * Subtle cursor halo
 * Keeps the native cursor and adds a quiet focus ring on pointer devices.
 */
(function () {
  var finePointer = window.matchMedia('(pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!finePointer.matches || reducedMotion.matches) return;

  var hoverSelector = 'a, button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

  function init() {
    var style = document.createElement('style');
    style.textContent = [
      '.clean-cursor-ring { position: fixed; left: 0; top: 0; width: 24px; height: 24px; margin: -12px 0 0 -12px; pointer-events: none; z-index: 2147483647; opacity: 0; border: 1px solid rgba(240,208,120,0.42); border-radius: 50%; box-shadow: 0 0 0 1px rgba(255,255,255,0.04); will-change: transform; transition: opacity 140ms ease, width 160ms ease, height 160ms ease, margin 160ms ease, border-color 160ms ease, background 160ms ease; }',
      '.clean-cursor-ring.clean-cursor-visible { opacity: 1; }',
      '.clean-cursor-ring.is-hover { width: 32px; height: 32px; margin: -16px 0 0 -16px; border-color: rgba(240,208,120,0.75); background: rgba(240,208,120,0.045); }',
      '.clean-cursor-ring.is-pressed { width: 20px; height: 20px; margin: -10px 0 0 -10px; border-color: rgba(240,208,120,0.9); }',
      '@media (pointer: coarse), (prefers-reduced-motion: reduce) { .clean-cursor-ring { display: none; } }'
    ].join('\n');
    document.head.appendChild(style);

    var ring = document.createElement('div');
    ring.className = 'clean-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);

    var target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var current = { x: target.x, y: target.y };
    var rafId = null;
    var visible = false;

    function safeClosest(targetNode, selector) {
      return targetNode && typeof targetNode.closest === 'function' && targetNode.closest(selector);
    }

    function render() {
      current.x += (target.x - current.x) * 0.28;
      current.y += (target.y - current.y) * 0.28;
      ring.style.transform = 'translate3d(' + current.x + 'px,' + current.y + 'px,0)';

      if (visible) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }

    function setVisible(nextVisible) {
      visible = nextVisible;
      ring.classList.toggle('clean-cursor-visible', visible);

      if (visible && rafId === null) {
        rafId = requestAnimationFrame(render);
      } else if (!visible && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function cleanup() {
      setVisible(false);
      ring.remove();
      style.remove();
    }

    document.addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

      target.x = event.clientX;
      target.y = event.clientY;
      ring.classList.toggle('is-hover', !!safeClosest(event.target, hoverSelector));
      setVisible(true);
    });

    document.addEventListener('pointerdown', function () {
      ring.classList.add('is-pressed');
    });

    document.addEventListener('pointerup', function () {
      ring.classList.remove('is-pressed');
    });

    document.addEventListener('pointerleave', function () {
      setVisible(false);
      ring.classList.remove('is-hover', 'is-pressed');
    });

    window.addEventListener('blur', function () {
      setVisible(false);
      ring.classList.remove('is-hover', 'is-pressed');
    });

    reducedMotion.addEventListener('change', function (event) {
      if (event.matches) cleanup();
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
