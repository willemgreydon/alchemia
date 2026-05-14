// ALCHEMIA — main app
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const DB = window.ALCHEMIA_DB;
const FX = window.ALCHEMIA_FX;
const ICONS = window.ALCHEMIA_ICONS;

// shared pixel-icon component
function PixelIcon({ elKey, className = '' }) {
  const html = ICONS.renderIcon(elKey);
  return <div className={`alc-pixel ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

// pixel arrowheads for the library scroll strip
function PixelArrowUp() {
  return (
    <svg width="14" height="10" viewBox="0 0 7 5" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      <rect x="3" y="0" width="1" height="1"/>
      <rect x="2" y="1" width="3" height="1"/>
      <rect x="1" y="2" width="5" height="1"/>
      <rect x="0" y="3" width="7" height="1"/>
    </svg>
  );
}
function PixelArrowDown() {
  return (
    <svg width="14" height="10" viewBox="0 0 7 5" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      <rect x="0" y="0" width="7" height="1"/>
      <rect x="1" y="1" width="5" height="1"/>
      <rect x="2" y="2" width="3" height="1"/>
      <rect x="3" y="3" width="1" height="1"/>
    </svg>
  );
}

// ============ small utilities ============
function uid() { return Math.random().toString(36).slice(2, 9); }

function useAmbient(canvasRef, particleRef) {
  const fxRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !particleRef.current) return;
    const ambient = FX.initAmbient(canvasRef.current);
    const particles = FX.initParticles(particleRef.current);
    fxRef.current = { ambient, particles };
  }, []);
  return fxRef;
}

// ============ audio (synthesized) ============
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function blip(freq, dur = 0.15, type = 'sine', gain = 0.15) {
  try {
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch (e) {}
}
function chord(freqs, dur = 0.4) {
  freqs.forEach((f, i) => setTimeout(() => blip(f, dur, 'triangle', 0.1), i * 40));
}
function failSound() {
  blip(180, 0.18, 'sawtooth', 0.06);
  setTimeout(() => blip(140, 0.18, 'sawtooth', 0.06), 80);
}
function successSound() {
  chord([523.25, 659.25, 783.99], 0.3);
}
function discoverySound() {
  chord([523.25, 659.25, 783.99, 1046.50], 0.5);
}

// ============ root app ============
function App() {
  const ambientRef = useRef(null);
  const particleRef = useRef(null);
  const playRef = useRef(null);
  const fx = useAmbient(ambientRef, particleRef);

  // discovered (persisted)
  const [discovered, setDiscovered] = useState(() => {
    // on load, keep only periodic-table elements — everything else must be re-discovered
    const periodicSet = new Set(DB.PERIODIC_TABLE_KEYS);
    try {
      const stored = JSON.parse(localStorage.getItem('alchemia.discovered') || '[]');
      if (Array.isArray(stored) && stored.length) {
        const filtered = stored.filter(k => periodicSet.has(k));
        return new Set([...filtered, ...DB.STARTERS]);
      }
    } catch (e) {}
    return new Set(DB.STARTERS);
  });
  useEffect(() => {
    localStorage.setItem('alchemia.discovered', JSON.stringify([...discovered]));
  }, [discovered]);

  // instances on the play area
  const [instances, setInstances] = useState([]);
  // toasts
  const [toasts, setToasts] = useState([]);
  // ui
  const [search, setSearch] = useState('');
  const [helpOpen, setHelpOpen] = useState(() => {
    return localStorage.getItem('alchemia.seenHelp') !== '1';
  });
  const [filter, setFilter] = useState('all'); // all | new | locked

  // recent unlocks
  const [recent, setRecent] = useState([]);

  // tweaks
  const tweaksDefaults = /*EDITMODE-BEGIN*/{
    "soundOn": true,
    "showHints": true,
    "labelsAlways": true,
    "accentPalette": ["#FF5A1F","#B847C2","#FFC838"]
  }/*EDITMODE-END*/;
  const tweaks = window.useTweaks ? window.useTweaks(tweaksDefaults)[0] : tweaksDefaults;

  // discover element helper
  const discover = useCallback((key) => {
    setDiscovered(prev => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setRecent(prev => [key, ...prev.filter(k => k !== key)].slice(0, 8));
  }, []);

  // combine two instances
  const combineInstances = useCallback((aId, bId) => {
    setInstances(prev => {
      const a = prev.find(i => i.id === aId);
      const b = prev.find(i => i.id === bId);
      if (!a || !b || a.id === b.id) return prev;
      const result = DB.combine(a.key, b.key);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;

      if (!result) {
        // failure shake
        if (tweaks.soundOn) failSound();
        if (fx.current) fx.current.particles.burst(mx, my, '#7E7E7E', { count: 14, speed: 3 });
        return prev.map(i => {
          if (i.id === aId || i.id === bId) return { ...i, shake: Date.now() };
          return i;
        });
      }

      // success
      const wasDiscovered = discovered.has(result);
      const meta = DB.META[result] || { c: '#FFC838', e: '✨' };
      if (fx.current) {
        fx.current.particles.burst(mx, my, meta.c, { count: 50, speed: 7 });
        fx.current.particles.burst(mx, my, '#FFFFFF', { count: 20, speed: 4 });
        fx.current.ambient.pulse(wasDiscovered ? 0.3 : 0.9);
      }
      if (tweaks.soundOn) wasDiscovered ? successSound() : discoverySound();

      if (!wasDiscovered) {
        discover(result);
        setToasts(t => [...t, { id: uid(), key: result, time: Date.now() }]);
      }

      const next = prev.filter(i => i.id !== aId && i.id !== bId);
      next.push({ id: uid(), key: result, x: mx, y: my, born: Date.now() });
      return next;
    });
  }, [discovered, tweaks.soundOn, discover]);

  // dismiss toasts
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts(prev => prev.slice(1)), 3200);
    return () => clearTimeout(t);
  }, [toasts]);

  // dismiss help permanently
  const closeHelp = () => {
    setHelpOpen(false);
    localStorage.setItem('alchemia.seenHelp', '1');
  };

  // spawn element from library into play area
  const spawn = useCallback((key, x, y) => {
    setInstances(prev => [...prev, { id: uid(), key, x, y, born: Date.now() }]);
  }, []);

  // remove instance
  const remove = useCallback((id) => {
    setInstances(prev => prev.filter(i => i.id !== id));
  }, []);

  // clear play area
  const clearAll = () => setInstances([]);

  // reset
  const resetAll = () => {
    if (!confirm('Erase all discoveries? You will start from the 118 periodic table elements.')) return;
    setDiscovered(new Set(DB.STARTERS));
    setInstances([]);
    setRecent([]);
    localStorage.removeItem('alchemia.discovered');
  };

  // counts
  const total = DB.totalElements;
  const totalRecipes = DB.totalRecipes;
  const discoveredCount = discovered.size;
  const progress = discoveredCount / total;

  return (
    <div className="alc-root">
      <canvas ref={ambientRef} className="alc-ambient" />
      <canvas ref={particleRef} className="alc-particles" />

      <TopBar
        discoveredCount={discoveredCount}
        total={total}
        totalRecipes={totalRecipes}
        progress={progress}
        onHelp={() => setHelpOpen(true)}
        onReset={resetAll}
        onClear={clearAll}
      />

      <PlayArea
        ref={playRef}
        instances={instances}
        setInstances={setInstances}
        combine={combineInstances}
        remove={remove}
        fx={fx}
        labelsAlways={tweaks.labelsAlways}
      />

      <Library
        discovered={discovered}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        recent={recent}
        spawn={spawn}
        playRef={playRef}
        fx={fx}
      />

      {tweaks.showHints && (
        <HintTicker discovered={discovered} recent={recent} total={total} />
      )}

      <Toasts toasts={toasts} />

      {helpOpen && <Help onClose={closeHelp} totalRecipes={totalRecipes} />}
    </div>
  );
}

// ============ top bar ============
function TopBar({ discoveredCount, total, totalRecipes, progress, onHelp, onReset, onClear }) {
  return (
    <div className="alc-topbar">
      <div className="alc-brand">
        <div className="alc-logo">ALCHEMIA</div>
        <div className="alc-tagline">an experiment in everything · {totalRecipes.toLocaleString()} recipes</div>
      </div>
      <div className="alc-counter">
        <div className="alc-counter-num">
          <span className="alc-counter-discovered">{discoveredCount}</span>
          <span className="alc-counter-slash">/</span>
          <span className="alc-counter-total">{total}</span>
        </div>
        <div className="alc-counter-bar">
          <div className="alc-counter-bar-fill" style={{ width: (progress * 100).toFixed(1) + '%' }} />
        </div>
        <div className="alc-counter-label">DISCOVERED</div>
      </div>
      <div className="alc-actions">
        <button className="alc-btn" onClick={onClear} title="Clear play area">CLEAR</button>
        <button className="alc-btn" onClick={onHelp}>HOW</button>
        <button className="alc-btn alc-btn-ghost" onClick={onReset} title="Reset progress">⟲</button>
      </div>
    </div>
  );
}

// ============ play area ============
const PlayArea = React.forwardRef(function PlayArea(props, ref) {
  const { instances, setInstances, combine, remove, fx, labelsAlways } = props;
  const localRef = useRef(null);
  const areaRef = ref || localRef;

  // pointer drag state
  const dragRef = useRef(null);

  const onInstancePointerDown = (e, inst) => {
    e.stopPropagation();
    const rect = areaRef.current.getBoundingClientRect();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: inst.id,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left - inst.x,
      offsetY: e.clientY - rect.top - inst.y,
      moved: false
    };
    setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, dragging: true, z: Date.now() } : i));
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - d.offsetX;
    const y = e.clientY - rect.top - d.offsetY;
    d.moved = true;
    setInstances(prev => prev.map(i => i.id === d.id ? { ...i, x, y } : i));
    // trail emit
    if (fx.current && Math.random() < 0.35) {
      const inst = instancesRefCurrent(d.id);
      if (inst) {
        const meta = DB.META[inst.key];
        fx.current.particles.emit(inst.x + 30, inst.y + 30, meta?.c || '#FFC838');
      }
    }
  };

  // hack: get current instance position from DOM
  const instancesRefCurrent = (id) => {
    const node = areaRef.current?.querySelector(`[data-inst-id="${id}"]`);
    if (!node) return null;
    const transform = node.style.transform;
    const m = transform.match(/translate\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px\)/);
    if (!m) return null;
    return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;

    const rect = areaRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    setInstances(prev => {
      const me = prev.find(i => i.id === d.id);
      if (!me) return prev;
      // find another instance under pointer
      const TILE = 64;
      const target = prev.find(i => {
        if (i.id === d.id) return false;
        const cx = i.x + TILE/2;
        const cy = i.y + TILE/2;
        return Math.hypot(cx - (me.x + TILE/2), cy - (me.y + TILE/2)) < TILE * 0.9;
      });
      if (target) {
        // defer combine to next tick so we don't recurse
        setTimeout(() => combine(d.id, target.id), 0);
        return prev.map(i => i.id === d.id ? { ...i, dragging: false } : i);
      }
      return prev.map(i => i.id === d.id ? { ...i, dragging: false } : i);
    });
  };

  // accept drops from library
  useEffect(() => {
    const onDrop = (e) => {
      const data = e.detail;
      if (!data) return;
      const rect = areaRef.current.getBoundingClientRect();
      // only accept if drop is inside play area
      if (data.clientX < rect.left || data.clientX > rect.right ||
          data.clientY < rect.top || data.clientY > rect.bottom) return;
      const x = data.clientX - rect.left - 32;
      const y = data.clientY - rect.top - 32;
      props.instances; // noop
      // spawn
      window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: data.key, x, y } }));
    };
    window.addEventListener('alchemia:librarydrop', onDrop);
    return () => window.removeEventListener('alchemia:librarydrop', onDrop);
  }, []);

  // listen for spawn events
  useEffect(() => {
    const onSpawn = (e) => {
      const { key, x, y } = e.detail;
      setInstances(prev => [...prev, { id: uid(), key, x, y, born: Date.now() }]);
    };
    window.addEventListener('alchemia:spawn', onSpawn);
    return () => window.removeEventListener('alchemia:spawn', onSpawn);
  }, []);

  return (
    <div
      ref={areaRef}
      className="alc-playarea"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={(e) => {
        // double-click empty area = nothing (avoid accidental clear)
      }}
    >
      {instances.length === 0 && (
        <div className="alc-empty">
          <div className="alc-empty-glyph">◐◑◒◓</div>
          <div className="alc-empty-title">drag two elements together</div>
          <div className="alc-empty-sub">to discover what happens</div>
        </div>
      )}
      {instances.map(inst => (
        <Tile
          key={inst.id}
          inst={inst}
          onPointerDown={(e) => onInstancePointerDown(e, inst)}
          onRemove={() => remove(inst.id)}
          labelsAlways={labelsAlways}
        />
      ))}
    </div>
  );
});

// ============ tile (on play area) ============
function Tile({ inst, onPointerDown, onRemove, labelsAlways }) {
  const meta = DB.META[inst.key] || { e: '?', c: '#888' };
  const name = DB.displayName(inst.key);
  const age = Date.now() - (inst.born || 0);
  const isNew = age < 600;
  const isShaking = inst.shake && Date.now() - inst.shake < 400;
  return (
    <div
      data-inst-id={inst.id}
      className={`alc-tile-wrap ${inst.dragging ? 'is-dragging' : ''}`}
      style={{
        transform: `translate(${inst.x}px, ${inst.y}px)`,
        zIndex: inst.z || 1
      }}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => { e.preventDefault(); onRemove(); }}
    >
      <div
        className={`alc-tile ${isNew ? 'is-new' : ''} ${isShaking ? 'is-shake' : ''}`}
        style={{ '--tint': meta.c }}
      >
        <div className="alc-tile-emoji"><PixelIcon elKey={inst.key} /></div>
        {labelsAlways && <div className="alc-tile-label">{name}</div>}
        <div className="alc-tile-x" onPointerDown={(e) => { e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); onRemove(); }}>×</div>
      </div>
    </div>
  );
}

// ============ library ============
function Library({ discovered, search, setSearch, filter, setFilter, recent, spawn, playRef, fx }) {
  // sort all META by tier, only show discovered
  const items = useMemo(() => {
    const arr = [...discovered].map(k => ({ key: k, meta: DB.META[k] || { e: '?', c: '#888', t: 0 } }));
    const periodicOrder = new Map(DB.PERIODIC_TABLE_KEYS.map((k, i) => [k, i]));
    arr.sort((a, b) => {
      const aZ = periodicOrder.get(a.key);
      const bZ = periodicOrder.get(b.key);
      if (aZ !== undefined && bZ !== undefined) return aZ - bZ;
      if (aZ !== undefined) return -1;
      if (bZ !== undefined) return 1;
      if ((a.meta.t || 0) !== (b.meta.t || 0)) return (a.meta.t || 0) - (b.meta.t || 0);
      return a.key.localeCompare(b.key);
    });
    const q = search.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter(i => i.key.includes(q) || DB.displayName(i.key).toLowerCase().includes(q));
  }, [discovered, search]);

  // drag from library
  const dragRef = useRef(null);
  const listRef = useRef(null);

  // scroll strip — arrow visibility state
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const syncArrows = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 4);
  }, []);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
    return () => el.removeEventListener('scroll', syncArrows);
  }, [syncArrows]);
  useEffect(() => { syncArrows(); }, [items.length, syncArrows]);

  // 3-state snap sheet (mobile only)
  const SNAP_PEEK    = 56;
  const SNAP_DEFAULT = 220;
  const snapExpanded = () => Math.round(window.innerHeight * 0.55);
  const snapPoints   = () => [SNAP_PEEK, SNAP_DEFAULT, snapExpanded()];
  const handleRef = useRef(null);
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    let pid = null, startY = 0, startH = SNAP_DEFAULT;
    const getH = () => parseInt(document.documentElement.style.getPropertyValue('--lib-h') || SNAP_DEFAULT, 10);
    const setH = (h) => document.documentElement.style.setProperty('--lib-h', h + 'px');
    const snap = (h) => {
      const pts = snapPoints();
      setH(pts.reduce((a, b) => Math.abs(b - h) < Math.abs(a - h) ? b : a));
    };
    const onDown = (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault(); e.stopPropagation();
      handle.setPointerCapture(e.pointerId);
      pid = e.pointerId; startY = e.clientY; startH = getH();
      document.body.classList.add('lib-dragging');
    };
    const onMove = (e) => {
      if (e.pointerId !== pid) return;
      const pts = snapPoints();
      const h = Math.min(pts[pts.length - 1], Math.max(pts[0], startH + (startY - e.clientY)));
      setH(h);
    };
    const onUp = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      document.body.classList.remove('lib-dragging');
      const totalMove = Math.abs(e.clientY - startY);
      if (totalMove < 8) {
        const pts = snapPoints();
        const cur = getH();
        const idx = pts.findIndex(s => Math.abs(s - cur) < 20);
        setH(pts[(idx + 1) % pts.length]);
      } else {
        snap(getH());
      }
    };
    handle.addEventListener('pointerdown', onDown);
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
    if (window.innerWidth <= 900) setH(SNAP_DEFAULT);
    return () => {
      handle.removeEventListener('pointerdown', onDown);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
    };
  }, []);

  // scroll strip — native DOM listeners (React synthetic events don't reliably
  // handle setPointerCapture on iOS Safari)
  const stripRef = useRef(null);
  useEffect(() => {
    const strip = stripRef.current;
    const list = listRef.current;
    if (!strip || !list) return;
    let pid = null, startY = 0, startTop = 0;
    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      strip.setPointerCapture(e.pointerId);
      pid = e.pointerId;
      startY = e.clientY;
      startTop = list.scrollTop;
    };
    const onMove = (e) => {
      if (e.pointerId !== pid) return;
      const ratio = list.scrollHeight / Math.max(list.clientHeight, 1);
      list.scrollTop = startTop + (e.clientY - startY) * ratio;
    };
    const onUp = (e) => { if (e.pointerId === pid) pid = null; };
    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerup', onUp);
    strip.addEventListener('pointercancel', onUp);
    return () => {
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerup', onUp);
      strip.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onItemPointerDown = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { key, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };
    const ghost = document.createElement('div');
    ghost.className = 'alc-ghost';
    const meta = DB.META[key];
    ghost.innerHTML = `<div class="alc-tile-emoji alc-pixel">${ICONS.renderIcon(key)}</div>`;
    ghost.style.setProperty('--tint', meta.c);
    document.body.appendChild(ghost);
    ghost.style.left = (e.clientX - 32) + 'px';
    ghost.style.top = (e.clientY - 32) + 'px';
    dragRef.current.ghost = ghost;
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.ghost) {
      d.ghost.style.left = (e.clientX - 32) + 'px';
      d.ghost.style.top = (e.clientY - 32) + 'px';
    }
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.ghost) d.ghost.remove();
    window.dispatchEvent(new CustomEvent('alchemia:librarydrop', {
      detail: { key: d.key, clientX: e.clientX, clientY: e.clientY }
    }));
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    if (moved < 8 && playRef.current) {
      const rect = playRef.current.getBoundingClientRect();
      const x = rect.width / 2 - 32 + (Math.random() - 0.5) * 80;
      const y = rect.height / 2 - 32 + (Math.random() - 0.5) * 80;
      window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: d.key, x, y } }));
    }
    dragRef.current = null;
  };

  return (
    <div className="alc-library" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="alc-lib-handle" ref={handleRef}>
        <div className="alc-lib-handle-pill" />
      </div>
      <div className="alc-library-head">
        <div className="alc-library-title">LIBRARY</div>
        <div className="alc-library-count">{discovered.size} elements</div>
      </div>
      <div className="alc-search-wrap">
        <input
          className="alc-search"
          placeholder="search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {recent.length > 0 && (
        <div className="alc-recent">
          <div className="alc-recent-label">RECENT</div>
          <div className="alc-recent-row">
            {recent.slice(0, 6).map((k, i) => {
              const m = DB.META[k] || { e: '?', c: '#888' };
              return (
                <div key={i} className="alc-recent-dot" title={DB.displayName(k)}>
                  <PixelIcon elKey={k} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="alc-library-scroll-area">
        <div className="alc-library-list" ref={listRef}>
          {items.map(({ key, meta }) => {
            const pt = window.PeriodicTable?.BY_NAME[key.toLowerCase()];
            if (pt) {
              const stateAbbr = { solid: 's', liquid: 'l', gas: 'g' }[pt.state] || '';
              return (
                <div
                  key={key}
                  className="alc-lib-item alc-lib-item--pt"
                  onPointerDown={(e) => onItemPointerDown(e, key)}
                  style={{ '--tint': meta.c }}
                  title={`${pt.name} — ${pt.cat}`}
                >
                  <div className="alc-pt-z">{pt.z}</div>
                  <div className="alc-pt-state">{stateAbbr}</div>
                  <div className="alc-pt-icon"><PixelIcon elKey={key} /></div>
                  <div className="alc-pt-name">{pt.name}</div>
                  <div className="alc-pt-weight">{pt.weight}</div>
                  <div className="alc-pt-shells">{pt.shells.join('·')}</div>
                </div>
              );
            }
            return (
              <div
                key={key}
                className="alc-lib-item"
                onPointerDown={(e) => onItemPointerDown(e, key)}
                style={{ '--tint': meta.c }}
                title={DB.displayName(key)}
              >
                <div className="alc-lib-emoji"><PixelIcon elKey={key} /></div>
                <div className="alc-lib-name">{DB.displayName(key)}</div>
                <div className="alc-lib-tier">T{meta.t}</div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="alc-lib-empty">No matches.</div>
          )}
        </div>
        <div className="alc-lib-strip" ref={stripRef}>
          <div className={`alc-lib-arrow${canScrollUp ? ' can-scroll' : ''}`}
            onClick={() => listRef.current?.scrollBy({ top: -80, behavior: 'smooth' })}>
            <PixelArrowUp />
          </div>
          <div className="alc-lib-track" />
          <div className={`alc-lib-arrow${canScrollDown ? ' can-scroll' : ''}`}
            onClick={() => listRef.current?.scrollBy({ top: 80, behavior: 'smooth' })}>
            <PixelArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ hint ticker ============
function HintTicker({ discovered, recent, total }) {
  // suggest possible recipes from discovered elements (only ones we haven't done yet)
  const hints = useMemo(() => {
    const dArr = [...discovered];
    const possible = [];
    for (let i = 0; i < dArr.length; i++) {
      for (let j = i; j < dArr.length; j++) {
        const r = DB.combine(dArr[i], dArr[j]);
        if (r && !discovered.has(r)) {
          possible.push({ a: dArr[i], b: dArr[j], r });
        }
      }
    }
    // sample 3
    const out = [];
    for (let k = 0; k < Math.min(3, possible.length); k++) {
      const idx = Math.floor(Math.random() * possible.length);
      out.push(possible[idx]);
      possible.splice(idx, 1);
    }
    return out;
  }, [discovered.size, recent]);

  return (
    <div className="alc-ticker">
      <div className="alc-ticker-label">HINTS</div>
      <div className="alc-ticker-row">
        {hints.length === 0 && <div className="alc-ticker-empty">try combining what you have</div>}
        {hints.map((h, i) => (
          <div key={i} className="alc-ticker-hint">
            <span className="alc-ticker-icon"><PixelIcon elKey={h.a} /></span>
            <span className="alc-ticker-plus">+</span>
            <span className="alc-ticker-icon"><PixelIcon elKey={h.b} /></span>
            <span className="alc-ticker-plus">=</span>
            <span className="alc-ticker-q">?</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ toasts ============
function Toasts({ toasts }) {
  return (
    <div className="alc-toasts">
      {toasts.map(t => {
        const m = DB.META[t.key] || { e: '?', c: '#888' };
        return (
          <div key={t.id} className="alc-toast" style={{ '--tint': m.c }}>
            <div className="alc-toast-glyph"><PixelIcon elKey={t.key} /></div>
            <div className="alc-toast-text">
              <div className="alc-toast-label">NEW DISCOVERY</div>
              <div className="alc-toast-name">{DB.displayName(t.key)}</div>
            </div>
            <div className="alc-toast-spark">✦</div>
          </div>
        );
      })}
    </div>
  );
}

// ============ help ============
function Help({ onClose, totalRecipes }) {
  return (
    <div className="alc-help-backdrop" onClick={onClose}>
      <div className="alc-help" onClick={(e) => e.stopPropagation()}>
        <div className="alc-help-eye">◉</div>
        <div className="alc-help-title">ALCHEMIA</div>
        <div className="alc-help-sub">a playground for combining the world</div>
        <div className="alc-help-rules">
          <div className="alc-help-row">
            <div className="alc-help-num">01</div>
            <div className="alc-help-body">
              <b>drag or tap</b> an element from the library into the play area.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">02</div>
            <div className="alc-help-body">
              <b>drop one element onto another</b> to combine them. you'll feel it.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">03</div>
            <div className="alc-help-body">
              every successful combine unlocks a <b>new element</b> in your library. {totalRecipes.toLocaleString()} recipes await.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">04</div>
            <div className="alc-help-body">
              tap × or long-press a tile to remove it from the play area.
            </div>
          </div>
        </div>
        <div className="alc-help-start" onClick={onClose}>BEGIN →</div>
        <div className="alc-help-footnote">start with all 118 periodic table elements — combine them to discover everything else</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
