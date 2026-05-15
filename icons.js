// ALCHEMIA — procedural pixel-art icon renderer
// Each of 1,512 elements gets a unique pixel sprite + a subtle CSS animation.
// Strategy: ~26 hand-designed archetypes × per-element palette × modifier overlays.
// Multi-frame animation: archetype functions may return { frames:[g0,g1,g2], mfKey }
// instead of a plain grid. renderIcon handles both cases.

(function () {
  'use strict';

  const SIZE = 14;
  const DB = window.ALCHEMIA_DB;

  // ---------- grid helpers ----------
  function blank() {
    const g = new Array(SIZE);
    for (let y = 0; y < SIZE; y++) g[y] = new Array(SIZE).fill(0);
    return g;
  }
  function px(g, x, y, v) { if (x>=0 && x<SIZE && y>=0 && y<SIZE && v) g[y][x] = v; }
  function rect(g, x0, y0, w, h, v) {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(g, x, y, v);
  }
  function circle(g, cx, cy, r, v) {
    const r2 = r * r;
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      if (dx*dx + dy*dy <= r2) px(g, x, y, v);
    }
  }
  function ring(g, cx, cy, r, v) {
    const r2 = r * r, r1 = (r-1) * (r-1);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = dx*dx + dy*dy;
      if (d <= r2 && d >= r1) px(g, x, y, v);
    }
  }
  function tri(g, x0, y0, w, dir, v) {
    if (dir === 'up') for (let i = 0; i < w; i++) rect(g, x0+i, y0+i, w-i*2, 1, v);
    else if (dir === 'down') for (let i = 0; i < w; i++) rect(g, x0+i, y0+(w-1-i), w-i*2, 1, v);
  }
  function line(g, x0, y0, x1, y1, v) {
    const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
    const sx = x0<x1?1:-1, sy = y0<y1?1:-1;
    let err = dx-dy, x = x0, y = y0;
    while (true) {
      px(g, x, y, v);
      if (x===x1 && y===y1) break;
      const e2 = 2*err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx)  { err += dx; y += sy; }
    }
  }
  // copy grid deeply
  function cloneGrid(g) { return g.map(row => row.slice()); }

  // ---------- archetype shape builders ----------
  // Returns either a plain grid OR { frames:[g0,g1,...], mfKey:'name' }

  // ── FLAME: 3 frames — small / medium / tall tongue ──────────────────────
  function s_flame() {
    function base(g) {
      rect(g, 5, 11, 4, 1, 1);
      rect(g, 4, 10, 6, 1, 2);
      circle(g, 7, 8, 3.2, 2);
      ring(g, 7, 8, 3.5, 1);
      circle(g, 7, 9, 1.8, 3);
      px(g, 7, 9, 4); px(g, 6, 9, 4);
      px(g, 4, 9, 2); px(g, 10, 9, 2);
    }
    // frame 0 — small flame, tip at row 5
    const g0 = blank(); base(g0);
    px(g0, 7, 5, 2); px(g0, 7, 6, 2);
    px(g0, 6, 6, 2); px(g0, 8, 6, 2);
    px(g0, 7, 6, 3);
    // frame 1 — medium, tip at row 3–4
    const g1 = blank(); base(g1);
    px(g1, 7, 3, 2); px(g1, 7, 4, 2);
    px(g1, 6, 4, 2); px(g1, 7, 4, 2); px(g1, 8, 4, 2);
    px(g1, 6, 5, 2); px(g1, 7, 5, 3); px(g1, 8, 5, 2);
    // frame 2 — tall, tip at row 2 with wide spread
    const g2 = blank(); base(g2);
    px(g2, 7, 2, 2); px(g2, 7, 3, 2); px(g2, 7, 4, 2);
    px(g2, 6, 3, 2); px(g2, 8, 3, 2);
    px(g2, 5, 4, 2); px(g2, 6, 4, 2); px(g2, 8, 4, 2); px(g2, 9, 4, 2);
    px(g2, 6, 5, 2); px(g2, 7, 5, 4); px(g2, 8, 5, 2);
    return { frames: [g0, g1, g2], mfKey: 'flame' };
  }

  // ── DROP / water: 3 frames — still / ripple 1 / ripple 2 ────────────────
  function s_drop() {
    function dropBody(g) {
      circle(g, 7, 9, 4, 2);
      ring(g, 7, 9, 4, 1);
      px(g, 7, 3, 2); px(g, 7, 4, 2); px(g, 7, 5, 2);
      px(g, 6, 4, 2); px(g, 8, 4, 2);
      px(g, 6, 5, 2); px(g, 8, 5, 2);
      px(g, 7, 2, 1);
      px(g, 5, 8, 3); px(g, 5, 7, 3); px(g, 6, 7, 3); px(g, 6, 8, 4);
    }
    // frame 0 — drop still, small ripple ring at bottom
    const g0 = blank(); dropBody(g0);
    px(g0, 5, 13, 1); px(g0, 6, 13, 1); px(g0, 7, 13, 1); px(g0, 8, 13, 1); px(g0, 9, 13, 1);
    // frame 1 — drop, medium ring
    const g1 = blank(); dropBody(g1);
    px(g1, 4, 13, 1); px(g1, 5, 13, 1); px(g1, 9, 13, 1); px(g1, 10, 13, 1);
    px(g1, 3, 12, 1); px(g1, 11, 12, 1);
    // frame 2 — drop, no ring (just splashed)
    const g2 = blank(); dropBody(g2);
    px(g2, 3, 13, 1); px(g2, 11, 13, 1);
    px(g2, 2, 12, 1); px(g2, 12, 12, 1);
    return { frames: [g0, g1, g2], mfKey: 'drop' };
  }

  // ── BUBBLE: 3 frames — bubbles at different heights ──────────────────────
  function s_bubble() {
    // large bubble always in center
    function bigBubble(g) {
      circle(g, 7, 9, 3.2, 2);
      ring(g, 7, 9, 3.5, 1);
      px(g, 5, 8, 3); px(g, 6, 8, 4);
    }
    // frame 0: small bubble left top, tiny bubble right-mid
    const g0 = blank(); bigBubble(g0);
    circle(g0, 4, 5, 1.8, 2); ring(g0, 4, 5, 2, 1); px(g0, 3, 4, 3);
    circle(g0, 10, 6, 1.2, 2); ring(g0, 10, 6, 1.5, 1);
    // frame 1: bubbles risen slightly
    const g1 = blank(); bigBubble(g1);
    circle(g1, 4, 3, 1.8, 2); ring(g1, 4, 3, 2, 1); px(g1, 3, 2, 3);
    circle(g1, 10, 4, 1.2, 2); ring(g1, 10, 4, 1.5, 1);
    px(g1, 11, 11, 2); px(g1, 11, 12, 2); // new bubble emerging at bottom
    // frame 2: old bubbles gone, new medium bubble mid-left
    const g2 = blank(); bigBubble(g2);
    circle(g2, 3, 6, 1.5, 2); ring(g2, 3, 6, 1.8, 1);
    circle(g2, 10, 5, 1.8, 2); ring(g2, 10, 5, 2, 1); px(g2, 9, 4, 3);
    return { frames: [g0, g1, g2], mfKey: 'bubble' };
  }

  // ── SPARK / lightning: 2 frames — bolt A / bolt B (branch shift) ─────────
  function s_spark() {
    // frame 0 — main fork leaning left
    const g0 = blank();
    line(g0, 7, 1, 5, 5, 2); line(g0, 5, 5, 8, 7, 2); line(g0, 8, 7, 4, 11, 2);
    line(g0, 5, 5, 3, 8, 2); line(g0, 8, 7, 11, 6, 2); line(g0, 11, 6, 10, 10, 2);
    px(g0, 7, 1, 4); px(g0, 7, 2, 4); px(g0, 8, 6, 4); px(g0, 7, 7, 4);
    px(g0, 5, 11, 3); px(g0, 4, 12, 3); px(g0, 3, 8, 1); px(g0, 12, 6, 1);
    // frame 1 — fork shifted, new tip pixel appears bright
    const g1 = blank();
    line(g1, 7, 1, 6, 5, 2); line(g1, 6, 5, 9, 7, 2); line(g1, 9, 7, 5, 11, 2);
    line(g1, 6, 5, 4, 9, 2); line(g1, 9, 7, 12, 6, 2); line(g1, 12, 6, 11, 10, 2);
    px(g1, 7, 1, 4); px(g1, 7, 2, 3); px(g1, 9, 6, 4); px(g1, 8, 7, 4);
    px(g1, 6, 11, 3); px(g1, 5, 12, 3); px(g1, 4, 9, 1); px(g1, 12, 5, 4);
    return { frames: [g0, g1], mfKey: 'spark' };
  }

  // ── LANTERN: 3 frames — glow dim / mid / bright ──────────────────────────
  function s_lantern() {
    function shell(g) {
      rect(g, 5, 4, 5, 7, 2); // tube body
      rect(g, 5, 3, 5, 1, 1); rect(g, 5, 11, 5, 1, 1); // caps
      px(g, 6, 2, 1); px(g, 8, 2, 1); px(g, 6, 12, 1); px(g, 8, 12, 1); // wires
    }
    // frame 0 — dim glow
    const g0 = blank(); shell(g0);
    rect(g0, 6, 4, 3, 7, 2);
    rect(g0, 7, 4, 1, 7, 3);
    px(g0, 4, 7, 1); px(g0, 10, 7, 1); // faint corona
    // frame 1 — mid glow
    const g1 = blank(); shell(g1);
    rect(g1, 6, 4, 3, 7, 3);
    rect(g1, 7, 4, 1, 7, 4);
    px(g1, 4, 6, 1); px(g1, 4, 7, 1); px(g1, 4, 8, 1);
    px(g1, 10, 6, 1); px(g1, 10, 7, 1); px(g1, 10, 8, 1);
    // frame 2 — bright glow, wide corona
    const g2 = blank(); shell(g2);
    rect(g2, 6, 4, 3, 7, 3);
    rect(g2, 7, 4, 1, 7, 4);
    px(g2, 4, 5, 1); px(g2, 4, 6, 2); px(g2, 4, 7, 2); px(g2, 4, 8, 2); px(g2, 4, 9, 1);
    px(g2, 10, 5, 1); px(g2, 10, 6, 2); px(g2, 10, 7, 2); px(g2, 10, 8, 2); px(g2, 10, 9, 1);
    px(g2, 3, 7, 1); px(g2, 11, 7, 1);
    return { frames: [g0, g1, g2], mfKey: 'lantern' };
  }

  // ── RADIOACTIVE: 3 frames — blades at 0° / 40° / 80° rotation ───────────
  function s_radioactive() {
    function makeBlade(g, baseAngle) {
      circle(g, 7, 7, 1.5, 4);
      const offsets = [0, 2.094, 4.189];
      for (const a0 of offsets) {
        const a = a0 + baseAngle;
        for (let r = 2.5; r <= 4.5; r += 0.5) {
          for (let da = -0.45; da <= 0.45; da += 0.3) {
            const bx = 7 + r * Math.cos(a + da);
            const by = 7 + r * Math.sin(a + da);
            px(g, Math.round(bx), Math.round(by), 2);
          }
        }
        const tx = 7 + 4.5 * Math.cos(a);
        const ty = 7 + 4.5 * Math.sin(a);
        px(g, Math.round(tx), Math.round(ty), 3);
      }
    }
    const g0 = blank(); makeBlade(g0, 0);
    const g1 = blank(); makeBlade(g1, 0.698); // ~40 degrees
    const g2 = blank(); makeBlade(g2, 1.396); // ~80 degrees
    return { frames: [g0, g1, g2], mfKey: 'radioactive' };
  }

  // ── LIQUID: 3 frames — drip level changes ────────────────────────────────
  function s_liquid() {
    function body(g) {
      circle(g, 7, 8, 3.5, 2);
      ring(g, 7, 8, 3.8, 1);
    }
    // frame 0 — drip stretched tall
    const g0 = blank(); body(g0);
    px(g0, 7, 3, 2); px(g0, 7, 4, 2); px(g0, 6, 4, 2); px(g0, 8, 4, 2);
    px(g0, 7, 5, 2); px(g0, 6, 5, 2); px(g0, 8, 5, 2);
    px(g0, 5, 7, 4); px(g0, 5, 8, 3); px(g0, 6, 7, 4);
    px(g0, 8, 10, 3); px(g0, 9, 10, 3); rect(g0, 5, 9, 3, 1, 3);
    // frame 1 — drip thinning
    const g1 = blank(); body(g1);
    px(g1, 7, 4, 2); px(g1, 7, 5, 2); px(g1, 7, 6, 2);
    px(g1, 6, 5, 2); px(g1, 8, 5, 2);
    px(g1, 5, 7, 3); px(g1, 6, 7, 4); px(g1, 5, 8, 3);
    px(g1, 8, 10, 3); rect(g1, 5, 9, 3, 1, 3);
    // frame 2 — no drip, body only
    const g2 = blank(); body(g2);
    px(g2, 5, 7, 4); px(g2, 5, 8, 3); px(g2, 6, 7, 4);
    px(g2, 8, 10, 3); px(g2, 9, 10, 3); rect(g2, 5, 9, 3, 1, 3);
    px(g2, 7, 4, 2); // tiny nascent drip starts forming
    return { frames: [g0, g1, g2], mfKey: 'liquid' };
  }

  // ── VIAL: 3 frames — bubbles rising inside tube ──────────────────────────
  function s_vial() {
    function shell(g) {
      rect(g, 5, 2, 1, 9, 1); rect(g, 9, 2, 1, 9, 1); // walls
      rect(g, 6, 2, 4, 9, 2); // interior
      circle(g, 7, 11, 2, 2); rect(g, 6, 11, 4, 1, 1); // bottom
      px(g, 5, 11, 1); px(g, 9, 11, 1);
      rect(g, 5, 1, 5, 1, 1); rect(g, 6, 0, 3, 1, 1); // stopper
      rect(g, 6, 7, 4, 4, 3); // liquid
      px(g, 7, 7, 4); px(g, 8, 7, 4); // liquid highlight
      px(g, 6, 3, 4); px(g, 6, 4, 3); // glass shine
    }
    // frame 0 — bubble at bottom
    const g0 = blank(); shell(g0);
    px(g0, 7, 9, 4); px(g0, 8, 10, 4);
    // frame 1 — bubble mid-rise
    const g1 = blank(); shell(g1);
    px(g1, 7, 7, 4); px(g1, 8, 8, 4);
    px(g1, 7, 10, 2); // new bubble forming at bottom
    // frame 2 — bubble near surface, new one at bottom
    const g2 = blank(); shell(g2);
    px(g2, 7, 5, 4); px(g2, 8, 6, 3);
    px(g2, 7, 9, 4); // new bubble lower
    return { frames: [g0, g1, g2], mfKey: 'vial' };
  }

  // ── CRYSTAL: 3 frames — sparkle pixels rotate through corners ────────────
  function s_crystal() {
    function body(g) {
      px(g, 7, 2, 2);
      rect(g, 6, 3, 3, 1, 2); rect(g, 5, 4, 5, 1, 2);
      rect(g, 4, 5, 7, 1, 2); rect(g, 4, 6, 7, 2, 2);
      rect(g, 4, 8, 7, 1, 2); rect(g, 5, 9, 5, 1, 2);
      rect(g, 6, 10, 3, 1, 2); px(g, 7, 11, 2);
      px(g, 9, 6, 1); px(g, 9, 7, 1); px(g, 9, 8, 1); // shadow
    }
    // frame 0 — sparkle top-left
    const g0 = blank(); body(g0);
    px(g0, 5, 5, 3); px(g0, 6, 5, 3); px(g0, 7, 4, 3); px(g0, 5, 6, 4); px(g0, 6, 6, 3);
    px(g0, 4, 3, 4); px(g0, 5, 3, 3); // corner sparkle
    // frame 1 — sparkle top-right
    const g1 = blank(); body(g1);
    px(g1, 8, 5, 3); px(g1, 9, 5, 3); px(g1, 8, 4, 4); px(g1, 7, 4, 3);
    px(g1, 10, 3, 4); px(g1, 9, 3, 3); // corner sparkle right
    // frame 2 — sparkle center bottom
    const g2 = blank(); body(g2);
    px(g2, 6, 8, 3); px(g2, 7, 8, 4); px(g2, 6, 9, 3); px(g2, 7, 9, 3);
    px(g2, 7, 11, 4); px(g2, 6, 11, 3); // bottom sparkle
    return { frames: [g0, g1, g2], mfKey: 'crystal' };
  }

  // ── ATOM: 3 frames — electrons sweep clearly around orbits ──────────────
  function s_atom() {
    function nucleus(g) {
      circle(g, 7, 7, 1.8, 4);
      ring(g, 7, 7, 2.2, 2);
      // horizontal orbit ellipse
      for (let x = 2; x <= 12; x++) {
        const dy = Math.round(0.5 * Math.sin((x - 2) / 10 * Math.PI));
        px(g, x, 7 + dy, 2);
      }
      // two diagonal orbits
      line(g, 3, 4, 11, 10, 2);
      line(g, 11, 4, 3, 10, 2);
    }
    // frame 0 — electrons far right / upper-left / lower-right
    const g0 = blank(); nucleus(g0);
    px(g0, 12, 7, 4); px(g0, 13, 7, 3);            // horizontal orbit — far right
    px(g0, 3, 4, 4);  px(g0, 2, 3, 3);              // diagonal orbit A — upper-left
    px(g0, 11, 10, 4); px(g0, 12, 11, 3);           // diagonal orbit B — lower-right
    // frame 1 — electrons opposite: far left / lower-right / upper-left
    const g1 = blank(); nucleus(g1);
    px(g1, 2, 7, 4);  px(g1, 1, 7, 3);              // horizontal orbit — far left
    px(g1, 11, 4, 4); px(g1, 12, 3, 3);             // diagonal orbit A — upper-right
    px(g1, 3, 10, 4); px(g1, 2, 11, 3);             // diagonal orbit B — lower-left
    // frame 2 — electrons at top / mid-right / mid-left (third position)
    const g2 = blank(); nucleus(g2);
    px(g2, 7, 7, 4);  px(g2, 8, 6, 3);              // center glint (all electrons crossing)
    px(g2, 12, 6, 4); px(g2, 2, 8, 4);              // horizontal both tips lit
    px(g2, 7, 2, 4);  px(g2, 7, 12, 4);             // diagonals at top and bottom
    return { frames: [g0, g1, g2], mfKey: 'atom' };
  }

  // ── MAGNET: 3 frames — field lines pulse dramatically outward ────────────
  function s_magnet() {
    function horseshoe(g) {
      rect(g, 4, 4, 3, 6, 2); rect(g, 8, 4, 3, 6, 2);
      circle(g, 7, 5, 3, 2); circle(g, 7, 5, 1.5, 0);
      rect(g, 4, 9, 3, 2, 4); rect(g, 8, 9, 3, 2, 1);
      rect(g, 4, 4, 3, 1, 1); rect(g, 8, 4, 3, 1, 1);
    }
    // frame 0 — no field lines, quiet
    const g0 = blank(); horseshoe(g0);
    // frame 1 — inner arc, 3 pixels each side
    const g1 = blank(); horseshoe(g1);
    px(g1, 2, 8, 2); px(g1, 2, 9, 2); px(g1, 2, 10, 2);
    px(g1, 12, 8, 2); px(g1, 12, 9, 2); px(g1, 12, 10, 2);
    px(g1, 3, 11, 1); px(g1, 11, 11, 1); // bottom curve hint
    // frame 2 — big extended arc spans far outside the magnet body
    const g2 = blank(); horseshoe(g2);
    px(g2, 2, 7, 2); px(g2, 2, 8, 2); px(g2, 2, 9, 2); px(g2, 2, 10, 2); px(g2, 2, 11, 2);
    px(g2, 12, 7, 2); px(g2, 12, 8, 2); px(g2, 12, 9, 2); px(g2, 12, 10, 2); px(g2, 12, 11, 2);
    px(g2, 1, 6, 1); px(g2, 1, 9, 1); px(g2, 1, 12, 1);
    px(g2, 13, 6, 1); px(g2, 13, 9, 1); px(g2, 13, 12, 1);
    px(g2, 0, 9, 1); px(g2, 14, 9, 1);  // very far arc tip
    px(g2, 3, 13, 1); px(g2, 7, 13, 1); px(g2, 11, 13, 1); // bottom loop
    return { frames: [g0, g1, g2], mfKey: 'magnet' };
  }

  // ── LEAF: 2 frames — sway left / sway right ──────────────────────────────
  function s_leaf() {
    // frame 0 — leaning left
    const g0 = blank();
    const path0 = [[5,3],[6,3],[7,3],[4,4],[5,4],[6,4],[7,4],[8,4],
                   [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
                   [3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
                   [3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],
                   [4,8],[5,8],[6,8],[7,8],[8,8],[5,9],[6,9],[7,9],[6,10]];
    path0.forEach(([x,y]) => px(g0, x, y, 2));
    line(g0, 4, 6, 8, 5, 3);
    px(g0, 6, 4, 3); px(g0, 7, 4, 4); px(g0, 4, 7, 1); px(g0, 5, 8, 1);
    // stem
    px(g0, 6, 11, 1); px(g0, 6, 12, 1);
    // frame 1 — leaning right (mirror)
    const g1 = blank();
    const path1 = [[7,3],[8,3],[9,3],[6,4],[7,4],[8,4],[9,4],[10,4],
                   [5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
                   [4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],
                   [5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],
                   [6,8],[7,8],[8,8],[9,8],[10,8],[7,9],[8,9],[9,9],[8,10]];
    path1.forEach(([x,y]) => px(g1, x, y, 2));
    line(g1, 10, 6, 6, 5, 3);
    px(g1, 7, 4, 3); px(g1, 8, 4, 4); px(g1, 10, 7, 1); px(g1, 9, 8, 1);
    px(g1, 8, 11, 1); px(g1, 8, 12, 1);
    return { frames: [g0, g1], mfKey: 'leaf' };
  }

  // ── ORB: 3 frames — inner glow shifts ────────────────────────────────────
  function s_orb() {
    function orb(g) {
      circle(g, 7, 7, 4.2, 2);
      ring(g, 7, 7, 4.5, 1);
    }
    // frame 0 — glow top-left
    const g0 = blank(); orb(g0);
    circle(g0, 6, 6, 2, 3); px(g0, 5, 5, 4); px(g0, 6, 5, 4);
    // frame 1 — glow center
    const g1 = blank(); orb(g1);
    circle(g1, 7, 7, 2.2, 3); px(g1, 6, 6, 4); px(g1, 7, 6, 4); px(g1, 6, 7, 4);
    // frame 2 — glow bottom-right
    const g2 = blank(); orb(g2);
    circle(g2, 8, 8, 2, 3); px(g2, 8, 8, 4); px(g2, 9, 9, 4);
    // keep some top highlight
    px(g2, 5, 5, 3); px(g2, 6, 5, 3);
    return { frames: [g0, g1, g2], mfKey: 'orb' };
  }

  // ── CLOUD: 2 frames — shape shifts slightly ──────────────────────────────
  function s_cloud() {
    // frame 0 — compact
    const g0 = blank();
    circle(g0, 5, 8, 2.5, 2); circle(g0, 9, 8, 2.5, 2);
    circle(g0, 7, 6, 3, 2); circle(g0, 8, 8, 2, 2);
    px(g0, 4, 7, 3); px(g0, 5, 7, 3); px(g0, 6, 5, 3); px(g0, 7, 5, 4);
    // frame 1 — puffier, slightly taller
    const g1 = blank();
    circle(g1, 4, 8, 2.8, 2); circle(g1, 9, 8, 2.8, 2);
    circle(g1, 7, 5, 3.2, 2); circle(g1, 8, 7, 2.2, 2);
    circle(g1, 6, 8, 2, 2);
    px(g1, 3, 7, 3); px(g1, 4, 6, 3); px(g1, 6, 4, 3); px(g1, 7, 4, 4);
    return { frames: [g0, g1], mfKey: 'cloud' };
  }

  // ── INGOT: 2 frames — sheen sweeps dramatically across the full top face ─
  function s_ingot() {
    function body(g) {
      rect(g, 4, 4, 8, 2, 3); // top face
      px(g, 3, 5, 2); px(g, 11, 4, 2);
      rect(g, 3, 6, 9, 5, 2); // body
      rect(g, 3, 11, 9, 1, 1); // bottom
      for (let y = 6; y <= 10; y++) px(g, 11, y, 1); // side shadow
      for (let y = 6; y <= 11; y++) px(g, 3, y, 1); // left outline
      px(g, 12, 5, 1);
    }
    // frame 0 — sheen floods the LEFT half of the top face + left body column
    const g0 = blank(); body(g0);
    rect(g0, 4, 4, 4, 1, 4); px(g0, 4, 5, 4); px(g0, 5, 5, 3); // top left bright band
    px(g0, 4, 6, 3); px(g0, 4, 7, 3); px(g0, 4, 8, 3); px(g0, 4, 9, 3); px(g0, 4, 10, 3);
    // frame 1 — sheen floods the RIGHT half: opposite diagonal stripe
    const g1 = blank(); body(g1);
    rect(g1, 8, 4, 4, 1, 4); px(g1, 10, 5, 4); px(g1, 9, 5, 3); // top right bright band
    px(g1, 10, 6, 3); px(g1, 10, 7, 3); px(g1, 10, 8, 3); px(g1, 10, 9, 3); // right body column
    px(g1, 9, 10, 3);
    return { frames: [g0, g1], mfKey: 'ingot' };
  }

  // ── COIN: 3 frames — full face → clearly edge-on → face (reversed) ───────
  function s_coin() {
    // frame 0 — full face, front side with detail
    const g0 = blank();
    circle(g0, 7, 7, 4, 2); ring(g0, 7, 7, 4.2, 1);
    px(g0, 5, 5, 4); px(g0, 6, 5, 3); px(g0, 5, 6, 3); // bright shine cluster top-left
    rect(g0, 6, 6, 3, 1, 1); rect(g0, 6, 8, 3, 1, 1); px(g0, 7, 7, 1); // center mark
    // frame 1 — clearly edge-on: just a 2-pixel wide vertical bar, no circle at all
    const g1 = blank();
    rect(g1, 7, 3, 2, 9, 2); // narrow 2-wide bar
    px(g1, 7, 3, 1); px(g1, 8, 3, 1); // top edge
    px(g1, 7, 11, 1); px(g1, 8, 11, 1); // bottom edge
    px(g1, 7, 5, 4); px(g1, 7, 6, 3); px(g1, 8, 7, 3); // glint on edge
    // frame 2 — full face, back side (highlight on right, different mark)
    const g2 = blank();
    circle(g2, 7, 7, 4, 2); ring(g2, 7, 7, 4.2, 1);
    px(g2, 9, 5, 4); px(g2, 8, 5, 3); px(g2, 9, 6, 3); // shine on right now
    rect(g2, 6, 6, 3, 1, 1); rect(g2, 6, 8, 3, 1, 1); px(g2, 7, 7, 1);
    return { frames: [g0, g1, g2], mfKey: 'coin' };
  }

  // ── SHIELD: 2 frames — glint sweeps dramatically across the full face ────
  function s_shield() {
    function body(g) {
      rect(g, 4, 3, 7, 7, 2);
      px(g, 5, 10, 2); px(g, 6, 10, 2); px(g, 7, 10, 2); px(g, 8, 10, 2); px(g, 9, 10, 2);
      px(g, 6, 11, 2); px(g, 7, 11, 2); px(g, 8, 11, 2); px(g, 7, 12, 2);
      rect(g, 4, 3, 7, 1, 1);
      for (let y = 3; y <= 10; y++) { px(g, 4, y, 1); px(g, 10, y, 1); }
      rect(g, 4, 10, 7, 1, 1);
      rect(g, 7, 5, 1, 4, 1); rect(g, 5, 7, 5, 1, 1); // cross
    }
    // frame 0 — glint floods upper-left half: big bright diagonal band
    const g0 = blank(); body(g0);
    rect(g0, 5, 4, 3, 1, 3); px(g0, 5, 4, 4); px(g0, 6, 4, 4); // top row bright
    rect(g0, 5, 5, 2, 1, 3); px(g0, 5, 5, 4);
    px(g0, 5, 6, 3); px(g0, 5, 7, 3); px(g0, 5, 8, 3); // left column lit
    px(g0, 6, 5, 3); px(g0, 6, 6, 3); // extending right
    // frame 1 — glint sweeps to lower-right: opposite corner fully lit
    const g1 = blank(); body(g1);
    rect(g1, 8, 8, 2, 1, 3); px(g1, 9, 8, 4); px(g1, 8, 8, 4); // bottom-right bright
    rect(g1, 8, 7, 2, 1, 3); px(g1, 9, 7, 4);
    px(g1, 9, 6, 3); px(g1, 9, 5, 3); px(g1, 9, 4, 3); // right column lit
    px(g1, 8, 8, 3); px(g1, 8, 9, 3); // extending down
    return { frames: [g0, g1], mfKey: 'shield' };
  }

  // ── PRISM: 3 frames — rainbow exit rays clearly in different positions ───
  function s_prism() {
    function body(g) {
      for (let i = 0; i < 8; i++) {
        rect(g, 7-i, 4+i, i*2+1, 1, i<2?4:i<4?3:i<6?2:1);
      }
      for (let i = 0; i < 8; i++) px(g, 7-i, 4+i, 1);
      for (let i = 0; i < 8; i++) px(g, 7+i, 4+i, 1);
      px(g, 7, 3, 4); px(g, 7, 4, 4);
    }
    // frame 0 — both rays pointing steeply downward from prism sides
    const g0 = blank(); body(g0);
    line(g0, 0, 11, 3, 11, 4); line(g0, 0, 12, 3, 12, 3); // left ray — steep near-horizontal
    line(g0, 11, 11, 13, 13, 4); line(g0, 12, 11, 13, 12, 3); // right ray — steep down-right
    // frame 1 — rays spread mid: left goes lower-left, right goes lower-right
    const g1 = blank(); body(g1);
    line(g1, 0, 9, 2, 12, 4); line(g1, 0, 10, 1, 12, 3); // left ray mid angle
    line(g1, 12, 10, 13, 8, 4); line(g1, 13, 10, 13, 9, 3); // right ray mid angle
    px(g1, 0, 8, 2); px(g1, 13, 7, 2); // extra color tip pixels
    // frame 2 — rays fully fanned: left exits far left, right exits far right
    const g2 = blank(); body(g2);
    line(g2, 0, 7, 1, 10, 4); line(g2, 0, 6, 1, 9, 3); px(g2, 0, 5, 2); // left ray very wide
    line(g2, 13, 7, 13, 5, 4); line(g2, 13, 8, 13, 6, 3); px(g2, 13, 4, 2); // right ray very wide
    px(g2, 0, 11, 2); px(g2, 1, 12, 1); // low extra color
    px(g2, 13, 11, 2); px(g2, 13, 12, 1);
    return { frames: [g0, g1, g2], mfKey: 'prism' };
  }

  // ── STAR: 3 frames — twinkle with extra ray tips ─────────────────────────
  function s_star() {
    function body(g) {
      rect(g, 7, 2, 1, 4, 2); rect(g, 7, 9, 1, 4, 2);
      rect(g, 2, 7, 4, 1, 2); rect(g, 9, 7, 4, 1, 2);
      circle(g, 7, 7, 2.5, 2);
      px(g, 6, 7, 2); px(g, 8, 7, 2); px(g, 7, 6, 2); px(g, 7, 8, 2);
      px(g, 5, 5, 2); px(g, 9, 5, 2); px(g, 5, 9, 2); px(g, 9, 9, 2);
    }
    // frame 0 — core bright, tips dim
    const g0 = blank(); body(g0);
    px(g0, 7, 7, 4); px(g0, 6, 6, 3);
    // frame 1 — tips brighten
    const g1 = blank(); body(g1);
    px(g1, 7, 7, 4); px(g1, 6, 6, 4);
    px(g1, 7, 2, 3); px(g1, 2, 7, 3); px(g1, 12, 7, 3); px(g1, 7, 12, 3);
    // frame 2 — outer tip sparkle pixels
    const g2 = blank(); body(g2);
    px(g2, 7, 7, 3);
    px(g2, 7, 1, 4); px(g2, 7, 13, 4);
    px(g2, 1, 7, 4); px(g2, 13, 7, 4);
    px(g2, 4, 4, 3); px(g2, 10, 4, 3); px(g2, 4, 10, 3); px(g2, 10, 10, 3);
    return { frames: [g0, g1, g2], mfKey: 'star' };
  }

  // ── GEAR: 3 frames — teeth rotate 1 notch each frame ────────────────────
  function s_gear() {
    function gearBase(g, toothOffset) {
      circle(g, 7, 7, 3.5, 2);
      circle(g, 7, 7, 1.2, 0);
      ring(g, 7, 7, 3.8, 1);
      // 8 teeth at cardinal + diagonal positions, shifted by offset
      const positions = [
        [7,2],[7,3],[7,11],[7,12],[2,7],[3,7],[11,7],[12,7],
        [3,3],[11,3],[3,11],[11,11]
      ];
      const shifted = positions.map(([x,y]) => {
        // rotate each tooth position around center by toothOffset * 15deg
        const angle = toothOffset * (Math.PI / 12);
        const dx = x - 7, dy = y - 7;
        const nx = Math.round(7 + dx * Math.cos(angle) - dy * Math.sin(angle));
        const ny = Math.round(7 + dx * Math.sin(angle) + dy * Math.cos(angle));
        return [nx, ny];
      });
      shifted.forEach(([x,y]) => px(g, x, y, 2));
    }
    const g0 = blank(); gearBase(g0, 0); px(g0, 5, 5, 3); px(g0, 6, 5, 4);
    const g1 = blank(); gearBase(g1, 1); px(g1, 5, 5, 3); px(g1, 6, 5, 4);
    const g2 = blank(); gearBase(g2, 2); px(g2, 5, 5, 3); px(g2, 6, 5, 4);
    return { frames: [g0, g1, g2], mfKey: 'gear' };
  }

  // ── SKULL: 2 frames — eyes pulse (blink effect) ──────────────────────────
  function s_skull() {
    function cranium(g) {
      circle(g, 7, 6, 3.5, 2); ring(g, 7, 6, 3.8, 1);
      rect(g, 5, 9, 5, 2, 2); rect(g, 6, 11, 3, 1, 1);
      px(g, 5, 7, 1); px(g, 6, 7, 1); px(g, 8, 7, 1); px(g, 9, 7, 1);
      px(g, 6, 10, 1); px(g, 8, 10, 1); // teeth
      px(g, 5, 4, 3); px(g, 6, 4, 3);
    }
    // frame 0 — eyes open (holes)
    const g0 = blank(); cranium(g0);
    px(g0, 5, 6, 0); px(g0, 6, 6, 0);
    px(g0, 8, 6, 0); px(g0, 9, 6, 0);
    // frame 1 — eyes half-closed / glowing
    const g1 = blank(); cranium(g1);
    px(g1, 5, 6, 1); px(g1, 6, 6, 3); // left eye glows
    px(g1, 8, 6, 1); px(g1, 9, 6, 3); // right eye glows
    return { frames: [g0, g1], mfKey: 'skull' };
  }

  // ── EYE: 3 frames — pupil tracks left / center / right ───────────────────
  function s_eye() {
    function outerEye(g) {
      for (let y = 5; y <= 9; y++) {
        const dy = Math.abs(y-7);
        const w = 6 - dy*2;
        rect(g, 7 - w/2, y, w, 1, 2);
      }
      px(g, 4, 7, 2); px(g, 10, 7, 2);
    }
    // frame 0 — pupil left
    const g0 = blank(); outerEye(g0);
    circle(g0, 6, 7, 2, 3); circle(g0, 6, 7, 1, 1); px(g0, 5, 6, 4);
    // frame 1 — pupil center
    const g1 = blank(); outerEye(g1);
    circle(g1, 7, 7, 2, 3); circle(g1, 7, 7, 1, 1); px(g1, 6, 6, 4);
    // frame 2 — pupil right
    const g2 = blank(); outerEye(g2);
    circle(g2, 8, 7, 2, 3); circle(g2, 8, 7, 1, 1); px(g2, 7, 6, 4);
    return { frames: [g0, g1, g2], mfKey: 'eye' };
  }

  // ── FLOWER: 3 frames — petals pulse in sequence ──────────────────────────
  function s_flower() {
    function center(g) {
      circle(g, 7, 7, 2, 4); ring(g, 7, 7, 2.5, 1);
      px(g, 7, 12, 1); px(g, 7, 13, 1); // stem
    }
    // frame 0 — all petals dim
    const g0 = blank(); center(g0);
    circle(g0, 4, 5, 1.8, 2); circle(g0, 10, 5, 1.8, 2);
    circle(g0, 7, 2, 1.8, 2); circle(g0, 4, 9, 1.8, 2);
    circle(g0, 10, 9, 1.8, 2); circle(g0, 7, 11, 1.8, 2);
    // frame 1 — top + right petals bright
    const g1 = blank(); center(g1);
    circle(g1, 4, 5, 1.8, 2); circle(g1, 10, 5, 2.2, 3); // right top bright
    circle(g1, 7, 2, 2.2, 3); // top bright
    circle(g1, 4, 9, 1.8, 2); circle(g1, 10, 9, 1.8, 2);
    circle(g1, 7, 11, 1.8, 2);
    // frame 2 — bottom + left bright
    const g2 = blank(); center(g2);
    circle(g2, 4, 5, 2.2, 3); // left top bright
    circle(g2, 10, 5, 1.8, 2);
    circle(g2, 7, 2, 1.8, 2);
    circle(g2, 4, 9, 2.2, 3); circle(g2, 10, 9, 1.8, 2);
    circle(g2, 7, 11, 2.2, 3); // bottom bright
    return { frames: [g0, g1, g2], mfKey: 'flower' };
  }

  // ── MUSHROOM: 2 frames — spots shift ────────────────────────────────────
  function s_mushroom() {
    function body(g) {
      circle(g, 7, 5, 4, 2); rect(g, 3, 5, 9, 2, 2);
      ring(g, 7, 5, 4.2, 1);
      rect(g, 6, 8, 3, 4, 3); rect(g, 5, 7, 5, 1, 1); rect(g, 5, 11, 5, 1, 1);
    }
    // frame 0
    const g0 = blank(); body(g0);
    px(g0, 5, 4, 4); px(g0, 9, 5, 4); px(g0, 6, 6, 4);
    // frame 1 — spots glow differently
    const g1 = blank(); body(g1);
    px(g1, 5, 4, 2); px(g1, 9, 5, 4); px(g1, 6, 6, 2);
    px(g1, 8, 4, 4); px(g1, 6, 3, 4); // new spots
    return { frames: [g0, g1], mfKey: 'mushroom' };
  }

  // ── SUN: 3 frames — rays rotate / lengthen ───────────────────────────────
  function s_sun() {
    function core(g) {
      circle(g, 7, 7, 2.5, 2); ring(g, 7, 7, 2.8, 1);
      px(g, 7, 7, 4); px(g, 6, 6, 3);
    }
    // frame 0 — long cardinal rays
    const g0 = blank(); core(g0);
    px(g0, 7, 2, 2); px(g0, 7, 3, 2); px(g0, 7, 11, 2); px(g0, 7, 12, 2);
    px(g0, 2, 7, 2); px(g0, 3, 7, 2); px(g0, 11, 7, 2); px(g0, 12, 7, 2);
    px(g0, 3, 3, 1); px(g0, 11, 3, 1); px(g0, 3, 11, 1); px(g0, 11, 11, 1); // short diag
    // frame 1 — long diagonal rays
    const g1 = blank(); core(g1);
    px(g1, 7, 3, 2); px(g1, 7, 11, 2); px(g1, 3, 7, 2); px(g1, 11, 7, 2); // short cardinal
    px(g1, 3, 3, 2); px(g1, 2, 2, 2); px(g1, 11, 3, 2); px(g1, 12, 2, 2); // long diag
    px(g1, 3, 11, 2); px(g1, 2, 12, 2); px(g1, 11, 11, 2); px(g1, 12, 12, 2);
    // frame 2 — all rays bright
    const g2 = blank(); core(g2);
    px(g2, 7, 1, 3); px(g2, 7, 2, 2); px(g2, 7, 12, 2); px(g2, 7, 13, 3);
    px(g2, 1, 7, 3); px(g2, 2, 7, 2); px(g2, 12, 7, 2); px(g2, 13, 7, 3);
    px(g2, 2, 2, 3); px(g2, 3, 3, 2); px(g2, 11, 3, 2); px(g2, 12, 2, 3);
    px(g2, 2, 12, 3); px(g2, 3, 11, 2); px(g2, 11, 11, 2); px(g2, 12, 12, 3);
    return { frames: [g0, g1, g2], mfKey: 'sun' };
  }

  // ── MOON: 3 frames — craters glow sequentially ───────────────────────────
  function s_moon() {
    function crescent(g) {
      circle(g, 7, 7, 4.2, 2);
      circle(g, 9, 6, 3.5, 0);
      px(g, 4, 7, 3); px(g, 5, 5, 4); // main shine
    }
    // frame 0 — crater A glows
    const g0 = blank(); crescent(g0);
    px(g0, 5, 6, 3); px(g0, 4, 9, 1); px(g0, 6, 9, 1);
    // frame 1 — crater B glows
    const g1 = blank(); crescent(g1);
    px(g1, 5, 6, 1); px(g1, 4, 9, 3); px(g1, 6, 9, 1);
    // frame 2 — crater C glows
    const g2 = blank(); crescent(g2);
    px(g2, 5, 6, 1); px(g2, 4, 9, 1); px(g2, 6, 9, 3);
    return { frames: [g0, g1, g2], mfKey: 'moon' };
  }

  // ── FISH: 2 frames — tail flap ───────────────────────────────────────────
  function s_fish() {
    function bodyFish(g) {
      rect(g, 4, 6, 6, 3, 2); rect(g, 5, 5, 4, 5, 2);
      px(g, 6, 6, 1); px(g, 6, 7, 4); // eye
      px(g, 7, 9, 1); px(g, 8, 9, 1); // fin
    }
    // frame 0 — tail up
    const g0 = blank(); bodyFish(g0);
    px(g0, 10, 5, 2); px(g0, 10, 6, 2); px(g0, 10, 7, 2);
    px(g0, 11, 4, 2); px(g0, 11, 5, 2); px(g0, 11, 8, 2); px(g0, 11, 9, 2);
    // frame 1 — tail down
    const g1 = blank(); bodyFish(g1);
    px(g1, 10, 7, 2); px(g1, 10, 8, 2); px(g1, 10, 9, 2);
    px(g1, 11, 5, 2); px(g1, 11, 6, 2); px(g1, 11, 9, 2); px(g1, 11, 10, 2);
    return { frames: [g0, g1], mfKey: 'fish' };
  }

  // ── BIRD: 2 frames — wings up / wings down ───────────────────────────────
  function s_bird() {
    function birdBody(g) {
      circle(g, 7, 7, 2.5, 2);
      px(g, 9, 6, 4); px(g, 10, 6, 4); // beak
      px(g, 8, 5, 2); px(g, 9, 5, 2); // head
      px(g, 8, 6, 1); // eye
      px(g, 4, 6, 2); px(g, 4, 7, 2); px(g, 3, 7, 2); // tail
      px(g, 6, 10, 1); px(g, 8, 10, 1); // feet
    }
    // frame 0 — wings up
    const g0 = blank(); birdBody(g0);
    px(g0, 5, 5, 1); px(g0, 4, 4, 1); px(g0, 3, 4, 1); // left wing up
    px(g0, 5, 6, 1);
    // frame 1 — wings down
    const g1 = blank(); birdBody(g1);
    px(g1, 5, 8, 1); px(g1, 4, 9, 1); px(g1, 3, 9, 1); // left wing down
    px(g1, 5, 7, 1);
    return { frames: [g0, g1], mfKey: 'bird' };
  }

  // ── POTION: 3 frames — bubble rises inside bottle ────────────────────────
  function s_potion() {
    function bottle(g) {
      rect(g, 6, 3, 3, 2, 1); // neck
      rect(g, 6, 2, 3, 1, 1); // cork
      circle(g, 7, 9, 3.5, 2); rect(g, 5, 6, 5, 2, 2); // body
      ring(g, 7, 9, 3.8, 1);
      px(g, 5, 8, 3); px(g, 5, 9, 3); px(g, 6, 11, 4); // shine
    }
    // frame 0 — bubble at bottom
    const g0 = blank(); bottle(g0);
    px(g0, 7, 10, 4); px(g0, 8, 11, 4);
    // frame 1 — bubble mid
    const g1 = blank(); bottle(g1);
    px(g1, 7, 8, 4); px(g1, 8, 9, 3);
    px(g1, 7, 11, 2); // new bubble forming
    // frame 2 — bubble at top of liquid
    const g2 = blank(); bottle(g2);
    px(g2, 7, 6, 4); px(g2, 8, 7, 3);
    px(g2, 7, 10, 4); // new bubble lower
    return { frames: [g0, g1, g2], mfKey: 'potion' };
  }

  // ── WAVE: 3 frames — wave rolls forward ──────────────────────────────────
  function s_wave() {
    // frame 0 — curl centered at x=5
    const g0 = blank();
    circle(g0, 5, 7, 3, 2); circle(g0, 5, 7, 1.5, 0);
    rect(g0, 4, 4, 7, 2, 2); rect(g0, 8, 6, 4, 2, 2);
    px(g0, 4, 3, 1); px(g0, 5, 3, 1); px(g0, 6, 3, 1);
    px(g0, 3, 5, 4); px(g0, 9, 6, 4); px(g0, 10, 8, 3);
    rect(g0, 2, 10, 10, 1, 1);
    // frame 1 — curl at x=6, more forward
    const g1 = blank();
    circle(g1, 6, 7, 3, 2); circle(g1, 6, 7, 1.5, 0);
    rect(g1, 4, 4, 7, 2, 2); rect(g1, 9, 6, 3, 2, 2);
    px(g1, 5, 3, 1); px(g1, 6, 3, 1); px(g1, 7, 3, 1);
    px(g1, 4, 5, 4); px(g1, 10, 6, 4); px(g1, 11, 8, 3);
    rect(g1, 2, 10, 10, 1, 1);
    // frame 2 — breaking foam
    const g2 = blank();
    circle(g2, 7, 8, 3, 2); circle(g2, 7, 8, 1.5, 0);
    rect(g2, 4, 5, 6, 2, 2); rect(g2, 9, 7, 3, 2, 2);
    px(g2, 5, 4, 1); px(g2, 7, 4, 1); px(g2, 9, 4, 1);
    px(g2, 4, 4, 4); px(g2, 6, 4, 4); px(g2, 8, 4, 4); // foam dots
    rect(g2, 2, 10, 10, 1, 1);
    return { frames: [g0, g1, g2], mfKey: 'wave' };
  }

  // ── CUBE: 2 frames — highlight rotates left face lit / right face lit ────
  function s_cube() {
    function cubeBase(g) {
      rect(g, 3, 4, 8, 1, 3); rect(g, 2, 5, 10, 1, 2);
      rect(g, 2, 6, 10, 6, 2);
      rect(g, 2, 5, 10, 1, 1);
      for (let y = 6; y < 12; y++) { px(g, 2, y, 1); px(g, 11, y, 1); }
      rect(g, 2, 11, 10, 1, 1); rect(g, 3, 10, 8, 1, 1);
    }
    // frame 0 — light hits left: left face column bright, top-left corner peak
    const g0 = blank(); cubeBase(g0);
    rect(g0, 3, 6, 3, 1, 3); px(g0, 3, 5, 3); // top-left face row lit
    px(g0, 3, 6, 4); px(g0, 4, 6, 4); // peak bright
    px(g0, 3, 7, 3); px(g0, 3, 8, 3); px(g0, 3, 9, 3); px(g0, 3, 10, 3); // left column
    // frame 1 — light shifts right: right face column bright, top-right corner peak
    const g1 = blank(); cubeBase(g1);
    rect(g1, 8, 6, 3, 1, 3); px(g1, 9, 5, 3); // top-right face row lit
    px(g1, 9, 6, 4); px(g1, 10, 6, 4); // peak bright
    px(g1, 10, 7, 3); px(g1, 10, 8, 3); px(g1, 10, 9, 3); px(g1, 10, 10, 3); // right column
    return { frames: [g0, g1], mfKey: 'cube' };
  }

  // ── SPIRAL: 2 frames — spiral expands then contracts ─────────────────────
  function s_spiral() {
    // frame 0 — tight spiral, inner coil smaller
    const g0 = blank();
    const tight = [[7,4],[8,4],[9,5],[10,6],[10,7],[10,8],[9,9],[8,10],[7,10],[6,10],[5,9],[5,8],[5,7]];
    tight.forEach(([x,y]) => px(g0, x, y, 2));
    [[6,5],[7,5],[8,6],[8,7],[7,8],[6,7]].forEach(([x,y]) => px(g0, x, y, 2));
    px(g0, 7, 6, 3); px(g0, 7, 7, 4); px(g0, 6, 6, 3);
    // frame 1 — expanded spiral: outer ring pushed out one pixel all around
    const g1 = blank();
    const wide = [[7,3],[8,3],[9,3],[10,4],[11,5],[11,6],[11,7],[11,8],[11,9],[10,10],[9,11],[8,11],[7,11],[6,11],[5,11],[4,10],[4,9],[4,8],[4,7]];
    wide.forEach(([x,y]) => px(g1, x, y, 2));
    // inner coil stays same but highlight shifts
    [[6,5],[7,5],[8,6],[8,7],[7,8],[6,7],[7,6]].forEach(([x,y]) => px(g1, x, y, 2));
    px(g1, 6, 5, 3); px(g1, 7, 7, 4); px(g1, 8, 8, 3); // glow shifted
    return { frames: [g0, g1], mfKey: 'spiral' };
  }

  // ── MOUNTAIN: 2 frames — snow sparkle pixel alternates peak corners ───────
  function s_mountain() {
    function mtnBase(g) {
      tri(g, 4, 4, 6, 'up', 1);
      tri(g, 2, 6, 5, 'up', 2); tri(g, 7, 5, 5, 'up', 2);
      rect(g, 2, 10, 10, 1, 1);
    }
    // frame 0 — snow sparkle on left peak, snow shadow right peak
    const g0 = blank(); mtnBase(g0);
    px(g0, 4, 6, 4); px(g0, 4, 7, 3); px(g0, 5, 7, 3); // left snow bright
    px(g0, 9, 5, 3); px(g0, 9, 6, 2); px(g0, 10, 6, 2); // right peak dim
    // frame 1 — snow sparkle shifts to right peak, left peak dims
    const g1 = blank(); mtnBase(g1);
    px(g1, 4, 6, 2); px(g1, 4, 7, 2); px(g1, 5, 7, 2); // left snow dim
    px(g1, 9, 5, 4); px(g1, 9, 6, 3); px(g1, 10, 6, 3); // right snow bright
    px(g1, 8, 6, 3);
    return { frames: [g0, g1], mfKey: 'mountain' };
  }

  // ── TREE: 2 frames — canopy sways left / right ────────────────────────────
  function s_tree() {
    // frame 0 — canopy shifted left, stem vertical
    const g0 = blank();
    circle(g0, 6, 5, 3.2, 2); px(g0, 3, 6, 2); px(g0, 9, 6, 2); // canopy left
    ring(g0, 6, 5, 3.5, 1);
    rect(g0, 6, 8, 3, 4, 1); // stem
    px(g0, 4, 4, 3); px(g0, 5, 4, 3); px(g0, 6, 3, 4); // highlight left of canopy
    // frame 1 — canopy shifted right
    const g1 = blank();
    circle(g1, 8, 5, 3.2, 2); px(g1, 5, 6, 2); px(g1, 11, 6, 2); // canopy right
    ring(g1, 8, 5, 3.5, 1);
    rect(g1, 6, 8, 3, 4, 1); // stem stays center
    px(g1, 8, 4, 3); px(g1, 9, 4, 3); px(g1, 8, 3, 4); // highlight right of canopy
    return { frames: [g0, g1], mfKey: 'tree' };
  }

  // ── BOLT: 2 frames — bolt flashes bright core / dark core ────────────────
  function s_bolt() {
    const boltPath = [[7,2],[7,3],[6,4],[7,4],[6,5],[7,5],[8,5],[7,6],[8,6],[7,7],[6,7],[7,8],[8,8],[7,9],[7,10],[6,11]];
    // frame 0 — bright: core pixels are peak brightness, wide glow
    const g0 = blank();
    boltPath.forEach(([x,y]) => px(g0, x, y, 3));
    [[8,3],[8,4],[8,7],[6,8],[6,9]].forEach(([x,y]) => px(g0, x, y, 2));
    // core hotspots — peak bright across a wide band
    [[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9]].forEach(([x,y]) => px(g0, x, y, 4));
    px(g0, 6,5, 4); px(g0, 8,6, 4); // extra peak pixels for wide glow
    // frame 1 — dark: bolt outline only, core nearly invisible
    const g1 = blank();
    boltPath.forEach(([x,y]) => px(g1, x, y, 1));
    [[8,3],[8,4],[8,7],[6,8],[6,9]].forEach(([x,y]) => px(g1, x, y, 1));
    // just a tiny glint at the kink to show the shape
    px(g1, 7, 6, 2); px(g1, 7, 7, 2);
    return { frames: [g0, g1], mfKey: 'bolt' };
  }

  // ── BRICK: 2 frames — mortar line crack appears / heals ──────────────────
  function s_brick() {
    function brickBase(g) {
      rect(g, 2, 4, 10, 3, 2); rect(g, 2, 7, 10, 3, 2);
      rect(g, 2, 6, 10, 1, 1); rect(g, 6, 4, 1, 3, 1);
      rect(g, 4, 7, 1, 3, 1); rect(g, 9, 7, 1, 3, 1);
      rect(g, 2, 3, 10, 1, 1); rect(g, 2, 10, 10, 1, 1);
    }
    // frame 0 — solid wall, normal mortar highlights
    const g0 = blank(); brickBase(g0);
    px(g0, 3, 5, 3); px(g0, 7, 5, 3); px(g0, 3, 8, 3);
    // frame 1 — crack runs through top-right brick, mortar darkens elsewhere
    const g1 = blank(); brickBase(g1);
    px(g1, 3, 5, 3); px(g1, 3, 8, 3); // normal highlights
    // crack: diagonal line through the right top brick
    px(g1, 8, 4, 1); px(g1, 9, 4, 0); px(g1, 9, 5, 1); px(g1, 10, 5, 0); px(g1, 10, 6, 1);
    px(g1, 8, 5, 4); // chipped pixel bright
    return { frames: [g0, g1], mfKey: 'brick' };
  }

  // ── FANG: 3 frames — fang drips (no drip / small drip / drip falls) ───────
  function s_fang() {
    function fangBase(g) {
      rect(g, 4, 3, 7, 1, 2); rect(g, 4, 4, 7, 1, 2);
      rect(g, 5, 5, 5, 1, 2); rect(g, 5, 6, 5, 1, 2);
      rect(g, 6, 7, 3, 1, 2); rect(g, 6, 8, 3, 1, 2);
      px(g, 7, 9, 2); px(g, 7, 10, 2);
      px(g, 10, 4, 1); px(g, 9, 6, 1); px(g, 8, 8, 1);
      px(g, 5, 4, 3); px(g, 6, 5, 3); px(g, 7, 7, 4);
    }
    // frame 0 — tip only, no drip
    const g0 = blank(); fangBase(g0);
    // frame 1 — small bead forms at tip
    const g1 = blank(); fangBase(g1);
    px(g1, 7, 11, 3); // small drip bead
    // frame 2 — drip elongates and falls
    const g2 = blank(); fangBase(g2);
    px(g2, 7, 11, 2); px(g2, 7, 12, 3); px(g2, 7, 13, 2); // elongated falling drip
    return { frames: [g0, g1, g2], mfKey: 'fang' };
  }

  // ── SWIRL: 3 frames — bright pixel rotates around the spiral center ───────
  function s_swirl() {
    function swirlBase(g) {
      rect(g, 5, 3, 4, 1, 1); rect(g, 4, 4, 6, 1, 2);
      rect(g, 3, 5, 7, 1, 2); rect(g, 5, 6, 5, 1, 2);
      rect(g, 3, 7, 4, 1, 2); rect(g, 4, 8, 7, 1, 2);
      rect(g, 5, 9, 5, 1, 2); rect(g, 6, 10, 4, 1, 1);
    }
    // frame 0 — bright pixel at top of inner spiral
    const g0 = blank(); swirlBase(g0);
    px(g0, 6, 4, 4); px(g0, 7, 4, 3); // top bright
    px(g0, 5, 5, 3); px(g0, 7, 8, 2); px(g0, 6, 7, 2);
    // frame 1 — bright pixel moved to right of spiral
    const g1 = blank(); swirlBase(g1);
    px(g1, 9, 6, 4); px(g1, 9, 7, 3); // right bright
    px(g1, 8, 5, 3); px(g1, 6, 4, 2); px(g1, 6, 8, 2);
    // frame 2 — bright pixel moved to bottom-left of spiral
    const g2 = blank(); swirlBase(g2);
    px(g2, 5, 9, 4); px(g2, 6, 9, 3); // bottom-left bright
    px(g2, 4, 8, 3); px(g2, 9, 6, 2); px(g2, 6, 4, 2);
    return { frames: [g0, g1, g2], mfKey: 'swirl' };
  }

  // ── SEED: 3 frames — seed sprouts (seed alone / tiny shoot / taller shoot) ─
  function s_seed() {
    // frame 0 — seed body only, no shoot
    const g0 = blank();
    circle(g0, 7, 8, 2.5, 2); ring(g0, 7, 8, 2.8, 1);
    px(g0, 5, 7, 3); px(g0, 6, 7, 4); // seed shine
    // frame 1 — seed + tiny 2px shoot emerging from top
    const g1 = blank();
    circle(g1, 7, 8, 2.5, 2); ring(g1, 7, 8, 2.8, 1);
    px(g1, 5, 7, 3); px(g1, 6, 7, 4);
    px(g1, 7, 5, 2); px(g1, 7, 6, 3); // tiny shoot
    // frame 2 — seed + taller shoot with small leaf nubs
    const g2 = blank();
    circle(g2, 7, 8, 2.5, 2); ring(g2, 7, 8, 2.8, 1);
    px(g2, 5, 7, 3);
    px(g2, 7, 3, 2); px(g2, 7, 4, 2); px(g2, 7, 5, 3); px(g2, 7, 6, 2); // taller shoot
    px(g2, 6, 4, 2); px(g2, 8, 5, 2); // leaf nubs left and right
    return { frames: [g0, g1, g2], mfKey: 'seed' };
  }

  // ── FRUIT: 2 frames — shine bobs left / right ─────────────────────────────
  function s_fruit() {
    function fruitBody(g) {
      circle(g, 7, 8, 3.5, 2); ring(g, 7, 8, 3.8, 1);
      px(g, 7, 3, 1); px(g, 7, 4, 1); // stem
      px(g, 8, 3, 3); px(g, 9, 3, 3); px(g, 8, 4, 3); // leaf
    }
    // frame 0 — shine cluster top-left of fruit
    const g0 = blank(); fruitBody(g0);
    px(g0, 5, 6, 4); px(g0, 5, 7, 3); px(g0, 6, 6, 3); // left shine
    // frame 1 — shine cluster shifts top-right
    const g1 = blank(); fruitBody(g1);
    px(g1, 9, 6, 4); px(g1, 9, 7, 3); px(g1, 8, 6, 3); // right shine
    return { frames: [g0, g1], mfKey: 'fruit' };
  }

  // ── HUMAN: 2 frames — arms slightly lower / slightly raised (breathing) ───
  function s_human() {
    function humanBase(g) {
      circle(g, 7, 4, 1.8, 2); ring(g, 7, 4, 2, 1); // head
      rect(g, 6, 6, 3, 4, 2); // torso
      rect(g, 6, 10, 1, 3, 1); rect(g, 8, 10, 1, 3, 1); // legs
      px(g, 6, 4, 1); px(g, 8, 4, 1); // eyes
    }
    // frame 0 — arms lower (hands at hip level)
    const g0 = blank(); humanBase(g0);
    px(g0, 5, 8, 2); px(g0, 4, 9, 2);   // left arm down
    px(g0, 9, 8, 2); px(g0, 10, 9, 2);  // right arm down
    // frame 1 — arms raised (hands at chest level)
    const g1 = blank(); humanBase(g1);
    px(g1, 5, 6, 2); px(g1, 4, 6, 2);   // left arm up
    px(g1, 9, 6, 2); px(g1, 10, 6, 2);  // right arm up
    return { frames: [g0, g1], mfKey: 'human' };
  }

  // ── BLOB: 3 frames — morphs squished / round / tall ──────────────────────
  function s_blob() {
    // frame 0 — squished: wide and flat
    const g0 = blank();
    circle(g0, 7, 8, 4, 2); circle(g0, 4, 8, 2.5, 2); circle(g0, 10, 8, 2.5, 2);
    circle(g0, 7, 8, 1.5, 0); // flatten center to look wide
    rect(g0, 3, 7, 8, 3, 2); // wide flat body
    px(g0, 4, 7, 1); px(g0, 9, 7, 1); px(g0, 5, 8, 4); px(g0, 8, 9, 3);
    // frame 1 — round: compact sphere
    const g1 = blank();
    circle(g1, 7, 7, 3.8, 2);
    ring(g1, 7, 7, 4, 1);
    px(g1, 5, 5, 3); px(g1, 6, 5, 4); // highlight top-left
    px(g1, 5, 6, 3); px(g1, 9, 9, 1); // shadow
    // frame 2 — tall: stretched vertical blob
    const g2 = blank();
    circle(g2, 7, 7, 2.5, 2); // narrow top
    circle(g2, 7, 10, 3, 2);  // wide bottom
    rect(g2, 5, 7, 5, 4, 2);  // vertical stretch
    ring(g2, 7, 10, 3.2, 1);
    px(g2, 6, 5, 3); px(g2, 7, 5, 2); // thin top
    px(g2, 5, 8, 4); px(g2, 8, 11, 3);
    return { frames: [g0, g1, g2], mfKey: 'blob' };
  }

  // ── COIL: 2 frames — tight coil / expanded coil ──────────────────────────
  function s_coil() {
    // frame 0 — tight coil (original compact path)
    const g0 = blank();
    const tightPts = [
      [4,4],[6,3],[8,3],[10,4],[11,6],[10,7],[8,7],[6,7],
      [4,8],[3,10],[4,11],[6,11],[8,11],[10,10],[11,11]
    ];
    for (let i = 0; i < tightPts.length - 1; i++) {
      line(g0, tightPts[i][0], tightPts[i][1], tightPts[i+1][0], tightPts[i+1][1], 2);
    }
    px(g0, 7, 3, 3); px(g0, 7, 7, 3); px(g0, 7, 11, 3);
    px(g0, 3, 9, 4); px(g0, 11, 5, 4);
    // frame 1 — expanded coil: outer ring pushed outward, gaps visible
    const g1 = blank();
    const widePts = [
      [3,3],[6,2],[8,2],[11,3],[12,6],[11,8],[8,8],[6,8],
      [3,9],[2,11],[3,12],[6,12],[8,12],[11,11],[12,12]
    ];
    for (let i = 0; i < widePts.length - 1; i++) {
      line(g1, widePts[i][0], widePts[i][1], widePts[i+1][0], widePts[i+1][1], 2);
    }
    px(g1, 7, 2, 3); px(g1, 7, 8, 3); px(g1, 7, 12, 3);
    px(g1, 2, 10, 4); px(g1, 12, 5, 4);
    return { frames: [g0, g1], mfKey: 'coil' };
  }

  // ---------- archetype registry ----------
  const ARCHETYPES = {
    drop:        { fn: s_drop,        anim: 'bob' },
    flame:       { fn: s_flame,       anim: 'flicker' },
    cube:        { fn: s_cube,        anim: 'shake-sub' },
    cloud:       { fn: s_cloud,       anim: 'drift' },
    crystal:     { fn: s_crystal,     anim: 'pulse' },
    leaf:        { fn: s_leaf,        anim: 'sway' },
    orb:         { fn: s_orb,         anim: 'breathe' },
    star:        { fn: s_star,        anim: 'spin' },
    bolt:        { fn: s_bolt,        anim: 'jitter' },
    eye:         { fn: s_eye,         anim: 'blink' },
    skull:       { fn: s_skull,       anim: 'creep' },
    spiral:      { fn: s_spiral,      anim: 'spin' },
    mountain:    { fn: s_mountain,    anim: 'still' },
    tree:        { fn: s_tree,        anim: 'sway' },
    fish:        { fn: s_fish,        anim: 'swim' },
    bird:        { fn: s_bird,        anim: 'flap' },
    flower:      { fn: s_flower,      anim: 'sway' },
    mushroom:    { fn: s_mushroom,    anim: 'breathe' },
    coin:        { fn: s_coin,        anim: 'flip' },
    potion:      { fn: s_potion,      anim: 'bubble' },
    sun:         { fn: s_sun,         anim: 'pulse' },
    moon:        { fn: s_moon,        anim: 'breathe' },
    brick:       { fn: s_brick,       anim: 'still' },
    fang:        { fn: s_fang,        anim: 'jitter' },
    swirl:       { fn: s_swirl,       anim: 'drift' },
    gear:        { fn: s_gear,        anim: 'spin' },
    seed:        { fn: s_seed,        anim: 'breathe' },
    fruit:       { fn: s_fruit,       anim: 'bob' },
    human:       { fn: s_human,       anim: 'breathe' },
    wave:        { fn: s_wave,        anim: 'bob' },
    blob:        { fn: s_blob,        anim: 'breathe' },
    // element-specific
    atom:        { fn: s_atom,        anim: 'spin' },
    bubble:      { fn: s_bubble,      anim: 'bob' },
    magnet:      { fn: s_magnet,      anim: 'pulse' },
    radioactive: { fn: s_radioactive, anim: 'spin' },
    liquid:      { fn: s_liquid,      anim: 'bob' },
    coil:        { fn: s_coil,        anim: 'jitter' },
    prism:       { fn: s_prism,       anim: 'pulse' },
    shield:      { fn: s_shield,      anim: 'shake-sub' },
    spark:       { fn: s_spark,       anim: 'jitter' },
    lantern:     { fn: s_lantern,     anim: 'breathe' },
    ingot:       { fn: s_ingot,       anim: 'shake-sub' },
    vial:        { fn: s_vial,        anim: 'bubble' }
  };

  // ---------- periodic table element → archetype mapping ----------
  const PERIODIC_ARCH = {
    hydrogen:       'bubble', helium:         'lantern',
    lithium:        'spark',  beryllium:      'ingot',
    boron:          'crystal',carbon:         'crystal',
    nitrogen:       'bubble', oxygen:         'bubble',
    fluorine:       'vial',   neon:           'lantern',
    sodium:         'spark',  magnesium:      'ingot',
    aluminum:       'ingot',  silicon:        'crystal',
    phosphorus:     'vial',   sulfur:         'crystal',
    chlorine:       'vial',   argon:          'lantern',
    potassium:      'spark',  calcium:        'ingot',
    scandium:       'ingot',  titanium:       'gear',
    vanadium:       'ingot',  chromium:       'ingot',
    manganese:      'ingot',  iron:           'ingot',
    cobalt:         'magnet', nickel:         'coin',
    copper:         'coin',   zinc:           'ingot',
    gallium:        'liquid', germanium:      'crystal',
    arsenic:        'skull',  selenium:       'crystal',
    bromine:        'vial',   krypton:        'lantern',
    rubidium:       'spark',  strontium:      'ingot',
    yttrium:        'ingot',  zirconium:      'ingot',
    niobium:        'ingot',  molybdenum:     'gear',
    technetium:     'radioactive', ruthenium: 'ingot',
    rhodium:        'coin',   palladium:      'coin',
    silver:         'coin',   cadmium:        'ingot',
    indium:         'liquid', tin:            'ingot',
    antimony:       'crystal',tellurium:      'crystal',
    iodine:         'vial',   xenon:          'lantern',
    caesium:        'spark',  barium:         'ingot',
    lanthanum:      'vial',   cerium:         'vial',
    praseodymium:   'vial',   neodymium:      'magnet',
    promethium:     'radioactive', samarium:  'magnet',
    europium:       'lantern',gadolinium:     'magnet',
    terbium:        'magnet', dysprosium:     'magnet',
    holmium:        'magnet', erbium:         'vial',
    thulium:        'vial',   ytterbium:      'vial',
    lutetium:       'vial',   hafnium:        'gear',
    tantalum:       'shield', tungsten:       'ingot',
    rhenium:        'ingot',  osmium:         'ingot',
    iridium:        'coin',   platinum:       'coin',
    gold:           'coin',   mercury:        'liquid',
    thallium:       'skull',  lead:           'shield',
    bismuth:        'prism',  polonium:       'radioactive',
    astatine:       'vial',   radon:          'lantern',
    francium:       'spark',  radium:         'radioactive',
    actinium:       'radioactive', thorium:   'radioactive',
    protactinium:   'radioactive', uranium:   'radioactive',
    neptunium:      'radioactive', plutonium: 'radioactive',
    americium:      'radioactive', curium:    'radioactive',
    berkelium:      'radioactive', californium:'radioactive',
    einsteinium:    'radioactive', fermium:   'radioactive',
    mendelevium:    'radioactive', nobelium:  'radioactive',
    lawrencium:     'radioactive',
    rutherfordium:  'atom', dubnium:       'atom',
    seaborgium:     'atom', bohrium:       'atom',
    hassium:        'atom', meitnerium:    'atom',
    darmstadtium:   'atom', roentgenium:   'atom',
    copernicium:    'atom', nihonium:      'atom',
    flerovium:      'atom', moscovium:     'atom',
    livermorium:    'atom', tennessine:    'atom',
    oganesson:      'atom',
  };

  // ---------- element → archetype mapping ----------
  const ELEMENT_ARCH = {
    water: 'drop', rain: 'drop', steam: 'cloud', sea: 'wave', ocean: 'wave',
    river: 'wave', lake: 'wave', waterfall: 'wave', geyser: 'wave', fog: 'cloud',
    fire: 'flame', lava: 'flame', sun: 'sun', energy: 'orb', lightning: 'bolt',
    earth: 'cube', stone: 'cube', mountain: 'mountain', sand: 'cube',
    dust: 'swirl', mud: 'blob', boulder: 'cube', pebble: 'cube', canyon: 'mountain',
    air: 'swirl', wind: 'swirl', cloud: 'cloud', sky: 'cloud', smoke: 'swirl',
    pressure: 'spiral', ash: 'swirl', storm: 'cloud',
    rainbow: 'star', snow: 'star', ice: 'crystal', salt: 'crystal',
    crystal: 'crystal', diamond: 'crystal', obsidian: 'crystal',
    plant: 'leaf', grass: 'leaf', moss: 'leaf', tree: 'tree', forest: 'tree',
    flower: 'flower', mushroom: 'mushroom', algae: 'leaf', seed: 'seed',
    fruit: 'fruit', vegetable: 'fruit', swamp: 'leaf', island: 'tree',
    metal: 'gear', iron: 'cube', gold: 'coin', silver: 'coin', copper: 'coin',
    rust: 'blob', coal: 'cube', clay: 'blob', pottery: 'potion',
    brick: 'brick', glass: 'crystal',
    life: 'eye', soul: 'orb', magic: 'star', spell: 'star', wisdom: 'eye',
    god: 'eye', angel: 'star', demon: 'fang', ghost: 'blob', skeleton: 'skull',
    zombie: 'human', vampire: 'fang', book: 'cube', scroll: 'cube', potion: 'potion',
    bacteria: 'blob', egg: 'seed',
    bird: 'bird', fish: 'fish', lizard: 'fish', snake: 'spiral',
    cat: 'eye', dog: 'eye', horse: 'human', cow: 'blob', sheep: 'cloud',
    wolf: 'eye', bear: 'blob', dolphin: 'fish', whale: 'fish', shark: 'fang',
    octopus: 'spiral', butterfly: 'flower', bee: 'orb', spider: 'star',
    dragon: 'fang', phoenix: 'flame', unicorn: 'human', kraken: 'spiral',
    human: 'human', farmer: 'human', sailor: 'human', knight: 'fang',
    wizard: 'human', blacksmith: 'human', baker: 'human',
    village: 'brick', city: 'brick', castle: 'brick', pyramid: 'mountain',
    temple: 'brick', bridge: 'brick', road: 'brick', farm: 'leaf',
    boat: 'blob', ship: 'blob', sword: 'fang', bow: 'crystal',
    time: 'spiral', space: 'star', galaxy: 'spiral', planet: 'orb',
    blackhole: 'spiral', nebula: 'spiral', comet: 'bolt', meteor: 'flame',
    asteroid: 'cube', void: 'orb', chaos: 'spiral', order: 'orb',
    light: 'sun', shadow: 'orb', love: 'flower', music: 'bolt', art: 'star',
    dream: 'cloud', nightmare: 'fang', idea: 'orb', story: 'cube',
    money: 'coin', coin: 'coin', machine: 'gear', robot: 'human',
    computer: 'cube', internet: 'star', moon: 'moon', star: 'star',
    volcano: 'mountain', desert: 'mountain',
    alchemia: 'eye'
  };

  const MODIFIERS = ['living','frozen','burning','ancient','enchanted','shadow','radiant','golden','crystal'];

  function archetypeFor(key) {
    for (const m of MODIFIERS) {
      if (key.startsWith(m + '-')) {
        const base = key.slice(m.length + 1);
        return { arch: archetypeFor(base).arch, modifier: m };
      }
    }
    if (PERIODIC_ARCH[key]) return { arch: PERIODIC_ARCH[key], modifier: null };
    return { arch: ELEMENT_ARCH[key] || 'orb', modifier: null };
  }

  // ---------- palette ----------
  function hexToRgb(hex) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) };
  }
  function rgbToHsl({r,g,b}) {
    r/=255; g/=255; b/=255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h=0, s=0, l = (max+min)/2;
    if (max !== min) {
      const d = max-min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch (max) {
        case r: h = (g-b)/d + (g<b?6:0); break;
        case g: h = (b-r)/d + 2; break;
        case b: h = (r-g)/d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
  function hslToHex({h,s,l}) {
    let r,g,b;
    if (s === 0) { r=g=b=l; }
    else {
      const hue2rgb = (p,q,t) => {
        if (t<0) t+=1; if (t>1) t-=1;
        if (t<1/6) return p+(q-p)*6*t;
        if (t<1/2) return q;
        if (t<2/3) return p+(q-p)*(2/3-t)*6;
        return p;
      };
      const q = l < 0.5 ? l*(1+s) : l+s-l*s;
      const p = 2*l-q;
      r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
    }
    const toHex = v => Math.round(v*255).toString(16).padStart(2,'0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
  function paletteFor(hex) {
    const hsl = rgbToHsl(hexToRgb(hex));
    const dark   = hslToHex({ h: hsl.h, s: Math.min(1, hsl.s*1.1), l: Math.max(0.10, hsl.l - 0.32) });
    const mid    = hex;
    const bright = hslToHex({ h: hsl.h, s: Math.max(0, hsl.s*0.85), l: Math.min(0.92, hsl.l + 0.18) });
    const peak   = hslToHex({ h: hsl.h, s: Math.max(0, hsl.s*0.5),  l: Math.min(0.97, hsl.l + 0.38) });
    return [null, dark, mid, bright, peak];
  }

  // ---------- modifier overlays ----------
  function overlayFor(modifier) {
    if (!modifier) return null;
    switch (modifier) {
      case 'frozen':    return { pixels: [[2,2,'#cdefff'],[3,3,'#cdefff'],[11,2,'#cdefff'],[10,3,'#cdefff'],[2,11,'#cdefff'],[11,11,'#cdefff']], anim: 'sparkle' };
      case 'burning':   return { pixels: [[3,2,'#ff6a1f'],[7,1,'#ff6a1f'],[7,2,'#ffc83d'],[11,2,'#ff6a1f'],[10,3,'#ffc83d']], anim: 'flicker' };
      case 'living':    return { pixels: [[2,2,'#ff7ab6'],[11,3,'#ff7ab6'],[3,11,'#ff7ab6']], anim: 'twinkle' };
      case 'ancient':   return { pixels: [[2,1,'#8a7e5f'],[11,1,'#8a7e5f'],[2,12,'#8a7e5f'],[11,12,'#8a7e5f']], anim: 'still' };
      case 'enchanted': return { pixels: [[3,1,'#d89be8'],[11,3,'#d89be8'],[1,9,'#d89be8'],[12,10,'#d89be8'],[6,1,'#ffffff'],[10,12,'#ffffff']], anim: 'twinkle' };
      case 'shadow':    return { pixels: [[1,1,'#3f2f4a'],[12,1,'#3f2f4a'],[1,12,'#3f2f4a'],[12,12,'#3f2f4a'],[0,7,'#3f2f4a'],[13,7,'#3f2f4a']], anim: 'pulse' };
      case 'radiant':   return { pixels: [[0,7,'#ffe8a8'],[13,7,'#ffe8a8'],[7,0,'#ffe8a8'],[7,13,'#ffe8a8'],[1,1,'#ffe8a8'],[12,1,'#ffe8a8'],[1,12,'#ffe8a8'],[12,12,'#ffe8a8']], anim: 'pulse' };
      case 'golden':    return { pixels: [[1,1,'#ffd83a'],[12,1,'#ffd83a'],[1,12,'#ffd83a'],[12,12,'#ffd83a']], anim: 'twinkle' };
      case 'crystal':   return { pixels: [[2,1,'#cdf6f6'],[11,2,'#cdf6f6'],[2,11,'#cdf6f6'],[11,11,'#cdf6f6']], anim: 'sparkle' };
    }
    return null;
  }

  // ---------- helper: grid → rect string ----------
  function gridToRects(grid, palette) {
    let rects = '';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const v = grid[y][x];
        if (!v) continue;
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[v]}" shape-rendering="crispEdges"/>`;
      }
    }
    return rects;
  }

  // ---------- render ----------
  const cache = new Map();

  function renderIcon(key, opts = {}) {
    const cacheKey = key + '|' + (opts.size || 64);
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const meta = DB.META[key] || { c: '#888' };
    const { arch, modifier } = archetypeFor(key);
    const archDef = ARCHETYPES[arch] || ARCHETYPES.orb;
    const palette = paletteFor(meta.c);
    const result = archDef.fn();
    const overlay = overlayFor(modifier);
    const overlayClass = overlay ? `pa-overlay pa-ov-${overlay.anim}` : '';

    let overlayRects = '';
    if (overlay) {
      for (const [x, y, c] of overlay.pixels) {
        overlayRects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}" shape-rendering="crispEdges"/>`;
      }
    }

    let svg;

    if (result && result.frames) {
      // ── multiframe icon ──────────────────────────────────────────────────
      const { frames, mfKey } = result;
      // multiframe icons use ONLY the frame-timing class — no global float on top
      const animClass = `pa-anim pa-mf-${mfKey}`;
      const frameGroups = frames.map((grid, i) => {
        const rects = gridToRects(grid, palette);
        return `<g class="pa-body pa-f${i}">${rects}</g>`;
      }).join('\n      ');

      svg = `<svg class="${animClass}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      ${frameGroups}
      ${overlay ? `<g class="${overlayClass}">${overlayRects}</g>` : ''}
    </svg>`;
    } else {
      // ── static single-frame icon ─────────────────────────────────────────
      const grid = result;
      const rects = gridToRects(grid, palette);
      const animClass = `pa-anim pa-${archDef.anim}`;

      svg = `<svg class="${animClass}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <g class="pa-body">${rects}</g>
      ${overlay ? `<g class="${overlayClass}">${overlayRects}</g>` : ''}
    </svg>`;
    }

    cache.set(cacheKey, svg);
    return svg;
  }

  window.ALCHEMIA_ICONS = {
    renderIcon,
    archetypeFor,
    paletteFor,
    ARCHETYPES,
    SIZE
  };
})();
