/*!
 * Professional cursor effect
 * A quiet dot-and-ring cursor for pointer devices.
 */
(function () {
  var supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsFinePointer || prefersReducedMotion) return;

  var hoverSelector = 'a, button, input, select, textarea, [role="button"]';
  var textSelector = 'input, textarea, select, [contenteditable="true"]';

  function init() {
    var style = document.createElement('style');
    style.textContent = [
      'html.clean-cursor-enabled, html.clean-cursor-enabled * { cursor: none !important; }',
      'html.clean-cursor-enabled input, html.clean-cursor-enabled textarea, html.clean-cursor-enabled select, html.clean-cursor-enabled [contenteditable="true"] { cursor: auto !important; }',
      '.clean-cursor-dot, .clean-cursor-ring { position: fixed; left: 0; top: 0; pointer-events: none; z-index: 2147483647; opacity: 0; will-change: transform; transition: opacity 140ms ease, width 160ms ease, height 160ms ease, margin 160ms ease, border-color 160ms ease, background 160ms ease; }',
      '.clean-cursor-dot { width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: rgba(240,208,120,0.96); }',
      '.clean-cursor-ring { width: 26px; height: 26px; margin: -13px 0 0 -13px; border: 1px solid rgba(240,208,120,0.48); border-radius: 50%; box-shadow: 0 0 0 1px rgba(255,255,255,0.04); }',
      '.clean-cursor-visible { opacity: 1; }',
      '.clean-cursor-ring.is-hover { width: 34px; height: 34px; margin: -17px 0 0 -17px; border-color: rgba(240,208,120,0.82); background: rgba(240,208,120,0.06); }',
      '.clean-cursor-dot.is-hover { width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; }',
      '.clean-cursor-ring.is-pressed { width: 22px; height: 22px; margin: -11px 0 0 -11px; border-color: rgba(240,208,120,0.95); }',
      '@media (pointer: coarse), (prefers-reduced-motion: reduce) { .clean-cursor-dot, .clean-cursor-ring { display: none; } }'
    ].join('\n');
    document.head.appendChild(style);

    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'clean-cursor-dot';
    ring.className = 'clean-cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var current = { x: target.x, y: target.y };
    var visible = false;
    var textMode = false;

    function setVisible(nextVisible) {
      visible = nextVisible;
      dot.classList.toggle('clean-cursor-visible', visible && !textMode);
      ring.classList.toggle('clean-cursor-visible', visible && !textMode);
      document.documentElement.classList.toggle('clean-cursor-enabled', visible && !textMode);
    }

    function setHover(nextHover) {
      dot.classList.toggle('is-hover', nextHover && !textMode);
      ring.classList.toggle('is-hover', nextHover && !textMode);
    }

    document.addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

      target.x = event.clientX;
      target.y = event.clientY;
      textMode = !!event.target.closest(textSelector);

      setVisible(true);
      setHover(!!event.target.closest(hoverSelector));
    });

    document.addEventListener('pointerdown', function () {
      ring.classList.add('is-pressed');
    });

    document.addEventListener('pointerup', function () {
      ring.classList.remove('is-pressed');
    });

    document.addEventListener('pointerleave', function () {
      setVisible(false);
      setHover(false);
    });

    window.addEventListener('blur', function () {
      setVisible(false);
      setHover(false);
    });

    function render() {
      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;

      dot.style.transform = 'translate3d(' + target.x + 'px,' + target.y + 'px,0)';
      ring.style.transform = 'translate3d(' + current.x + 'px,' + current.y + 'px,0)';

      requestAnimationFrame(render);
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
