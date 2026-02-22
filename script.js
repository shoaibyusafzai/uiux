/* ════════════════════════════════════════════
   ARIA SOL PORTFOLIO — script.js
   Canvas Aurora · Cursor · Popup · Reveal
════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════
// 1. AURORA CANVAS BACKGROUND
// ══════════════════════════════════════
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, orbs;

  const ORB_CONFIG = [
    { color: [124, 58, 237], r: 420, speed: 0.00018, ox: 0.3, oy: 0.25 },
    { color: [219, 39, 119], r: 340, speed: 0.00024, ox: 0.75, oy: 0.6  },
    { color: [5,  150, 105], r: 300, speed: 0.00015, ox: 0.55, oy: 0.85 },
    { color: [37,  99, 235], r: 260, speed: 0.0002,  ox: 0.15, oy: 0.7  },
    { color: [251,191,  36], r: 200, speed: 0.00028, ox: 0.85, oy: 0.2  },
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    orbs = ORB_CONFIG.map(c => ({
      ...c,
      x: c.ox * W,
      y: c.oy * H,
      t: Math.random() * Math.PI * 2,
      floatR: 60 + Math.random() * 80,
    }));
  }

  let raf;
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    orbs.forEach(o => {
      o.t += o.speed * 16;
      const cx = o.x + Math.cos(o.t) * o.floatR;
      const cy = o.y + Math.sin(o.t * 0.7) * o.floatR * 0.6;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
      grad.addColorStop(0,   `rgba(${o.color.join(',')}, 0.42)`);
      grad.addColorStop(0.5, `rgba(${o.color.join(',')}, 0.12)`);
      grad.addColorStop(1,   `rgba(${o.color.join(',')}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


// ══════════════════════════════════════
// 2. MAGNETIC CUSTOM CURSOR
// ══════════════════════════════════════
(function initCursor() {
  const ring = document.getElementById('cursorRing');
  const core = document.getElementById('cursorCore');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    core.style.left = mx + 'px';
    core.style.top  = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover expand
  const interactables = document.querySelectorAll(
    'a, button, .pcard, .chip, .process-step'
  );
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();


// ══════════════════════════════════════
// 3. SCROLL REVEAL
// ══════════════════════════════════════
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();


// ══════════════════════════════════════
// 4. NAVBAR SCROLL STATE
// ══════════════════════════════════════
(function initNav() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 120;
    sections.forEach(sec => {
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (active) active.style.color = 'var(--accent-v)';
      }
    });
  }, { passive: true });
})();


// ══════════════════════════════════════
// 5. SMOOTH SCROLL FOR NAV LINKS
// ══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ══════════════════════════════════════
// 6. POPUP — WHATSAPP
// ══════════════════════════════════════
(function initPopup() {
  const overlay  = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');

  // Trigger buttons
  const triggers = [
    document.getElementById('navHireBtn'),
    document.getElementById('heroHireBtn'),
    document.getElementById('contactHireBtn'),
  ];

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => btn && btn.addEventListener('click', open));
  closeBtn.addEventListener('click', close);

  // Close on overlay click (outside card)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


// ══════════════════════════════════════
// 7. 3D TILT ON GLASS CARDS
// ══════════════════════════════════════
(function initTilt() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width  / 2;
      const cy = r.height / 2;
      const tX = ((y - cy) / cy) * 5;
      const tY = ((x - cx) / cx) * -5;
      card.style.transform = `perspective(900px) rotateX(${tX}deg) rotateY(${tY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ══════════════════════════════════════
// 8. PROJECT CARD GLOW ON HOVER
// ══════════════════════════════════════
(function initCardGlow() {
  document.querySelectorAll('.pcard[data-glow]').forEach(card => {
    const color = card.dataset.glow;
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 24px 80px rgba(0 0 0 / 0.65), 0 0 48px ${color}40`;
      card.style.borderColor = `${color}55`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });
  });
})();


// ══════════════════════════════════════
// 9. HERO ENTRANCE ANIMATION (CSS-driven,
//    just trigger on load)
// ══════════════════════════════════════
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('visible');
  });
  // Fade body in
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});


// ══════════════════════════════════════
// 10. PARALLAX BLOBS SUBTLE
// ══════════════════════════════════════
(function initParallax() {
  document.addEventListener('mousemove', e => {
    const px = (e.clientX / window.innerWidth  - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
      const factor = (i + 1) * 8;
      orb.style.transform = `translate(${px * factor}px, ${py * factor}px)`;
    });
  });
})();


console.log('%c✦ Aria Sol Portfolio', 'color:#c084fc;font-size:16px;font-weight:bold;');
console.log('%cUI/UX Designer · Built with love & pixels.', 'color:#f472b6;font-size:12px;');
