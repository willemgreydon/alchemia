// ALCHEMIA — procedural pixel-art icon renderer
// Each of 1,512 elements gets a unique pixel sprite + a subtle CSS animation.
// Strategy: ~26 hand-designed archetypes × per-element palette × modifier overlays.

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
    // dir: 'up','down','left','right'
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

  // ---------- archetype shape builders ----------
  // Each returns a 14x14 grid of palette indices (0 transparent, 1-4 dark→bright)

  function s_drop() {
    const g = blank();
    // teardrop body
    circle(g, 7, 9, 4, 2);
    ring(g, 7, 9, 4, 1);
    // tip
    px(g, 7, 3, 2); px(g, 7, 4, 2); px(g, 7, 5, 2);
    px(g, 6, 4, 2); px(g, 8, 4, 2);
    px(g, 6, 5, 2); px(g, 8, 5, 2);
    // outline tip
    px(g, 7, 2, 1);
    // highlight
    px(g, 5, 8, 3); px(g, 5, 7, 3); px(g, 6, 7, 3); px(g, 6, 8, 4);
    return g;
  }

  function s_flame() {
    const g = blank();
    // base
    rect(g, 5, 11, 4, 1, 1);
    rect(g, 4, 10, 6, 1, 2);
    // body
    circle(g, 7, 8, 3.2, 2);
    // shadow outline
    ring(g, 7, 8, 3.5, 1);
    // upper tongue
    px(g, 7, 2, 2); px(g, 7, 3, 2);
    px(g, 6, 4, 2); px(g, 7, 4, 2); px(g, 8, 4, 2);
    px(g, 6, 5, 2); px(g, 7, 5, 3); px(g, 8, 5, 2);
    // inner glow
    circle(g, 7, 9, 1.8, 3);
    px(g, 7, 9, 4); px(g, 6, 9, 4);
    // side tongue
    px(g, 4, 9, 2); px(g, 10, 9, 2);
    return g;
  }

  function s_cube() {
    const g = blank();
    // top face
    rect(g, 3, 4, 8, 1, 3);
    rect(g, 2, 5, 10, 1, 2);
    // body
    rect(g, 2, 6, 10, 6, 2);
    // outline
    rect(g, 2, 5, 10, 1, 1);
    for (let y = 6; y < 12; y++) { px(g, 2, y, 1); px(g, 11, y, 1); }
    rect(g, 2, 11, 10, 1, 1);
    // shadow
    rect(g, 3, 10, 8, 1, 1);
    // highlight
    rect(g, 3, 6, 6, 1, 3);
    px(g, 4, 7, 4);
    return g;
  }

  function s_cloud() {
    const g = blank();
    circle(g, 5, 8, 2.5, 2);
    circle(g, 9, 8, 2.5, 2);
    circle(g, 7, 6, 3, 2);
    circle(g, 8, 8, 2, 2);
    // outline
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (g[y][x] === 2) {
        const neighbors = [g[y-1]?.[x], g[y+1]?.[x], g[y]?.[x-1], g[y]?.[x+1]];
        if (neighbors.some(n => !n)) px(g, x, y, 2);
      }
    }
    // highlights
    px(g, 4, 7, 3); px(g, 5, 7, 3); px(g, 6, 5, 3); px(g, 7, 5, 4);
    return g;
  }

  function s_crystal() {
    const g = blank();
    // diamond shape
    px(g, 7, 2, 2);
    rect(g, 6, 3, 3, 1, 2);
    rect(g, 5, 4, 5, 1, 2);
    rect(g, 4, 5, 7, 1, 2);
    rect(g, 4, 6, 7, 2, 2);
    rect(g, 4, 8, 7, 1, 2);
    rect(g, 5, 9, 5, 1, 2);
    rect(g, 6, 10, 3, 1, 2);
    px(g, 7, 11, 2);
    // facet highlights
    px(g, 5, 5, 3); px(g, 6, 5, 3); px(g, 7, 4, 3);
    px(g, 5, 6, 4); px(g, 6, 6, 3);
    // shadow on right
    px(g, 9, 6, 1); px(g, 9, 7, 1); px(g, 9, 8, 1);
    return g;
  }

  function s_leaf() {
    const g = blank();
    // leaf body (tilted)
    const path = [[5,3],[6,3],[7,3],[4,4],[5,4],[6,4],[7,4],[8,4],
                  [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
                  [3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
                  [3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],
                  [4,8],[5,8],[6,8],[7,8],[8,8],
                  [5,9],[6,9],[7,9],
                  [6,10]];
    path.forEach(([x,y]) => px(g, x, y, 2));
    // vein
    line(g, 4, 6, 8, 5, 3);
    // tip highlight
    px(g, 6, 4, 3); px(g, 7, 4, 4);
    // shadow
    px(g, 4, 7, 1); px(g, 5, 8, 1);
    return g;
  }

  function s_orb() {
    const g = blank();
    circle(g, 7, 7, 4.2, 2);
    ring(g, 7, 7, 4.5, 1);
    circle(g, 6, 6, 2, 3);
    px(g, 5, 5, 4); px(g, 6, 5, 4);
    return g;
  }

  function s_star() {
    const g = blank();
    // 4-point star
    rect(g, 7, 2, 1, 4, 2);
    rect(g, 7, 9, 1, 4, 2);
    rect(g, 2, 7, 4, 1, 2);
    rect(g, 9, 7, 4, 1, 2);
    // center
    circle(g, 7, 7, 2.5, 2);
    // arms thicken
    px(g, 6, 7, 2); px(g, 8, 7, 2);
    px(g, 7, 6, 2); px(g, 7, 8, 2);
    // diagonals
    px(g, 5, 5, 2); px(g, 9, 5, 2); px(g, 5, 9, 2); px(g, 9, 9, 2);
    // shine
    px(g, 7, 7, 4); px(g, 6, 6, 3);
    return g;
  }

  function s_bolt() {
    const g = blank();
    // zigzag
    const path = [[7,2],[7,3],[6,4],[7,4],[6,5],[7,5],[8,5],
                  [7,6],[8,6],[7,7],[6,7],[7,8],[8,8],[7,9],[7,10],[6,11]];
    path.forEach(([x,y]) => px(g, x, y, 2));
    // outline (darker zigzag offsets)
    [[8,3],[8,4],[8,7],[6,8],[6,9]].forEach(([x,y]) => px(g, x, y, 1));
    // glow
    [[7,4],[7,7]].forEach(([x,y]) => px(g, x, y, 4));
    return g;
  }

  function s_eye() {
    const g = blank();
    // outer eye almond
    for (let y = 5; y <= 9; y++) {
      const dy = Math.abs(y - 7);
      const w = 6 - dy*2;
      rect(g, 7 - w/2, y, w, 1, 2);
    }
    // iris
    circle(g, 7, 7, 2, 3);
    // pupil
    circle(g, 7, 7, 1, 1);
    // outline
    [[4,7],[10,7]].forEach(([x,y]) => px(g, x, y, 2));
    // shine
    px(g, 6, 6, 4);
    return g;
  }

  function s_skull() {
    const g = blank();
    // cranium
    circle(g, 7, 6, 3.5, 2);
    // outline
    ring(g, 7, 6, 3.8, 1);
    // jaw
    rect(g, 5, 9, 5, 2, 2);
    rect(g, 6, 11, 3, 1, 1);
    // eyes (holes)
    px(g, 5, 6, 0); px(g, 6, 6, 0);
    px(g, 8, 6, 0); px(g, 9, 6, 0);
    px(g, 5, 7, 1); px(g, 6, 7, 1);
    px(g, 8, 7, 1); px(g, 9, 7, 1);
    // teeth
    px(g, 6, 10, 1); px(g, 8, 10, 1);
    // highlight
    px(g, 5, 4, 3); px(g, 6, 4, 3);
    return g;
  }

  function s_spiral() {
    const g = blank();
    // arms
    const path = [[7,4],[8,4],[9,5],[10,6],[10,7],[10,8],[9,9],[8,10],[7,10],[6,10],[5,9],[5,8],[5,7]];
    path.forEach(([x,y]) => px(g, x, y, 2));
    // inner
    [[6,5],[7,5],[8,6],[8,7],[7,8],[6,7]].forEach(([x,y]) => px(g, x, y, 2));
    // core
    px(g, 7, 6, 3); px(g, 7, 7, 4); px(g, 6, 6, 3);
    return g;
  }

  function s_mountain() {
    const g = blank();
    // back mountain
    tri(g, 4, 4, 6, 'up', 1);
    // front mountain
    tri(g, 2, 6, 5, 'up', 2);
    tri(g, 7, 5, 5, 'up', 2);
    // snow cap
    px(g, 4, 6, 3); px(g, 4, 7, 3); px(g, 5, 7, 3);
    px(g, 9, 5, 3); px(g, 9, 6, 3); px(g, 10, 6, 3);
    // base
    rect(g, 2, 10, 10, 1, 1);
    return g;
  }

  function s_tree() {
    const g = blank();
    // canopy
    circle(g, 7, 5, 3.2, 2);
    px(g, 4, 6, 2); px(g, 10, 6, 2);
    // outline
    ring(g, 7, 5, 3.5, 1);
    // trunk
    rect(g, 6, 8, 3, 4, 1);
    // highlight
    px(g, 5, 4, 3); px(g, 6, 4, 3);
    px(g, 7, 3, 4);
    return g;
  }

  function s_fish() {
    const g = blank();
    // body
    rect(g, 4, 6, 6, 3, 2);
    rect(g, 5, 5, 4, 5, 2);
    // tail
    px(g, 10, 5, 2); px(g, 10, 6, 2); px(g, 10, 7, 2); px(g, 10, 8, 2); px(g, 10, 9, 2);
    px(g, 11, 5, 2); px(g, 11, 9, 2);
    // eye
    px(g, 6, 6, 1); px(g, 6, 7, 4);
    // fin
    px(g, 7, 9, 1); px(g, 8, 9, 1);
    return g;
  }

  function s_bird() {
    const g = blank();
    // body
    circle(g, 7, 7, 2.5, 2);
    // wing
    rect(g, 5, 7, 3, 2, 1);
    // beak
    px(g, 9, 6, 4); px(g, 10, 6, 4);
    // head
    px(g, 8, 5, 2); px(g, 9, 5, 2);
    // eye
    px(g, 8, 6, 1);
    // tail
    px(g, 4, 6, 2); px(g, 4, 7, 2); px(g, 3, 7, 2);
    // feet
    px(g, 6, 10, 1); px(g, 8, 10, 1);
    return g;
  }

  function s_flower() {
    const g = blank();
    // petals
    circle(g, 4, 5, 1.8, 2);
    circle(g, 10, 5, 1.8, 2);
    circle(g, 7, 2, 1.8, 2);
    circle(g, 4, 9, 1.8, 2);
    circle(g, 10, 9, 1.8, 2);
    circle(g, 7, 11, 1.8, 2);
    // center
    circle(g, 7, 7, 2, 4);
    ring(g, 7, 7, 2.5, 1);
    // stem
    px(g, 7, 12, 1); px(g, 7, 13, 1);
    return g;
  }

  function s_mushroom() {
    const g = blank();
    // cap
    circle(g, 7, 5, 4, 2);
    rect(g, 3, 5, 9, 2, 2);
    // outline
    ring(g, 7, 5, 4.2, 1);
    // spots
    px(g, 5, 4, 4); px(g, 9, 5, 4); px(g, 6, 6, 4);
    // stem
    rect(g, 6, 8, 3, 4, 3);
    rect(g, 5, 7, 5, 1, 1);
    rect(g, 5, 11, 5, 1, 1);
    return g;
  }

  function s_coin() {
    const g = blank();
    circle(g, 7, 7, 4, 2);
    ring(g, 7, 7, 4.2, 1);
    // edge highlight
    px(g, 5, 5, 3); px(g, 6, 5, 3); px(g, 5, 6, 3);
    // dollar/mark
    rect(g, 6, 6, 3, 1, 1);
    rect(g, 6, 8, 3, 1, 1);
    px(g, 7, 7, 1);
    return g;
  }

  function s_potion() {
    const g = blank();
    // neck
    rect(g, 6, 3, 3, 2, 1);
    // cork
    rect(g, 6, 2, 3, 1, 1);
    // body
    circle(g, 7, 9, 3.5, 2);
    rect(g, 5, 6, 5, 2, 2);
    // outline
    ring(g, 7, 9, 3.8, 1);
    // shine
    px(g, 5, 8, 3); px(g, 5, 9, 3); px(g, 6, 11, 4);
    return g;
  }

  function s_sun() {
    const g = blank();
    circle(g, 7, 7, 2.5, 2);
    ring(g, 7, 7, 2.8, 1);
    // rays
    px(g, 7, 2, 2); px(g, 7, 3, 2);
    px(g, 7, 11, 2); px(g, 7, 12, 2);
    px(g, 2, 7, 2); px(g, 3, 7, 2);
    px(g, 11, 7, 2); px(g, 12, 7, 2);
    px(g, 3, 3, 2); px(g, 11, 3, 2);
    px(g, 3, 11, 2); px(g, 11, 11, 2);
    // core
    px(g, 7, 7, 4); px(g, 6, 6, 3);
    return g;
  }

  function s_moon() {
    const g = blank();
    circle(g, 7, 7, 4.2, 2);
    // bite out crescent
    circle(g, 9, 6, 3.5, 0);
    // outline
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (g[y][x] === 2) {
        const neighbors = [g[y-1]?.[x], g[y+1]?.[x], g[y]?.[x-1], g[y]?.[x+1]];
        if (neighbors.some(n => n === 0 || n === undefined)) {
          // outline preservation
        }
      }
    }
    // craters
    px(g, 5, 6, 1); px(g, 4, 9, 1); px(g, 6, 9, 1);
    // shine
    px(g, 4, 7, 3); px(g, 5, 5, 4);
    return g;
  }

  function s_brick() {
    const g = blank();
    // 2 rows of bricks
    rect(g, 2, 4, 10, 3, 2);
    rect(g, 2, 7, 10, 3, 2);
    // mortar lines
    rect(g, 2, 6, 10, 1, 1);
    rect(g, 6, 4, 1, 3, 1);
    rect(g, 4, 7, 1, 3, 1);
    rect(g, 9, 7, 1, 3, 1);
    // outline
    rect(g, 2, 3, 10, 1, 1);
    rect(g, 2, 10, 10, 1, 1);
    // highlights
    px(g, 3, 5, 3); px(g, 7, 5, 3); px(g, 3, 8, 3);
    return g;
  }

  function s_fang() {
    const g = blank();
    // sharp downward triangle
    rect(g, 4, 3, 7, 1, 2);
    rect(g, 4, 4, 7, 1, 2);
    rect(g, 5, 5, 5, 1, 2);
    rect(g, 5, 6, 5, 1, 2);
    rect(g, 6, 7, 3, 1, 2);
    rect(g, 6, 8, 3, 1, 2);
    px(g, 7, 9, 2); px(g, 7, 10, 2);
    // shadow
    px(g, 10, 4, 1); px(g, 9, 6, 1); px(g, 8, 8, 1);
    // highlight
    px(g, 5, 4, 3); px(g, 6, 5, 3); px(g, 7, 7, 4);
    return g;
  }

  function s_swirl() {
    const g = blank();
    // smoke wisps
    rect(g, 5, 3, 4, 1, 1);
    rect(g, 4, 4, 6, 1, 2);
    rect(g, 3, 5, 7, 1, 2);
    rect(g, 5, 6, 5, 1, 2);
    rect(g, 3, 7, 4, 1, 2);
    rect(g, 4, 8, 7, 1, 2);
    rect(g, 5, 9, 5, 1, 2);
    rect(g, 6, 10, 4, 1, 1);
    // highlights
    px(g, 5, 5, 3); px(g, 7, 8, 3); px(g, 6, 4, 4);
    return g;
  }

  function s_gear() {
    const g = blank();
    // body
    circle(g, 7, 7, 3.5, 2);
    // hole
    circle(g, 7, 7, 1.2, 0);
    // teeth
    px(g, 7, 2, 2); px(g, 7, 3, 2);
    px(g, 7, 11, 2); px(g, 7, 12, 2);
    px(g, 2, 7, 2); px(g, 3, 7, 2);
    px(g, 11, 7, 2); px(g, 12, 7, 2);
    px(g, 3, 3, 2); px(g, 11, 3, 2);
    px(g, 3, 11, 2); px(g, 11, 11, 2);
    // outline
    ring(g, 7, 7, 3.8, 1);
    // shine
    px(g, 5, 5, 3); px(g, 6, 5, 4);
    return g;
  }

  function s_seed() {
    const g = blank();
    circle(g, 7, 7, 2.5, 2);
    ring(g, 7, 7, 2.8, 1);
    px(g, 5, 5, 3); px(g, 6, 6, 4);
    // crack
    px(g, 7, 5, 1); px(g, 8, 7, 1); px(g, 7, 8, 1);
    return g;
  }

  function s_fruit() {
    const g = blank();
    circle(g, 7, 8, 3.5, 2);
    ring(g, 7, 8, 3.8, 1);
    // stem
    px(g, 7, 3, 1); px(g, 7, 4, 1);
    // leaf
    px(g, 8, 3, 3); px(g, 9, 3, 3); px(g, 8, 4, 3);
    // shine
    px(g, 5, 6, 4); px(g, 5, 7, 3);
    return g;
  }

  function s_human() {
    const g = blank();
    // head
    circle(g, 7, 4, 1.8, 2);
    ring(g, 7, 4, 2, 1);
    // body
    rect(g, 6, 6, 3, 4, 2);
    // arms
    px(g, 5, 7, 2); px(g, 4, 8, 2);
    px(g, 9, 7, 2); px(g, 10, 8, 2);
    // legs
    rect(g, 6, 10, 1, 3, 1);
    rect(g, 8, 10, 1, 3, 1);
    // eyes
    px(g, 6, 4, 1); px(g, 8, 4, 1);
    return g;
  }

  function s_wave() {
    const g = blank();
    // wave curl
    circle(g, 5, 7, 3, 2);
    circle(g, 5, 7, 1.5, 0);
    // top
    rect(g, 4, 4, 7, 2, 2);
    rect(g, 8, 6, 4, 2, 2);
    // outline
    px(g, 4, 3, 1); px(g, 5, 3, 1); px(g, 6, 3, 1);
    // foam
    px(g, 3, 5, 4); px(g, 9, 6, 4); px(g, 10, 8, 3);
    // base
    rect(g, 2, 10, 10, 1, 1);
    return g;
  }

  function s_blob() {
    const g = blank();
    // amorphous shape
    circle(g, 6, 7, 3, 2);
    circle(g, 9, 6, 2, 2);
    circle(g, 8, 9, 2.5, 2);
    // outline
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (g[y][x] === 2) {
        const N = [g[y-1]?.[x], g[y+1]?.[x], g[y]?.[x-1], g[y]?.[x+1]];
        if (N.some(n => n === 0 || n === undefined)) {
          // mark as outline-y on neighbors
        }
      }
    }
    // eyes
    px(g, 5, 6, 1); px(g, 8, 6, 1);
    // highlight
    px(g, 4, 7, 3); px(g, 7, 9, 4);
    return g;
  }

  // ---------- NEW element-specific archetypes ----------

  // Atom: nucleus center with electron orbit rings
  function s_atom() {
    const g = blank();
    // nucleus core
    circle(g, 7, 7, 1.8, 4);
    ring(g, 7, 7, 2.2, 2);
    // horizontal orbit ellipse
    for (let x = 2; x <= 12; x++) {
      const dy = Math.round(0.5 * Math.sin((x - 2) / 10 * Math.PI));
      px(g, x, 7 + dy, 2);
    }
    // tilted orbit 1
    line(g, 3, 4, 11, 10, 2);
    line(g, 11, 4, 3, 10, 2);
    // electron dots on orbits
    px(g, 2, 7, 3); px(g, 12, 7, 3);
    px(g, 7, 2, 3); px(g, 7, 12, 3);
    px(g, 3, 4, 3); px(g, 11, 10, 3);
    return g;
  }

  // Bubble / gas: cluster of floating circles
  function s_bubble() {
    const g = blank();
    circle(g, 7, 8, 3.2, 2);
    ring(g, 7, 8, 3.5, 1);
    circle(g, 4, 5, 1.8, 2);
    ring(g, 4, 5, 2, 1);
    circle(g, 10, 5, 1.5, 2);
    ring(g, 10, 5, 1.8, 1);
    // shine
    px(g, 5, 7, 3); px(g, 6, 7, 4);
    px(g, 3, 4, 3); px(g, 9, 5, 3);
    return g;
  }

  // Magnet: horseshoe shape
  function s_magnet() {
    const g = blank();
    // horseshoe body
    rect(g, 4, 4, 3, 6, 2);
    rect(g, 8, 4, 3, 6, 2);
    // top arc
    circle(g, 7, 5, 3, 2);
    circle(g, 7, 5, 1.5, 0);
    // pole tips — two colors
    rect(g, 4, 9, 3, 2, 4);   // N pole bright
    rect(g, 8, 9, 3, 2, 1);   // S pole dark
    // outline
    rect(g, 4, 4, 3, 1, 1);
    rect(g, 8, 4, 3, 1, 1);
    // field arc hints
    px(g, 2, 8, 1); px(g, 2, 9, 1);
    px(g, 12, 8, 1); px(g, 12, 9, 1);
    return g;
  }

  // Radioactive / nuclear: trefoil radiation symbol
  function s_radioactive() {
    const g = blank();
    // center circle
    circle(g, 7, 7, 1.5, 4);
    // three blades at 0°, 120°, 240°
    const angles = [0, 2.094, 4.189]; // 0, 120, 240 deg in radians
    for (const a of angles) {
      for (let r = 2.5; r <= 4.5; r += 0.5) {
        const cx = 7 + r * Math.cos(a);
        const cy = 7 + r * Math.sin(a);
        for (let da = -0.45; da <= 0.45; da += 0.3) {
          const bx = 7 + r * Math.cos(a + da);
          const by = 7 + r * Math.sin(a + da);
          px(g, Math.round(bx), Math.round(by), 2);
        }
      }
    }
    // highlight blade tips
    for (const a of angles) {
      const bx = 7 + 4.5 * Math.cos(a);
      const by = 7 + 4.5 * Math.sin(a);
      px(g, Math.round(bx), Math.round(by), 3);
    }
    return g;
  }

  // Liquid metal: blobby drip with metallic sheen
  function s_liquid() {
    const g = blank();
    // main body
    circle(g, 7, 8, 3.5, 2);
    ring(g, 7, 8, 3.8, 1);
    // drip tip
    px(g, 7, 3, 2); px(g, 7, 4, 2); px(g, 6, 4, 2); px(g, 8, 4, 2);
    px(g, 7, 5, 2); px(g, 6, 5, 2); px(g, 8, 5, 2);
    // metallic multi-highlight
    px(g, 5, 7, 4); px(g, 5, 8, 3); px(g, 6, 7, 4);
    px(g, 8, 10, 3); px(g, 9, 10, 3);
    // reflection stripe
    rect(g, 5, 9, 3, 1, 3);
    return g;
  }

  // Wire / coil: spring-like helix symbol
  function s_coil() {
    const g = blank();
    // coil loops — series of arcs
    const points = [
      [4,4],[6,3],[8,3],[10,4],[11,6],[10,7],[8,7],[6,7],
      [4,8],[3,10],[4,11],[6,11],[8,11],[10,10],[11,11]
    ];
    for (let i = 0; i < points.length - 1; i++) {
      line(g, points[i][0], points[i][1], points[i+1][0], points[i+1][1], 2);
    }
    // highlights at peaks
    px(g, 7, 3, 3); px(g, 7, 7, 3); px(g, 7, 11, 3);
    px(g, 3, 9, 4); px(g, 11, 5, 4);
    return g;
  }

  // Prism / rainbow crystal: triangle with color bands
  function s_prism() {
    const g = blank();
    // triangle body
    for (let i = 0; i < 8; i++) {
      rect(g, 7 - i, 4 + i, i * 2 + 1, 1, i < 2 ? 4 : i < 4 ? 3 : i < 6 ? 2 : 1);
    }
    // left edge outline
    for (let i = 0; i < 8; i++) px(g, 7 - i, 4 + i, 1);
    for (let i = 0; i < 8; i++) px(g, 7 + i, 4 + i, 1);
    // top vertex shine
    px(g, 7, 3, 4); px(g, 7, 4, 4);
    // scattered exit rays
    px(g, 2, 10, 3); px(g, 1, 11, 2);
    px(g, 12, 11, 3); px(g, 13, 12, 2);
    return g;
  }

  // Shield / heavy: thick defensive plate for heavy metals
  function s_shield() {
    const g = blank();
    // shield body
    rect(g, 4, 3, 7, 7, 2);
    // pointed bottom
    px(g, 5, 10, 2); px(g, 6, 10, 2); px(g, 7, 10, 2); px(g, 8, 10, 2); px(g, 9, 10, 2);
    px(g, 6, 11, 2); px(g, 7, 11, 2); px(g, 8, 11, 2);
    px(g, 7, 12, 2);
    // outline
    rect(g, 4, 3, 7, 1, 1);
    for (let y = 3; y <= 10; y++) { px(g, 4, y, 1); px(g, 10, y, 1); }
    rect(g, 4, 10, 7, 1, 1);
    // cross emblem
    rect(g, 7, 5, 1, 4, 1);
    rect(g, 5, 7, 5, 1, 1);
    // highlight
    px(g, 5, 4, 3); px(g, 6, 4, 3); px(g, 5, 5, 3);
    return g;
  }

  // Spark / plasma: irregular electric discharge
  function s_spark() {
    const g = blank();
    // main fork
    line(g, 7, 1, 5, 5, 2);
    line(g, 5, 5, 8, 7, 2);
    line(g, 8, 7, 4, 11, 2);
    // branch
    line(g, 5, 5, 3, 8, 2);
    line(g, 8, 7, 11, 6, 2);
    line(g, 11, 6, 10, 10, 2);
    // glow pixels
    px(g, 7, 1, 4); px(g, 7, 2, 4);
    px(g, 8, 6, 4); px(g, 7, 7, 4);
    px(g, 5, 11, 3); px(g, 4, 12, 3);
    // edge halos
    px(g, 3, 8, 1); px(g, 12, 6, 1);
    return g;
  }

  // Lantern / glow: luminous gas tube for noble gases
  function s_lantern() {
    const g = blank();
    // tube body
    rect(g, 5, 4, 5, 7, 2);
    // tube caps
    rect(g, 5, 3, 5, 1, 1);
    rect(g, 5, 11, 5, 1, 1);
    // end wires
    px(g, 6, 2, 1); px(g, 8, 2, 1);
    px(g, 6, 12, 1); px(g, 8, 12, 1);
    // inner glow column
    rect(g, 6, 4, 3, 7, 3);
    rect(g, 7, 4, 1, 7, 4);
    // outer corona glow
    px(g, 4, 5, 1); px(g, 4, 6, 1); px(g, 4, 7, 1); px(g, 4, 8, 1); px(g, 4, 9, 1);
    px(g, 10, 5, 1); px(g, 10, 6, 1); px(g, 10, 7, 1); px(g, 10, 8, 1); px(g, 10, 9, 1);
    return g;
  }

  // Ingot: metal bar for solid metals
  function s_ingot() {
    const g = blank();
    // top face (parallelogram)
    rect(g, 4, 4, 8, 2, 3);
    px(g, 3, 5, 2); px(g, 11, 4, 2);
    // body
    rect(g, 3, 6, 9, 5, 2);
    // bottom
    rect(g, 3, 11, 9, 1, 1);
    // side shading
    for (let y = 6; y <= 10; y++) { px(g, 11, y, 1); }
    // top highlight
    rect(g, 5, 4, 5, 1, 4);
    px(g, 5, 5, 3);
    // outline left/bottom
    for (let y = 6; y <= 11; y++) px(g, 3, y, 1);
    px(g, 12, 5, 1);
    return g;
  }

  // Vial / test tube: chemistry lab vessel for lanthanides/actinides
  function s_vial() {
    const g = blank();
    // tube walls
    rect(g, 5, 2, 1, 9, 1);
    rect(g, 9, 2, 1, 9, 1);
    // tube interior
    rect(g, 6, 2, 4, 9, 2);
    // rounded bottom
    circle(g, 7, 11, 2, 2);
    rect(g, 6, 11, 4, 1, 1);
    px(g, 5, 11, 1); px(g, 9, 11, 1);
    // stopper / cap
    rect(g, 5, 1, 5, 1, 1);
    rect(g, 6, 0, 3, 1, 1);
    // liquid level
    rect(g, 6, 7, 4, 4, 3);
    px(g, 7, 7, 4); px(g, 8, 7, 4);
    // bubble in liquid
    px(g, 7, 9, 4); px(g, 8, 10, 4);
    // shine on glass
    px(g, 6, 3, 4); px(g, 6, 4, 3);
    return g;
  }

  // ---------- archetype registry + animation classes ----------
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
  // Keyed by element name (lowercase). Chemistry-informed choices:
  //   gas elements        → bubble / swirl / lantern (noble gases glow)
  //   alkali metals       → spark (reactive, explode in water)
  //   alkaline earth      → ingot (solid silvery metals)
  //   transition metals   → ingot / gear / coin / magnet
  //   post-transition     → liquid (low melting point) / ingot / shield
  //   metalloids          → crystal / prism
  //   nonmetals           → bubble / cloud / leaf / crystal
  //   halogens            → vial (corrosive, stored in glass)
  //   noble gases         → lantern (glow-discharge tubes)
  //   lanthanides         → vial / magnet (rare earth magnets)
  //   actinides           → radioactive
  const PERIODIC_ARCH = {
    // Period 1
    hydrogen:       'bubble',
    helium:         'lantern',
    // Period 2
    lithium:        'spark',
    beryllium:      'ingot',
    boron:          'crystal',
    carbon:         'crystal',
    nitrogen:       'bubble',
    oxygen:         'bubble',
    fluorine:       'vial',
    neon:           'lantern',
    // Period 3
    sodium:         'spark',
    magnesium:      'ingot',
    aluminum:       'ingot',
    silicon:        'crystal',
    phosphorus:     'vial',
    sulfur:         'crystal',
    chlorine:       'vial',
    argon:          'lantern',
    // Period 4
    potassium:      'spark',
    calcium:        'ingot',
    scandium:       'ingot',
    titanium:       'gear',
    vanadium:       'ingot',
    chromium:       'ingot',
    manganese:      'ingot',
    iron:           'ingot',
    cobalt:         'magnet',
    nickel:         'coin',
    copper:         'coin',
    zinc:           'ingot',
    gallium:        'liquid',
    germanium:      'crystal',
    arsenic:        'skull',
    selenium:       'crystal',
    bromine:        'vial',
    krypton:        'lantern',
    // Period 5
    rubidium:       'spark',
    strontium:      'ingot',
    yttrium:        'ingot',
    zirconium:      'ingot',
    niobium:        'ingot',
    molybdenum:     'gear',
    technetium:     'radioactive',
    ruthenium:      'ingot',
    rhodium:        'coin',
    palladium:      'coin',
    silver:         'coin',
    cadmium:        'ingot',
    indium:         'liquid',
    tin:            'ingot',
    antimony:       'crystal',
    tellurium:      'crystal',
    iodine:         'vial',
    xenon:          'lantern',
    // Period 6
    caesium:        'spark',
    barium:         'ingot',
    lanthanum:      'vial',
    cerium:         'vial',
    praseodymium:   'vial',
    neodymium:      'magnet',
    promethium:     'radioactive',
    samarium:       'magnet',
    europium:       'lantern',
    gadolinium:     'magnet',
    terbium:        'magnet',
    dysprosium:     'magnet',
    holmium:        'magnet',
    erbium:         'vial',
    thulium:        'vial',
    ytterbium:      'vial',
    lutetium:       'vial',
    hafnium:        'gear',
    tantalum:       'shield',
    tungsten:       'ingot',
    rhenium:        'ingot',
    osmium:         'ingot',
    iridium:        'coin',
    platinum:       'coin',
    gold:           'coin',
    mercury:        'liquid',
    thallium:       'skull',
    lead:           'shield',
    bismuth:        'prism',
    polonium:       'radioactive',
    astatine:       'vial',
    radon:          'lantern',
    // Period 7
    francium:       'spark',
    radium:         'radioactive',
    actinium:       'radioactive',
    thorium:        'radioactive',
    protactinium:   'radioactive',
    uranium:        'radioactive',
    neptunium:      'radioactive',
    plutonium:      'radioactive',
    americium:      'radioactive',
    curium:         'radioactive',
    berkelium:      'radioactive',
    californium:    'radioactive',
    einsteinium:    'radioactive',
    fermium:        'radioactive',
    mendelevium:    'radioactive',
    nobelium:       'radioactive',
    lawrencium:     'radioactive',
    rutherfordium:  'atom',
    dubnium:        'atom',
    seaborgium:     'atom',
    bohrium:        'atom',
    hassium:        'atom',
    meitnerium:     'atom',
    darmstadtium:   'atom',
    roentgenium:    'atom',
    copernicium:    'atom',
    nihonium:       'atom',
    flerovium:      'atom',
    moscovium:      'atom',
    livermorium:    'atom',
    tennessine:     'atom',
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
    // check modifier prefix
    for (const m of MODIFIERS) {
      if (key.startsWith(m + '-')) {
        const base = key.slice(m.length + 1);
        return { arch: archetypeFor(base).arch, modifier: m };
      }
    }
    // periodic table elements by lowercase name take priority
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
  // Each modifier overlays small pixel decorations using its own palette.
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

  // ---------- render ----------
  // Returns an SVG string. Each non-zero pixel becomes a <rect>.
  // Outer element gets a class for the animation.
  const cache = new Map();

  function renderIcon(key, opts = {}) {
    const cacheKey = key + '|' + (opts.size || 64);
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const meta = DB.META[key] || { c: '#888' };
    const { arch, modifier } = archetypeFor(key);
    const archDef = ARCHETYPES[arch] || ARCHETYPES.orb;
    const palette = paletteFor(meta.c);
    const grid = archDef.fn();
    const overlay = overlayFor(modifier);

    // build rects
    let rects = '';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const v = grid[y][x];
        if (!v) continue;
        const color = palette[v];
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" shape-rendering="crispEdges"/>`;
      }
    }
    // overlay
    let overlayRects = '';
    if (overlay) {
      for (const [x, y, c] of overlay.pixels) {
        overlayRects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}" shape-rendering="crispEdges"/>`;
      }
    }

    const animClass = `pa-anim pa-${archDef.anim}`;
    const overlayClass = overlay ? `pa-overlay pa-ov-${overlay.anim}` : '';

    // wrapper carries the animation; inner svg holds rects
    const svg = `<svg class="${animClass}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <g class="pa-body">${rects}</g>
      ${overlay ? `<g class="${overlayClass}">${overlayRects}</g>` : ''}
    </svg>`;

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
